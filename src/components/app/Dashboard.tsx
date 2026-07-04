"use client";

import React from "react";
import { useAccount } from "wagmi";
import { CoinPlaceholder } from "@/components/CoinPlaceholder";
import { WalletButton } from "@/components/app/WalletButton";

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

const features = [
  {
    title: "Shield Tokens",
    description:
      "Convert ERC-20 tokens into their confidential ERC-7984 equivalent.",
    tab: "wrap",
    coinType: "gold" as const,
  },
  {
    title: "Registry",
    description: "Browse all registered wrapper pairs on Sepolia testnet.",
    tab: "registry",
    coinType: "silver" as const,
  },
  {
    title: "Decrypt Balance",
    description: "Reveal your encrypted balance with an EIP-712 signature.",
    tab: "decrypt",
    coinType: "gold" as const,
  },
  {
    title: "Testnet Faucet",
    description:
      "Claim free mock tokens to try the full shield/unshield flow.",
    tab: "faucet",
    coinType: "silver" as const,
  },
];

export function Dashboard({ onNavigate }: DashboardProps) {
  const { isConnected, address } = useAccount();

  return (
    <div className="space-y-8">
      {/* Hero CTA Card */}
      <div className="emboss-card rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#16171C]">
            Your assets. Now confidential.
          </h1>
          <p className="text-sm md:text-base text-gray-500 tracking-tight max-w-md">
            Shield, decrypt, and manage your confidential tokens on Sepolia
            testnet.
          </p>
        </div>
        <div className="flex-shrink-0">
          {isConnected && address ? (
            <div className="flex items-center gap-3">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm font-medium text-gray-700 tracking-tight">
                {address.slice(0, 6)}...{address.slice(-4)}
              </span>
            </div>
          ) : (
            <WalletButton />
          )}
        </div>
      </div>

      {/* 2x2 Feature Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {features.map((feature) => (
          <button
            key={feature.tab}
            type="button"
            onClick={() => onNavigate(feature.tab)}
            className="glass-panel rounded-2xl p-6 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg group"
          >
            <div className="flex items-start gap-4">
              <CoinPlaceholder
                type={feature.coinType}
                size="sm"
                className="flex-shrink-0 mt-0.5"
              />
              <div className="space-y-1">
                <h3 className="text-base font-bold tracking-tight text-[#16171C] group-hover:text-[#C8A415] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 leading-snug">
                  {feature.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Quick Stats Row */}
      <div className="flex items-center gap-3">
        <span className="glass-pill px-4 py-1.5 text-xs font-medium text-gray-600 tracking-tight">
          9 Token Pairs
        </span>
        <span className="glass-pill px-4 py-1.5 text-xs font-medium text-gray-600 tracking-tight">
          Sepolia Testnet
        </span>
      </div>
    </div>
  );
}
