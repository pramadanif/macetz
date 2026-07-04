"use client";

import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { WalletButton } from "@/components/app/WalletButton";
import { CoinPlaceholder } from "@/components/CoinPlaceholder";

type Tab = "registry" | "wrap" | "decrypt" | "faucet";

const TABS: { id: Tab; label: string }[] = [
  { id: "registry", label: "Registry" },
  { id: "wrap", label: "Wrap / Unwrap" },
  { id: "decrypt", label: "Decrypt" },
  { id: "faucet", label: "Faucet" },
];

interface Props {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function AppHeader({ activeTab, onTabChange }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 flex flex-col items-center pt-4 px-4">
      <div className="w-full max-w-6xl flex items-center justify-between h-[64px] px-4 sm:px-6 bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.06)] rounded-[32px]">
        <a href="/" className="flex items-center gap-2.5 shrink-0 group">
          <CoinPlaceholder
            type="silver"
            size="sm"
            className="w-8 h-8 transition-transform duration-500 group-hover:rotate-[15deg] group-hover:scale-110 shadow-sm"
          />
          <span className="font-bold text-[22px] tracking-tight text-[#16171C]">
            Macetz
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-1 p-1.5 bg-white/50 backdrop-blur-md rounded-full border border-white/60 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-black text-white shadow-md"
                  : "text-gray-600 hover:text-black hover:bg-white/80"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:block">
            <WalletButton />
          </div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white/80 border border-white/60"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden w-full max-w-6xl mt-2 bg-white/90 backdrop-blur-2xl border border-white/60 shadow-[0_24px_48px_rgba(0,0,0,0.1)] rounded-[24px] p-3">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { onTabChange(tab.id); setMenuOpen(false); }}
              className={`w-full text-left px-5 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeTab === tab.id ? "bg-black/5 text-black" : "text-gray-700 hover:bg-black/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
          <div className="pt-2 mt-2 border-t border-gray-100 px-2">
            <WalletButton />
          </div>
        </div>
      )}
    </header>
  );
}
