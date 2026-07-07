"use client";

import React, { useState, useEffect } from "react";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { injected } from "wagmi/connectors";
import { CHAIN_ID } from "@/lib/config";

const connector = injected();

export function WalletButton() {
  const { address, isConnected, chainId } = useAccount();
  const { connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button
        disabled
        className="flex items-center gap-2 bg-[#16171C] text-white font-medium text-[13px] px-5 py-2.5 rounded-full opacity-50"
      >
        Connect Wallet
      </button>
    );
  }

  if (isConnected && address) {
    if (!chainId || (chainId !== 11155111 && chainId !== 1)) {
      return (
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
            Unsupported Network
          </span>
          <button
            onClick={() => disconnect()}
            className="text-xs text-gray-500 hover:text-red-600 bg-white/60 px-3 py-1.5 rounded-full border border-white/60 transition-colors"
          >
            Disconnect
          </button>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono text-gray-500 bg-white/60 px-3 py-1.5 rounded-full border border-white/60">
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
        <button
          onClick={() => disconnect()}
          className="text-xs text-gray-500 hover:text-red-600 bg-white/60 px-3 py-1.5 rounded-full border border-white/60 transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => connect({ connector, chainId: CHAIN_ID })}
      disabled={isPending}
      className="flex items-center gap-2 bg-[#16171C] hover:bg-black text-white font-medium text-[13px] px-5 py-2.5 rounded-full transition-all duration-300 hover:shadow-lg disabled:opacity-50"
    >
      {isPending ? "Connecting..." : "Connect Wallet"}
    </button>
  );
}
