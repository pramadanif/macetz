export type PairSource = "registry" | "local-dev";

export interface TokenPair {
  erc20Address: `0x${string}`;
  erc7984Address: `0x${string}`;
  erc20Symbol: string;
  erc20Name: string;
  erc20Decimals: number;
  erc7984Symbol: string;
  erc7984Name: string;
  erc7984Decimals: number;
  source: PairSource;
  isMock: boolean;
  isValid: boolean;
}

export interface CustomPairEntry {
  erc20: string;
  erc7984: string;
  symbol: string;
  decimals: number;
  source: "local-dev";
  iconUrl?: string;
}

export interface CustomPairsConfig {
  pairs: CustomPairEntry[];
}

export interface UnwrapRequest {
  id: bigint;
  receiver: `0x${string}`;
  amount: bigint;
  status: "pending" | "finalizing" | "completed" | "failed";
  txHash?: `0x${string}`;
}

export type WrapStep = "idle" | "approving" | "wrapping" | "confirmed" | "error";
export type UnwrapStep =
  | "idle"
  | "requesting"
  | "pending-finalization"
  | "finalizing"
  | "confirmed"
  | "error";
export type DecryptStep = "idle" | "signing" | "decrypting" | "done" | "error";
