"use client";

import React, { useState, useEffect } from "react";
import { useChainId } from "wagmi";
import { WalletButton } from "@/components/app/WalletButton";
import { NetworkSwitchButton } from "@/components/app/NetworkSwitchButton";
import { isMainnet } from "@/lib/config";

type Tab = "dashboard" | "registry" | "wrap" | "decrypt" | "faucet" | "distribute" | "docs";

interface NavItem {
  id: Tab;
  label: string;
  icon: React.ReactNode;
}

/** Core nav items — always visible regardless of network. */
const NAV_ITEMS: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 10.5L10 4l7 6.5" />
        <path d="M5 9.5V16a1 1 0 001 1h3v-4h2v4h3a1 1 0 001-1V9.5" />
      </svg>
    ),
  },
  {
    id: "registry",
    label: "Registry",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="6" height="6" rx="1" />
        <rect x="11" y="3" width="6" height="6" rx="1" />
        <rect x="3" y="11" width="6" height="6" rx="1" />
        <rect x="11" y="11" width="6" height="6" rx="1" />
      </svg>
    ),
  },
  {
    id: "wrap",
    label: "Shield",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="8" width="12" height="9" rx="2" />
        <path d="M7 8V6a3 3 0 016 0v2" />
        <circle cx="10" cy="12.5" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    id: "decrypt",
    label: "Decrypt",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10" cy="10" r="3" />
        <path d="M10 3v2M10 15v2M3 10h2M15 10h2" />
        <path d="M5.05 5.05l1.41 1.41M13.54 13.54l1.41 1.41M5.05 14.95l1.41-1.41M13.54 6.46l1.41-1.41" />
      </svg>
    ),
  },
  {
    id: "distribute",
    label: "Distribute",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10" cy="5" r="2.5" />
        <circle cx="4.5" cy="14" r="2.5" />
        <circle cx="15.5" cy="14" r="2.5" />
        <path d="M10 7.5v2M8.2 11.5L5.8 12.5M11.8 11.5l2.4 1" />
      </svg>
    ),
  },
  {
    id: "docs",
    label: "Docs",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 3h7l3 3v11a1 1 0 01-1 1H5a1 1 0 01-1-1V4a1 1 0 011-1z" />
        <path d="M12 3v4h4" />
        <path d="M7 9h6M7 12h6M7 15h4" />
      </svg>
    ),
  },
];

/** Faucet nav item — only shown on Sepolia testnet. */
const FAUCET_ITEM: NavItem = {
  id: "faucet",
  label: "Faucet",
  icon: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 3c-1 2-3 3.5-3 5.5a3 3 0 006 0C13 6.5 11 5 10 3z" />
      <path d="M10 11v3" />
      <path d="M7 17c0-1.5 1.3-3 3-3s3 1.5 3 3" />
    </svg>
  ),
};

interface Props {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

function NavButton({
  item,
  isActive,
  onClick,
}: {
  item: NavItem;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      id={`nav-${item.id}`}
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-[14px] font-medium transition-all duration-200 ${
        isActive
          ? "emboss-card text-[#16171C]"
          : "text-gray-500 hover:text-gray-800 hover:emboss-card"
      }`}
    >
      <span className={isActive ? "text-[#16171C]" : ""}>{item.icon}</span>
      {item.label}
    </button>
  );
}

export function AppSidebar({ activeTab, onTabChange }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const chainId = useChainId();
  const onMainnet = mounted && isMainnet(chainId);

  useEffect(() => setMounted(true), []);

  const handleTabChange = (tab: Tab) => {
    onTabChange(tab);
    setMobileOpen(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Wordmark */}
      <div className="flex items-center gap-2.5 px-5 py-6">
        <img src="/icons/logo.png" alt="Macetz Logo" className="w-8 h-8 object-contain mix-blend-multiply" />
        <span className="font-bold text-[20px] tracking-tight text-[#16171C]">
          Macetz
        </span>
      </div>

      {/* Primary nav */}
      <nav className="flex-1 px-3 mt-2">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <NavButton
                item={item}
                isActive={activeTab === item.id}
                onClick={() => handleTabChange(item.id)}
              />
            </li>
          ))}

          {/* Faucet — Sepolia only; plain <li> after mount avoids motion SSR style drift */}
          {mounted && !onMainnet && (
            <li>
              <NavButton
                item={FAUCET_ITEM}
                isActive={activeTab === "faucet"}
                onClick={() => handleTabChange("faucet")}
              />
            </li>
          )}
        </ul>
      </nav>

      {/* Bottom utility links */}
      <div className="px-3 pb-3 mt-auto">
        <div className="border-t border-gray-200/60 pt-3 space-y-1">
          <button
            onClick={() => window.dispatchEvent(new Event("show-tutorial"))}
            className="flex items-center gap-3 px-3 py-2 rounded-2xl text-[13px] text-gray-500 hover:text-gray-800 hover:emboss-card transition-all duration-200 w-full text-left"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <path d="M12 17h.01" />
            </svg>
            Show Tutorial
          </button>
          <a
            href="https://docs.zama.ai/fhevm"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2 rounded-2xl text-[13px] text-gray-500 hover:text-gray-800 hover:emboss-card transition-all duration-200"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 10v3a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2h3" />
              <path d="M10 3h5v5" />
              <path d="M15 3L8 10" />
            </svg>
            Get Help
          </a>
          <button className="flex items-center gap-3 px-3 py-2 rounded-2xl text-[13px] text-gray-500 hover:text-gray-800 hover:emboss-card transition-all duration-200 w-full text-left">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 2L4 4.5v4c0 3.5 2.5 6.5 5 7.5 2.5-1 5-4 5-7.5v-4L9 2z" />
            </svg>
            Privacy
          </button>
        </div>

        {/* Wallet button */}
        <div className="mt-3 px-1">
          <WalletButton />
        </div>

        {/* Network switch — prominent, below wallet */}
        <div className="mt-2">
          <NetworkSwitchButton />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-white/80 backdrop-blur-xl border-r border-gray-200/60">
        {sidebarContent}
      </aside>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 flex items-center justify-center w-10 h-10 rounded-full bg-white/80 backdrop-blur-md border border-white/60 shadow-md"
        aria-label="Open menu"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M4 6h12M4 10h12M4 14h12" />
        </svg>
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Slide-over panel */}
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-2xl animate-in slide-in-from-left duration-200">
            {/* Close button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close menu"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 4l10 10M14 4L4 14" />
              </svg>
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
