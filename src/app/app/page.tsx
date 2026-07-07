"use client";

import React, { useState, useEffect } from "react";
import { useAccount, useChainId } from "wagmi";
import { AppSidebar } from "@/components/app/AppSidebar";
import { Dashboard } from "@/components/app/Dashboard";
import { RegistryBrowser } from "@/components/app/RegistryBrowser";
import { WrapUnwrapPanel } from "@/components/app/WrapUnwrapPanel";
import { DecryptPanel } from "@/components/app/DecryptPanel";
import { FaucetPanel } from "@/components/app/FaucetPanel";
import { DistributePanel } from "@/components/app/DistributePanel";
import { DocsPanel } from "@/components/app/DocsPanel";
import { ConnectPrompt } from "@/components/app/ConnectPrompt";
import { NetworkGuard } from "@/components/app/NetworkGuard";
import { OnboardingTutorial } from "@/components/app/OnboardingTutorial";
import { isMainnet } from "@/lib/config";

type Tab = "dashboard" | "registry" | "wrap" | "decrypt" | "faucet" | "distribute" | "docs";

/** Shown on mainnet when user navigates to faucet tab (e.g. via tutorial). */
function MainnetFaucetBanner() {
  return (
    <div className="max-w-lg mx-auto">
      <div className="emboss-card p-8 text-center">
        <div className="relative z-10">
          <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-amber-50 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <h2 className="text-xl font-bold tracking-tight mb-3 text-gray-900">
            Faucet unavailable on Mainnet
          </h2>
          <p className="text-gray-500 text-[15px] leading-relaxed mb-6">
            The testnet faucet only exists on <strong>Sepolia</strong>.
            Mainnet assets are real — they cannot be minted for free.
          </p>
          <p className="text-[13px] text-gray-400">
            Switch to Sepolia using the network switcher in the sidebar to access the faucet.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AppPage() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleNav = (e: Event) => {
      const customEvent = e as CustomEvent<Tab>;
      setActiveTab(customEvent.detail);
    };
    window.addEventListener("tutorial-navigate", handleNav);
    return () => window.removeEventListener("tutorial-navigate", handleNav);
  }, []);

  // If user is on mainnet and somehow lands on the faucet tab (e.g. network switch
  // while on faucet tab), redirect to dashboard rather than leaving them stranded.
  useEffect(() => {
    if (mounted && isMainnet(chainId) && activeTab === "faucet") {
      setActiveTab("dashboard");
    }
  }, [chainId, mounted, activeTab]);

  const handleNavigate = (tab: string) => {
    setActiveTab(tab as Tab);
  };

  return (
    <div className="min-h-screen bg-[#F5F4F0] text-[#16171C] font-telegraf flex">
      <AppSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <NetworkGuard>
        <main className="flex-1 min-h-screen px-6 py-8 lg:px-10 lg:py-10">
          {!mounted ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-[#F5C518] rounded-full animate-spin" />
            </div>
          ) : !isConnected ? (
            <ConnectPrompt />
          ) : (
            <>
              {activeTab === "dashboard" && <Dashboard onNavigate={handleNavigate} />}
              {activeTab === "registry" && <RegistryBrowser />}
              {activeTab === "wrap" && <WrapUnwrapPanel />}
              {activeTab === "decrypt" && <DecryptPanel />}
              {activeTab === "faucet" && (
                isMainnet(chainId) ? <MainnetFaucetBanner /> : <FaucetPanel />
              )}
              {activeTab === "distribute" && <DistributePanel />}
              {activeTab === "docs" && <DocsPanel />}
            </>
          )}
        </main>
      </NetworkGuard>
      <OnboardingTutorial />
    </div>
  );
}
