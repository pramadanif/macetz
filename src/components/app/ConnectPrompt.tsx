"use client";

import React from "react";
import { CoinPlaceholder } from "@/components/CoinPlaceholder";
import { WalletButton } from "@/components/app/WalletButton";

export function ConnectPrompt() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <div className="emboss-card rounded-3xl p-12 text-center max-w-md">
        <div className="relative z-10">
          <div className="w-20 h-20 mx-auto mb-6">
            <CoinPlaceholder type="gold" size="lg" className="w-20 h-20 shadow-lg" />
          </div>
          <h2 className="text-2xl font-semibold tracking-tight mb-3">
            Connect your wallet
          </h2>
          <p className="text-gray-500 text-[15px] leading-relaxed mb-8">
            Connect a Sepolia-enabled wallet to browse the registry, wrap tokens,
            and decrypt confidential balances.
          </p>
          <WalletButton />
        </div>
      </div>
    </div>
  );
}
