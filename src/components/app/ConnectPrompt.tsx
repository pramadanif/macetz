"use client";

import React from "react";
import { CoinPlaceholder } from "@/components/CoinPlaceholder";
import { WalletButton } from "@/components/app/WalletButton";

export function ConnectPrompt() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-5">
      <div className="emboss-card rounded-2xl p-10 text-center max-w-sm">
        <div className="relative z-10">
          <div className="w-16 h-16 mx-auto mb-5">
            <CoinPlaceholder type="gold" size="lg" className="w-16 h-16 shadow-md" />
          </div>
          <h2 className="text-xl font-semibold tracking-tight mb-2">
            Connect your wallet
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            Connect a Sepolia-enabled wallet to browse the registry, shield tokens,
            and decrypt confidential balances.
          </p>
          <WalletButton />
        </div>
      </div>
    </div>
  );
}
