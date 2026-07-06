export type PairSource = "registry" | "local-dev" | "browser-preview";

/**
 * Integrity status computed by the registry integrity checker.
 * - "verified": pair passed all sanity checks
 * - "flagged": pair has at least one anomaly (see integrityReason)
 */
export type IntegrityStatus = "verified" | "flagged";

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
  /** Integrity check result — computed after registry load. */
  integrityStatus: IntegrityStatus;
  /** Human-readable reason when integrityStatus === "flagged". */
  integrityReason?: string;
  /** Registry-only example from config — never offered in Shield/Decrypt/Distribute. */
  configOnly?: boolean;
}

export interface CustomPairEntry {
  erc20: string;
  erc7984: string;
  symbol: string;
  decimals: number;
  source: "local-dev";
  iconUrl?: string;
  /** When true, pair is a docs/registry example only — not deployed on-chain. */
  configExample?: boolean;
}

export interface CustomPairsConfig {
  /** ChainId-keyed pairs — e.g. "11155111" (Sepolia), "1" (Mainnet). */
  [chainId: string]: CustomPairEntry[];
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
