"use client";

import React from "react";
import { useAccount, useChainId } from "wagmi";
import { Shield, Database, Key, Droplet, Users } from "lucide-react";
import { WalletButton } from "@/components/app/WalletButton";
import { useRegistryPairs } from "@/hooks/useRegistryPairs";
import { isMainnet } from "@/lib/config";

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

const features = [
  {
    title: "Shield Tokens",
    description: "Convert ERC-20 tokens into their confidential ERC-7984 equivalent.",
    tab: "wrap",
    icon: Shield,
    color: "text-[#16171C]",
    bg: "bg-[#F5C518]/20",
  },
  {
    title: "Registry",
    description: "Browse every wrapper pair from the onchain Zama registry.",
    tab: "registry",
    icon: Database,
    color: "text-[#16171C]",
    bg: "bg-gray-200/60",
  },
  {
    title: "Decrypt Balance",
    description: "Reveal your encrypted balance with an EIP-712 signature.",
    tab: "decrypt",
    icon: Key,
    color: "text-[#16171C]",
    bg: "bg-[#F5C518]/20",
  },
  {
    title: "Testnet Faucet",
    description: "Claim free mock tokens to try the full shield/unshield flow.",
    tab: "faucet",
    icon: Droplet,
    color: "text-[#16171C]",
    bg: "bg-gray-200/60",
    sepoliaOnly: true,
  },
  {
    title: "Distribute Payroll",
    description: "Batch confidential salaries via TokenOps Disperse SDK.",
    tab: "distribute",
    icon: Users,
    color: "text-[#16171C]",
    bg: "bg-[#F5C518]/20",
  },
];

export function Dashboard({ onNavigate }: DashboardProps) {
  const { isConnected, address } = useAccount();
  const chainId = useChainId();
  const onMainnet = isMainnet(chainId);
  const networkLabel = onMainnet ? "Ethereum Mainnet" : "Sepolia Testnet";
  const { data: pairs } = useRegistryPairs();
  const pairCount = pairs?.length ?? 0;

  // Faucet is Sepolia-only — drop the card on mainnet so nothing dead-ends.
  const visibleFeatures = features.filter((f) => !(f.sepoliaOnly && onMainnet));

  return (
    <div className="space-y-6">
      {/* Hero CTA Card */}
      <div className="emboss-card p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#16171C]">
            Your assets. Now confidential.
          </h1>
          <p className="text-sm md:text-base text-gray-500 tracking-tight max-w-md">
            Shield, decrypt, and manage your confidential tokens on {networkLabel}.
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
        {visibleFeatures.map((feature) => (
          <button
            key={feature.tab}
            type="button"
            onClick={() => onNavigate(feature.tab)}
            className="emboss-card rounded-2xl p-6 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg group"
          >
            <div className="flex items-start gap-4">
              <div className={`flex-shrink-0 mt-0.5 p-2 rounded-xl ${feature.bg}`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} strokeWidth={1.5} />
              </div>
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
        {pairCount > 0 && (
          <span className="glass-pill px-4 py-1.5 text-xs font-medium text-gray-600 tracking-tight">
            {pairCount} Token {pairCount === 1 ? "Pair" : "Pairs"}
          </span>
        )}
        <span className="glass-pill px-4 py-1.5 text-xs font-medium text-gray-600 tracking-tight">
          {networkLabel}
        </span>
      </div>
    </div>
  );
}
