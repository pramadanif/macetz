import { type PublicClient } from "viem";
import { ERC165_ABI, ERC7984_INTERFACE_ID } from "./abis";
import type { TokenPair } from "./types";

/** True when pair is safe for Shield / Decrypt (valid on-chain registry or verified custom). */
export function isOperationalPair(pair: TokenPair): boolean {
  if (pair.configOnly) return false;
  if (pair.source === "registry") return pair.isValid;
  return pair.isValid && pair.integrityStatus === "verified";
}

/**
 * Stricter gate for TokenOps Distribute (payroll safety).
 * Registry pairs must be docs-verified; custom/preview pairs need on-chain verification.
 */
export function isDistributeOperationalPair(pair: TokenPair): boolean {
  if (pair.configOnly) return false;
  if (pair.source === "registry") return pair.isValid && pair.docsVerified === true;
  return pair.isValid && pair.integrityStatus === "verified";
}

const CONFIG_ONLY_REASON =
  "Registry display only — example config entry. Deploy via dev-guide or Add a Pair to use Shield/Decrypt.";

/** Verify custom / preview pairs have a live ERC-7984 wrapper on the active network. */
export async function enrichPairForOperations(
  publicClient: PublicClient,
  pair: TokenPair
): Promise<TokenPair> {
  if (pair.configOnly) {
    return {
      ...pair,
      isValid: false,
      integrityStatus: "flagged",
      integrityReason: CONFIG_ONLY_REASON,
    };
  }

  if (pair.source === "registry") return pair;

  try {
    const code = await publicClient.getBytecode({ address: pair.erc7984Address });
    if (!code || code === "0x") {
      return {
        ...pair,
        isValid: false,
        integrityStatus: "flagged",
        integrityReason:
          "No contract at wrapper address on this network. Deploy contracts or pick an official registry pair.",
      };
    }

    const isErc7984 = await publicClient.readContract({
      address: pair.erc7984Address,
      abi: ERC165_ABI,
      functionName: "supportsInterface",
      args: [ERC7984_INTERFACE_ID],
    });

    if (!isErc7984) {
      return {
        ...pair,
        isValid: false,
        integrityStatus: "flagged",
        integrityReason: "Address has code but does not implement ERC-7984.",
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

/** @deprecated Use enrichPairForOperations */
export const enrichLocalDevPair = enrichPairForOperations;
