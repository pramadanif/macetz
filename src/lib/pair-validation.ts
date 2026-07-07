import { type PublicClient, getAddress, isAddress, zeroAddress } from "viem";
import { ERC20_ABI, ERC165_ABI, ERC7984_INTERFACE_ID } from "./abis";

export interface ValidatedPairMetadata {
  erc20: `0x${string}`;
  erc7984: `0x${string}`;
  erc20Symbol: string;
  erc20Decimals: number;
  erc7984Symbol: string;
  erc7984Decimals: number;
}

export type PairValidationResult =
  | { ok: true; metadata: ValidatedPairMetadata }
  | { ok: false; error: string };

/**
 * Validates a candidate pair against the connected network before preview add.
 * Reuses the same on-chain checks integrity relies on (ERC-7984 interface, decimals cap).
 */
export async function validateNewPair(
  client: PublicClient,
  erc20Input: string,
  erc7984Input: string
): Promise<PairValidationResult> {
  if (!isAddress(erc20Input)) {
    return { ok: false, error: "ERC-20 address is not a valid Ethereum address." };
  }
  if (!isAddress(erc7984Input)) {
    return { ok: false, error: "ERC-7984 address is not a valid Ethereum address." };
  }

  let erc20: `0x${string}`;
  let erc7984: `0x${string}`;
  try {
    erc20 = getAddress(erc20Input);
    erc7984 = getAddress(erc7984Input);
  } catch {
    return { ok: false, error: "Address checksum is invalid — check for typos." };
  }

  if (erc20 === zeroAddress || erc7984 === zeroAddress) {
    return { ok: false, error: "Zero address is not allowed." };
  }

  const isErc7984 = await client.readContract({
    address: erc7984,
    abi: ERC165_ABI,
    functionName: "supportsInterface",
    args: [ERC7984_INTERFACE_ID],
  });

  if (!isErc7984) {
    return {
      ok: false,
      error: "This address doesn't implement the ERC-7984 interface (0x4958f2a4).",
    };
  }

  const [erc20Symbol, erc20Decimals, erc7984Symbol, erc7984Decimals] =
    await Promise.all([
      client.readContract({ address: erc20, abi: ERC20_ABI, functionName: "symbol" }),
      client.readContract({ address: erc20, abi: ERC20_ABI, functionName: "decimals" }),
      client.readContract({ address: erc7984, abi: ERC20_ABI, functionName: "symbol" }),
      client.readContract({ address: erc7984, abi: ERC20_ABI, functionName: "decimals" }),
    ]);

  const wrapperDecimals = Number(erc7984Decimals);
  if (wrapperDecimals > 6) {
    return {
      ok: false,
      error: `Wrapper has ${wrapperDecimals} decimals (ERC-7984 expects ≤ 6).`,
    };
  }

  return {
    ok: true,
    metadata: {
      erc20,
      erc7984,
      erc20Symbol: erc20Symbol as string,
      erc20Decimals: Number(erc20Decimals),
      erc7984Symbol: erc7984Symbol as string,
      erc7984Decimals: wrapperDecimals,
    },
  };
}
