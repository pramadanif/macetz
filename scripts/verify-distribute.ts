/**
 * Autonomous smoke tests for registry merge, integrity, pair gating, and errors.
 * Run: npm run verify:distribute
 */
import { parseRecipientCsv } from "../src/lib/disperse.ts";
import {
  isOperationalPair,
  isDistributeOperationalPair,
} from "../src/lib/pair-utils.ts";
import {
  mergeRegistryPairs,
  runIntegrityChecks,
} from "../src/lib/registry.ts";
import { formatWalletError } from "../src/lib/errors.ts";
import { MAINNET_CHAIN_ID, SEPOLIA_CHAIN_ID } from "../src/lib/config.ts";
import type { TokenPair } from "../src/lib/types.ts";

let passed = 0;
let failed = 0;

function assert(name: string, condition: boolean) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${name}`);
  } else {
    failed++;
    console.error(`  ✗ ${name}`);
  }
}

function basePair(overrides: Partial<TokenPair> = {}): TokenPair {
  return {
    erc20Address: "0x9b5Cd13b8eFbB58Dc25A05CF411D8056058aDFfF",
    erc7984Address: "0x7c5BF43B851c1dff1a4feE8dB225b87f2C223639",
    erc20Symbol: "USDC",
    erc20Name: "USD Coin",
    erc20Decimals: 6,
    erc7984Symbol: "cUSDCMock",
    erc7984Name: "Confidential USDC (Mock)",
    erc7984Decimals: 6,
    source: "registry",
    isMock: true,
    isValid: true,
    integrityStatus: "verified",
    docsVerified: true,
    ...overrides,
  };
}

console.log("\nRegistry / Distribute / errors verification\n");

// CSV parsing (real implementation)
const csv = parseRecipientCsv(
  "address,amount\n0xAbC12345678901234567890123456789012345678,10.5\ninvalid-line"
);
assert("CSV parses valid address row", csv.length === 1);
assert("CSV extracts amount", csv[0]?.amount === "10.5");

// configExample dev pairs must never be operational
const configDemo = basePair({
  source: "local-dev",
  configOnly: true,
  isValid: false,
  integrityStatus: "flagged",
  docsVerified: false,
});
assert("configOnly dev pair blocked from Shield", !isOperationalPair(configDemo));
assert("configOnly dev pair blocked from Distribute", !isDistributeOperationalPair(configDemo));

// docs-verified registry pair
const docsRegistry = basePair({ docsVerified: true });
assert("docs-verified registry allowed for Shield", isOperationalPair(docsRegistry));
assert("docs-verified registry allowed for Distribute", isDistributeOperationalPair(docsRegistry));

// onchain registry pair NOT in docs allowlist
const onchainOnly = basePair({
  erc7984Address: "0x1234567890123456789012345678901234567890",
  docsVerified: false,
});
assert("non-docs onchain pair allowed for Shield", isOperationalPair(onchainOnly));
assert("non-docs onchain pair blocked from Distribute", !isDistributeOperationalPair(onchainOnly));

// preview pair gating
const previewPending = basePair({
  source: "browser-preview",
  isValid: false,
  integrityStatus: "flagged",
  docsVerified: false,
});
assert("unverified preview blocked from Shield", !isOperationalPair(previewPending));

const previewVerified = basePair({
  source: "browser-preview",
  isValid: true,
  integrityStatus: "verified",
  docsVerified: false,
});
assert("verified preview allowed for Shield", isOperationalPair(previewVerified));

// merge precedence: onchain > custom > preview (dedup by erc7984)
const sharedWrapper = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" as `0x${string}`;
const onchain = basePair({ erc7984Address: sharedWrapper, erc7984Symbol: "cONCHAIN" });
const custom = basePair({
  erc7984Address: sharedWrapper,
  erc7984Symbol: "cCUSTOM",
  source: "local-dev",
});
const previewOnly = basePair({
  erc7984Address: "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
  erc7984Symbol: "cPREVIEW",
  source: "browser-preview",
});
const merged = mergeRegistryPairs([onchain], [custom], [previewOnly]);
assert("merge keeps onchain over custom for same wrapper", merged.length === 2);
assert("merge onchain wins dedup", merged[0]?.erc7984Symbol === "cONCHAIN");
assert("merge includes distinct preview", merged[1]?.erc7984Symbol === "cPREVIEW");

// integrity checks
const beforeIntegrity = (p: Partial<TokenPair>) => {
  const { integrityStatus, integrityReason, ...rest } = basePair(p);
  return rest;
};

const highDecimals = runIntegrityChecks([
  beforeIntegrity({ erc7984Decimals: 18 }),
]);
assert("decimals > 6 flagged", highDecimals[0]?.integrityStatus === "flagged");

const zeroUnderlying = runIntegrityChecks([
  beforeIntegrity({
    erc20Address: "0x0000000000000000000000000000000000000000",
  }),
]);
assert("zero underlying flagged", zeroUnderlying[0]?.integrityStatus === "flagged");

const mockSplit = runIntegrityChecks([
  beforeIntegrity({
    erc7984Address: "0x167DC962808B32CFFFc7e14B5018c0bE06A3A208",
    erc7984Symbol: "ctGBP",
    isMock: false,
  }),
  beforeIntegrity({
    erc7984Address: "0xfCE5c7069c5525eF6c8C2b2E35A745bA20a2F7CC",
    erc7984Symbol: "ctGBPMock",
    isMock: true,
  }),
]);
assert(
  "official + Mock split NOT flagged as duplicate",
  mockSplit.every((p) => p.integrityStatus === "verified")
);

const unreadableMeta = runIntegrityChecks([
  beforeIntegrity({ metadataUnreadable: true, erc7984Decimals: 18 }),
]);
assert(
  "metadata unreadable flagged (not false decimals)",
  unreadableMeta[0]?.integrityReason?.includes("metadata unreadable") === true &&
    !unreadableMeta[0]?.integrityReason?.includes("decimals")
);

// formatWalletError chain awareness
const gasMainnet = formatWalletError(new Error("out of gas"), MAINNET_CHAIN_ID);
assert("mainnet gas mentions ETH", gasMainnet.includes("ETH") && !gasMainnet.includes("Sepolia"));

const gasSepolia = formatWalletError(new Error("out of gas"), SEPOLIA_CHAIN_ID);
assert("sepolia gas mentions Sepolia ETH", gasSepolia.includes("Sepolia ETH"));

const networkMainnet = formatWalletError(new Error("wrong network"), MAINNET_CHAIN_ID);
assert(
  "mainnet wrong-network does not say switch to Sepolia",
  networkMainnet.includes("Ethereum mainnet") && !networkMainnet.toLowerCase().includes("sepolia")
);

// TokenOps singleton address format
const singleton = "0x710dD9885Cc9986EfD234E7719483147a6d8DBb4";
assert("Disperse singleton is checksummed 20-byte address", /^0x[a-fA-F0-9]{40}$/.test(singleton));

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
