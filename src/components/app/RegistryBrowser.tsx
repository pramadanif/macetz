"use client";

import React from "react";
import { useChainId } from "wagmi";
import { useRegistryPairs } from "@/hooks/useRegistryPairs";
import { TokenIcon } from "@/components/app/TokenIcon";
import { AlertMessage } from "@/components/app/AlertMessage";
import { AddPairSection } from "@/components/app/AddPairSection";
import { isMainnet } from "@/lib/config";

/** Returns the appropriate Etherscan block explorer URL for the current chain. */
function explorerUrl(chainId: number, address: string): string {
  return isMainnet(chainId)
    ? `https://etherscan.io/address/${address}`
    : `https://sepolia.etherscan.io/address/${address}`;
}

/** Integrity badge component — renders ✓ Verified or ⚠ Flagged per pair. */
function IntegrityBadge({ status, reason }: { status: "verified" | "flagged"; reason?: string }) {
  if (status === "verified") {
    return (
      <span
        title="All integrity checks passed"
        className="inline-flex items-center gap-1 text-[10px] font-semibold bg-green-50 text-green-700 border border-green-200/60 px-2 py-0.5 rounded-full cursor-default"
      >
        <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="1.5,5 4,7.5 8.5,2.5" />
        </svg>
        Verified
      </span>
    );
  }
  return (
    <span
      title={reason ?? "Integrity check flagged this pair"}
      className="inline-flex items-center gap-1 text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/60 px-2 py-0.5 rounded-full cursor-help"
    >
      <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 1L1 8.5h8L5 1z" />
        <line x1="5" y1="4" x2="5" y2="6" />
        <circle cx="5" cy="7.5" r="0.5" fill="currentColor" stroke="none" />
      </svg>
      Flagged
    </span>
  );
}

