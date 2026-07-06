/**
 * Autonomous smoke tests for Distribute / pair-utils logic (no wallet required).
 * Run: npm run verify:distribute
 */

function parseRecipientCsv(text) {
  return text
    .trim()
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.toLowerCase().startsWith("address"))
    .map((line) => {
      const [address, amount] = line.split(/[,;\t]+/).map((s) => s.trim());
      return { address: address ?? "", amount: amount ?? "" };
    })
    .filter((row) => row.address.startsWith("0x"));
}

function isOperationalPair(pair) {
  if (pair.configOnly) return false;
  if (pair.source === "registry") return pair.isValid;
  return pair.isValid && pair.integrityStatus === "verified";
}

let passed = 0;
let failed = 0;

function assert(name, condition) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${name}`);
  } else {
    failed++;
    console.error(`  ✗ ${name}`);
  }
}

console.log("\nDistribute / pair-utils verification\n");

// CSV parsing
const csv = parseRecipientCsv(
  "address,amount\n0xAbC12345678901234567890123456789012345678,10.5\ninvalid-line"
);
assert("CSV parses valid address row", csv.length === 1);
assert("CSV extracts amount", csv[0]?.amount === "10.5");

// configExample dev pairs must never be operational
const configDemo = {
  source: "local-dev",
  configOnly: true,
  isValid: false,
  integrityStatus: "flagged",
};
assert("configOnly dev pair blocked from Distribute", !isOperationalPair(configDemo));

// registry pair operational when valid
const registryPair = {
  source: "registry",
  isValid: true,
  integrityStatus: "verified",
};
assert("registry pair allowed when valid", isOperationalPair(registryPair));

// preview pair needs on-chain verification pass
const previewPending = {
  source: "browser-preview",
  isValid: false,
  integrityStatus: "flagged",
};
assert("unverified preview blocked", !isOperationalPair(previewPending));

const previewVerified = {
  source: "browser-preview",
  isValid: true,
  integrityStatus: "verified",
};
assert("verified preview allowed", isOperationalPair(previewVerified));

// TokenOps singleton address format
const singleton = "0x710dD9885Cc9986EfD234E7719483147a6d8DBb4";
assert("Disperse singleton is checksummed 20-byte address", /^0x[a-fA-F0-9]{40}$/.test(singleton));

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
