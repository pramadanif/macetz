"use client";

import React from "react";
import { Wallet } from "lucide-react";
import { WalletButton } from "@/components/app/WalletButton";

export function ConnectPrompt() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-5">
      <div className="emboss-card p-10 text-center max-w-sm">
        <div className="relative z-10">
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-tr from-gray-100 to-white border border-gray-200 shadow-sm rounded-2xl flex items-center justify-center">
            <Wallet className="w-8 h-8 text-gray-800" strokeWidth={1.5} />
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-3">
            Connect your wallet
          </h2>
          <p className="text-gray-500 text-[15px] leading-relaxed mb-8">
            Connect a Sepolia-enabled wallet to browse the registry, shield tokens,
            and decrypt confidential balances.
          </p>
          <div className="flex justify-center">
            <WalletButton />
          </div>
        </div>
      </div>
    </div>
  );
}
