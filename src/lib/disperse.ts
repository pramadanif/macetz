import type { Address, PublicClient } from "viem";
import { CONFIDENTIAL_BALANCE_ABI } from "./abis";

/** Official TokenOps DisperseConfidential singleton on Sepolia (from DEPLOYED_ADDRESSES). */
export const DISPERSE_SINGLETON_SEPOLIA =
  "0x710dD9885Cc9986EfD234E7719483147a6d8DBb4" as const;

export type RecipientClaimStatus = "pending" | "claimed";

export interface DisperseCampaign {
  id: string;
  txHash: `0x${string}`;
  token: `0x${string}`;
  tokenSymbol: string;
  recipients: `0x${string}`[];
  sender: `0x${string}`;
  createdAt: number;
}

const CAMPAIGN_STORAGE_KEY = "macetz_disperse_campaigns";

export function loadDisperseCampaigns(): DisperseCampaign[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CAMPAIGN_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as DisperseCampaign[];
  } catch {
    return [];
  }
}

export function saveDisperseCampaign(campaign: DisperseCampaign): void {
  const existing = loadDisperseCampaigns();
  const next = [campaign, ...existing.filter((c) => c.id !== campaign.id)].slice(
    0,
    20
  );
  localStorage.setItem(CAMPAIGN_STORAGE_KEY, JSON.stringify(next));
}

/** Zero handle means the recipient no longer holds a confidential allocation on-chain. */
export async function getRecipientClaimStatus(
  client: PublicClient,
  token: Address,
  recipient: Address
): Promise<RecipientClaimStatus> {
  const handle = (await client.readContract({
    address: token,
    abi: CONFIDENTIAL_BALANCE_ABI,
    functionName: "confidentialBalanceOf",
    args: [recipient],
  })) as `0x${string}`;

  const isEmpty =
    handle ===
    "0x0000000000000000000000000000000000000000000000000000000000000000";
  return isEmpty ? "claimed" : "pending";
}

export function parseRecipientCsv(text: string): { address: string; amount: string }[] {
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
