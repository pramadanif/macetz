"use client";

import React, { useState, useEffect, useRef, type ReactNode } from "react";
import { useConnection, useSwitchChain } from "wagmi";
import { CHAIN_ID } from "@/lib/config";

export function NetworkGuard({ children }: { children: ReactNode }) {
  const { isConnected, chainId } = useConnection();
  const { switchChain, isPending } = useSwitchChain();
  const [mounted, setMounted] = useState(false);
  const promptedRef = useRef(false);

  useEffect(() => setMounted(true), []);

  const wrongNetwork = mounted && isConnected && chainId !== undefined && chainId !== CHAIN_ID;

  useEffect(() => {
    if (!wrongNetwork) {
      promptedRef.current = false;
      return;
    }
    if (promptedRef.current) return;
    promptedRef.current = true;
    switchChain({ chainId: CHAIN_ID });
  }, [wrongNetwork, switchChain]);

  if (!mounted || !isConnected || chainId === CHAIN_ID) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
      <div className="emboss-card p-8 text-center max-w-sm">
        <div className="relative z-10">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-100 flex items-center justify-center">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-red-500"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight mb-3">
            Wrong network
          </h2>
          <p className="text-gray-500 text-[15px] leading-relaxed mb-6">
            Macetz runs on Sepolia testnet. Approve the network switch in your wallet to continue.
          </p>
          <button
            onClick={() => switchChain({ chainId: CHAIN_ID })}
            disabled={isPending}
            className="inline-flex items-center gap-2 bg-[#16171C] hover:bg-black text-white font-semibold text-sm px-7 py-3.5 rounded-full transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50"
          >
            {isPending ? "Switching..." : "Switch to Sepolia"}
          </button>
        </div>
      </div>
    </div>
  );
}
