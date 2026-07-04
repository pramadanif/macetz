"use client";

import { useState, useCallback } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { parseUnits } from "viem";
import { ERC20_ABI } from "@/lib/abis";
import { FAUCET_MINT_CAP } from "@/lib/config";

export function useFaucet() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);

  const mint = useCallback(
    async (tokenAddress: `0x${string}`, decimals: number, amount?: bigint) => {
      if (!address || !walletClient || !publicClient) {
        setError("Wallet not connected");
        return;
      }

      setIsPending(true);
      setError(null);
      setTxHash(null);

      try {
        const mintAmount = amount ?? parseUnits(FAUCET_MINT_CAP.toString(), decimals);

        const hash = await walletClient.writeContract({
          address: tokenAddress,
          abi: ERC20_ABI,
          functionName: "mint",
          args: [address, mintAmount],
        });

        setTxHash(hash);
        await publicClient.waitForTransactionReceipt({ hash });
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Mint failed";
        setError(msg);
      } finally {
        setIsPending(false);
      }
    },
    [address, walletClient, publicClient]
  );

  return { mint, isPending, error, txHash };
}
