"use client";

import React from "react";
import { useRegistryPairs } from "@/hooks/useRegistryPairs";
import { TokenIcon } from "@/components/app/TokenIcon";
import { AlertMessage } from "@/components/app/AlertMessage";

export function RegistryBrowser() {
  const { data: pairs, isLoading, error } = useRegistryPairs();

  if (isLoading) {
    return (
      <div className="space-y-5">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Wrapper Registry</h2>
          <p className="text-sm text-gray-500 mt-1">Loading pairs from onchain registry...</p>
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

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Wrapper Registry</h2>
          <p className="text-sm text-gray-500 mt-1">
            Sepolia ERC-20 / ERC-7984 confidential wrapper pairs
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="glass-pill px-2.5 py-1 rounded-full text-gray-600 font-medium text-[11px]">
            {registryCount} onchain
          </span>
          {devCount > 0 && (
            <span className="bg-blue-50 border border-blue-200 text-blue-600 px-2.5 py-1 rounded-full text-[11px] font-medium">
              {devCount} dev
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {pairs.map((pair) => (
          <div
            key={pair.erc7984Address}
            className="group emboss-card p-5 transition-all duration-200 hover:shadow-lg"
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <TokenIcon
                    symbol={pair.erc7984Symbol}
                    size={40}
                  />
                  <div>
                    <h3 className="font-semibold text-sm leading-tight tracking-tight">
                      {pair.erc7984Symbol}
                    </h3>
                    <p className="text-[11px] text-gray-500 leading-tight mt-0.5">
                      {pair.erc7984Name}
                    </p>
                  </div>
                </div>
                <div>
                  {pair.source === "local-dev" && (
                    <span className="text-[10px] font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Dev</span>
                  )}
                  {pair.isMock && pair.source !== "local-dev" && (
                    <span className="text-[10px] font-semibold bg-[#F5C518]/15 text-[#9a7800] px-2 py-0.5 rounded-full">Mock</span>
                  )}
                  {!pair.isMock && pair.source !== "local-dev" && (
                    <span className="text-[10px] font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Official</span>
                  )}
                </div>
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
                    href={`https://sepolia.etherscan.io/address/${pair.erc20Address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[10px] hover:text-[#d4a600] transition-colors"
                  >
                    {pair.erc20Address.slice(0, 6)}...{pair.erc20Address.slice(-4)}
                  </a>
                  <span className="text-gray-300">→</span>
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
