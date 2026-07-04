"use client";

import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { AppHeader } from "@/components/app/AppHeader";
import { RegistryBrowser } from "@/components/app/RegistryBrowser";
import { WrapUnwrapPanel } from "@/components/app/WrapUnwrapPanel";
import { DecryptPanel } from "@/components/app/DecryptPanel";
import { FaucetPanel } from "@/components/app/FaucetPanel";
import { ConnectPrompt } from "@/components/app/ConnectPrompt";
import { NetworkGuard } from "@/components/app/NetworkGuard";

type Tab = "registry" | "wrap" | "decrypt" | "faucet";

export default function AppPage() {
  const { isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<Tab>("registry");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-screen bg-[#F5F4F0] text-[#16171C] font-telegraf">
      <AppHeader activeTab={activeTab} onTabChange={setActiveTab} />
      <NetworkGuard>
        <main className="max-w-6xl mx-auto px-4 pt-28 pb-16">
          {!mounted ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-[#F5C518] rounded-full animate-spin" />
            </div>
          ) : !isConnected ? (
            <ConnectPrompt />
          ) : (
            <>
              {activeTab === "registry" && <RegistryBrowser />}
              {activeTab === "wrap" && <WrapUnwrapPanel />}
              {activeTab === "decrypt" && <DecryptPanel />}
              {activeTab === "faucet" && <FaucetPanel />}
            </>
          )}
        </main>
      </NetworkGuard>
    </div>
  );
}
