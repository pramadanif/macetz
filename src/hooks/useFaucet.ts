"use client";

import { useState, useCallback } from "react";
import { useConfig, useConnection, usePublicClient } from "wagmi";
import { writeContract, switchChain } from "@wagmi/core";
import { parseUnits } from "viem";
import { ERC20_ABI } from "@/lib/abis";
import { CHAIN_ID, FAUCET_MINT_CAP } from "@/lib/config";
import { formatWalletError } from "@/lib/errors";

export function useFaucet() {
  const config = useConfig();
  const { address, isConnected, chainId } = useConnection();
  const publicClient = usePublicClient();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);

  const mint = useCallback(
    async (tokenAddress: `0x${string}`, decimals: number, amount?: bigint) => {
      if (!isConnected || !address || !publicClient) {
        const msg = "Wallet not connected";
        setError(msg);
        throw new Error(msg);
      }

      setIsPending(true);
      setError(null);
      setTxHash(null);

      try {
        if (chainId !== CHAIN_ID) {
          await switchChain(config, { chainId: CHAIN_ID });
        }

        const mintAmount = amount ?? parseUnits(FAUCET_MINT_CAP.toString(), decimals);

        const hash = await writeContract(config, {
          address: tokenAddress,
          abi: ERC20_ABI,
          functionName: "mint",
          args: [address, mintAmount],
          account: address,
          chainId: CHAIN_ID,
        });

        setTxHash(hash);
        await publicClient.waitForTransactionReceipt({ hash });
        return hash;
      } catch (e) {
        setError(formatWalletError(e));
        throw e;
      } finally {
        setIsPending(false);
      }
    },
    [config, address, isConnected, chainId, publicClient]
  );

  return { mint, isPending, error, txHash };
}
