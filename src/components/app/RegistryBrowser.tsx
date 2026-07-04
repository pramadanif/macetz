"use client";

import React from "react";
import { useRegistryPairs } from "@/hooks/useRegistryPairs";
import { CoinPlaceholder } from "@/components/CoinPlaceholder";

export function RegistryBrowser() {
  const { data: pairs, isLoading, error } = useRegistryPairs();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Wrapper Registry</h2>
        <p className="text-sm text-gray-500">Loading pairs from onchain registry...</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="glass-panel rounded-2xl p-6 animate-pulse">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-xl bg-gray-200" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-20 mb-1.5" />
                  <div className="h-3 bg-gray-200 rounded w-32" />
                </div>
              </div>
              <div className="space-y-2.5">
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
      <div className="glass-panel rounded-2xl p-10 text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-red-100 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <p className="text-red-600 font-medium mb-1">Failed to load registry</p>
        <p className="text-red-400 text-sm">{error.message}</p>
      </div>
    );
  }

  if (!pairs || pairs.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-12 text-center">
        <p className="text-gray-500">No wrapper pairs found in the registry.</p>
      </div>
    );
  }

  const registryPairs = pairs.filter((p) => p.source === "registry");
  const devPairs = pairs.filter((p) => p.source === "local-dev");

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Wrapper Registry</h2>
          <p className="text-sm text-gray-500 mt-1">
            Official Sepolia ERC-20 ↔ ERC-7984 confidential wrapper pairs
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="glass-pill px-3 py-1.5 rounded-full text-gray-600 font-medium text-xs">
            {registryPairs.length} onchain
          </span>
          {devPairs.length > 0 && (
            <span className="bg-blue-50 border border-blue-200 text-blue-600 px-3 py-1.5 rounded-full text-xs font-medium">
              {devPairs.length} dev
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pairs.map((pair) => (
          <div
            key={pair.erc7984Address}
            className="group emboss-card rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_24px_60px_rgba(17,24,39,0.12)]"
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <CoinPlaceholder
                    type="gold"
                    size="sm"
                    className="w-11 h-11 shadow-md"
                  />
                  <div>
                    <h3 className="font-semibold text-[15px] leading-tight tracking-tight">
                      {pair.erc7984Symbol}
                    </h3>
                    <p className="text-[11px] text-gray-500 leading-tight mt-0.5">
                      {pair.erc7984Name}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {pair.source === "local-dev" && (
                    <span className="text-[10px] font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                      Dev Pair
                    </span>
                  )}
                  {pair.isMock && pair.source !== "local-dev" && (
                    <span className="text-[10px] font-semibold bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200/50">
                      Mock (Faucet)
                    </span>
                  )}
                  {!pair.isMock && pair.source !== "local-dev" && (
                    <span className="text-[10px] font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      Official
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-gray-500">
                  <span>Underlying</span>
                  <span className="font-mono text-gray-700 font-medium">
                    {pair.erc20Symbol} ({pair.erc20Decimals}d)
                  </span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Wrapper Decimals</span>
                  <span className="font-mono text-gray-700 font-medium">
                    {pair.erc7984Decimals}d
                  </span>
                </div>
                <div className="pt-3 mt-3 border-t border-white/50 flex justify-between text-gray-400">
                  <a
                    href={`https://sepolia.etherscan.io/address/${pair.erc20Address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[10px] hover:text-[#d4a600] transition-colors"
                  >
                    {pair.erc20Address.slice(0, 6)}...{pair.erc20Address.slice(-4)}
                  </a>
                  <span className="text-gray-300">↔</span>
                  <a
                    href={`https://sepolia.etherscan.io/address/${pair.erc7984Address}`}
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
