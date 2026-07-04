"use client";

import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { AppSidebar } from "@/components/app/AppSidebar";
import { Dashboard } from "@/components/app/Dashboard";
import { RegistryBrowser } from "@/components/app/RegistryBrowser";
import { WrapUnwrapPanel } from "@/components/app/WrapUnwrapPanel";
import { DecryptPanel } from "@/components/app/DecryptPanel";
import { FaucetPanel } from "@/components/app/FaucetPanel";
import { ConnectPrompt } from "@/components/app/ConnectPrompt";
import { NetworkGuard } from "@/components/app/NetworkGuard";
import { OnboardingTutorial } from "@/components/app/OnboardingTutorial";

type Tab = "dashboard" | "registry" | "wrap" | "decrypt" | "faucet";

export default function AppPage() {
  const { isConnected } = useAccount();
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
              {activeTab === "faucet" && <FaucetPanel />}
            </>
          )}
        </main>
      </NetworkGuard>
      <OnboardingTutorial />
    </div>
  );
}
