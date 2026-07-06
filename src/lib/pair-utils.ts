import type { PublicClient } from "viem";
import type { TokenPair } from "./types";

/** True when pair is safe for Shield / Decrypt / Distribute (real on-chain wrapper). */
export function isOperationalPair(pair: TokenPair): boolean {
  return pair.isValid && pair.integrityStatus === "verified";
}

/** Verify local-dev config pairs have deployed wrapper bytecode. */
export async function enrichLocalDevPair(
  publicClient: PublicClient,
  pair: TokenPair
): Promise<TokenPair> {
  if (pair.source !== "local-dev") return pair;

  try {
    const code = await publicClient.getBytecode({ address: pair.erc7984Address });
    if (!code || code === "0x") {
      return {
        ...pair,
        isValid: false,
        integrityStatus: "flagged",
        integrityReason:
          "Config-only Dev Pair — no contract at this address. Deploy via dev-guide or use Add a Pair.",
      };
    }
    return { ...pair, isValid: true, integrityStatus: "verified" };
  } catch {
    return {
      ...pair,
      isValid: false,
      integrityStatus: "flagged",
      integrityReason: "Could not verify wrapper contract on this network.",
    };
  }
}