export function RegistryBrowser() {
  const chainId = useChainId();
  const onMainnet = isMainnet(chainId);
  const { data: pairs, isLoading, error } = useRegistryPairs();

  if (isLoading) {
    return (
      <div className="space-y-5">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Wrapper Registry</h2>
          <p className="text-sm text-gray-500 mt-1">
            Loading pairs from onchain registry{onMainnet ? " (Ethereum Mainnet)" : " (Sepolia)"}...
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="emboss-card p-5 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-200" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-20 mb-1" />
                  <div className="h-3 bg-gray-200 rounded w-28" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto">
        <AlertMessage type="error" title="Failed to load registry" message={error.message} />
      </div>
    );
  }

  if (!pairs || pairs.length === 0) {
    return (
      <div className="emboss-card p-6 md:p-8 text-center max-w-sm mx-auto">
        <div className="relative z-10">
          <p className="text-gray-500 text-sm">No wrapper pairs found in the registry.</p>
        </div>
      </div>
    );
  }

  const registryCount = pairs.filter((p) => p.source === "registry").length;
  const devCount = pairs.filter((p) => p.source === "local-dev").length;
  const previewCount = pairs.filter((p) => p.source === "browser-preview").length;
  const flaggedCount = pairs.filter((p) => p.integrityStatus === "flagged").length;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-semibold tracking-tight">Wrapper Registry</h2>
            {/* Network badge */}
            <span
              className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)] ${
                onMainnet
                  ? "bg-[#F4F7F4]/90 text-[#62805A] border-[#DCE2DB]/90"
                  : "bg-[#F4F6F8]/90 text-[#5C728A] border-[#DDE3E9]/90"
              }`}
              style={{ backdropFilter: "blur(8px)" }}
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-40 ${onMainnet ? 'bg-[#62805A]' : 'bg-[#5C728A]'}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${onMainnet ? 'bg-[#62805A]' : 'bg-[#5C728A]'}`}></span>
              </span>
              {onMainnet ? "Ethereum Mainnet" : "Sepolia Testnet"}
            </span>
          </div>
          <p className="text-sm text-gray-500">
            {onMainnet
              ? "Official ERC-20 / ERC-7984 confidential wrapper pairs on Ethereum"
              : "Official ERC-20 / ERC-7984 confidential wrapper pairs on Sepolia"}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="glass-pill px-2.5 py-1 rounded-full text-gray-600 font-medium text-[11px]">
            {registryCount} onchain
          </span>
          {devCount > 0 && (
            <span className="bg-blue-50 border border-blue-200 text-blue-600 px-2.5 py-1 rounded-full text-[11px] font-medium">
              {devCount} dev
            </span>
          )}
          {previewCount > 0 && (
            <span className="bg-violet-50 border border-violet-200 text-violet-600 px-2.5 py-1 rounded-full text-[11px] font-medium">
              {previewCount} preview
            </span>
          )}
          {flaggedCount > 0 && (
            <span
              title={`${flaggedCount} pair(s) flagged by integrity checks`}
              className="bg-amber-50 border border-amber-200 text-amber-700 px-2.5 py-1 rounded-full text-[11px] font-medium"
            >
              ⚠ {flaggedCount} flagged
            </span>
          )}
        </div>
      </div>

      <AddPairSection />

      <div id="registry-table" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {pairs.map((pair) => (
          <div
            key={pair.erc7984Address}
            className={`group emboss-card p-5 transition-all duration-200 hover:shadow-lg ${
              pair.integrityStatus === "flagged" ? "ring-1 ring-amber-200" : ""
            }`}
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <TokenIcon symbol={pair.erc7984Symbol} size={40} />
                  <div>
                    <h3 className="font-semibold text-sm leading-tight tracking-tight">
                      {pair.erc7984Symbol}
                    </h3>
                    <p className="text-[11px] text-gray-500 leading-tight mt-0.5">
                      {pair.erc7984Name}
                    </p>
                  </div>
                </div>
                {/* Type badge (Official / Mock / Dev) */}
                <div>
                  {pair.source === "browser-preview" && (
                    <span className="text-[10px] font-semibold bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">Preview</span>
                  )}
                  {pair.source === "local-dev" && (
                    <span className="text-[10px] font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Dev</span>
                  )}
                  {pair.isMock && pair.source === "registry" && (
                    <span className="text-[10px] font-semibold bg-[#F5C518]/15 text-[#9a7800] px-2 py-0.5 rounded-full">Mock</span>
                  )}
                  {!pair.isMock && pair.source === "registry" && (
                    <span className="text-[10px] font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Official</span>
                  )}
                </div>
              </div>

              {/* Integrity badge row */}
              <div className="mb-3">
                <IntegrityBadge status={pair.integrityStatus} reason={pair.integrityReason} />
                {pair.integrityStatus === "flagged" && pair.integrityReason && (
                  <p className="text-[10px] text-amber-600 mt-1 leading-relaxed">
                    {pair.integrityReason}
                  </p>
                )}
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-500">
                  <span>Underlying</span>
                  <span className="font-mono text-gray-700 font-medium">{pair.erc20Symbol} ({pair.erc20Decimals}d)</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Wrapper</span>
                  <span className="font-mono text-gray-700 font-medium">{pair.erc7984Decimals}d</span>
                </div>
                <div className="pt-2.5 mt-2.5 border-t border-gray-100 flex justify-between text-gray-400">
                  <a
                    href={explorerUrl(chainId, pair.erc20Address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[10px] hover:text-[#d4a600] transition-colors"
                  >
                    {pair.erc20Address.slice(0, 6)}...{pair.erc20Address.slice(-4)}
                  </a>
                  <span className="text-gray-300">→</span>
                  <a
                    href={explorerUrl(chainId, pair.erc7984Address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[10px] hover:text-[#d4a600] transition-colors"
                  >
                    {pair.erc7984Address.slice(0, 6)}...{pair.erc7984Address.slice(-4)}
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
