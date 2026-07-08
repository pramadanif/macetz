import type { TokenPair } from "@/lib/types";

/**
 * A clean, valid registry TokenPair. Override any field to construct the
 * specific case a test needs. Mirrors the real cUSDCMock pair shape.
 */
export function basePair(overrides: Partial<TokenPair> = {}): TokenPair {
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

/** Same as basePair but without the integrity annotations — for runIntegrityChecks inputs. */
export function beforeIntegrity(
  overrides: Partial<TokenPair> = {}
): Omit<TokenPair, "integrityStatus" | "integrityReason"> {
  const { integrityStatus, integrityReason, ...rest } = basePair(overrides);
  void integrityStatus;
  void integrityReason;
  return rest;
}
