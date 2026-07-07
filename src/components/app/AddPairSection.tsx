"use client";

import React, { useState } from "react";
import { useChainId, usePublicClient } from "wagmi";
import { AnimatePresence, motion } from "motion/react";
import { useInvalidateRegistryPairs } from "@/hooks/useRegistryPairs";
import { validateNewPair } from "@/lib/pair-validation";
import {
  addPreviewPair,
  buildConfigSnippet,
} from "@/lib/preview-pairs";
import { AlertMessage } from "@/components/app/AlertMessage";
import { isMainnet } from "@/lib/config";
import type { CustomPairEntry } from "@/lib/types";

/** Same motion preset as Faucet sidebar item — keeps network UI consistent. */
const PANEL_VARIANTS = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: "auto" },
  exit: { opacity: 0, height: 0 },
};
const PANEL_TRANSITION = { duration: 0.2, ease: "easeInOut" as const };

export function AddPairSection() {
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const invalidate = useInvalidateRegistryPairs();

  const [open, setOpen] = useState(false);
  const [erc20, setErc20] = useState("");
  const [erc7984, setErc7984] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastEntry, setLastEntry] = useState<CustomPairEntry | null>(null);
  const [copied, setCopied] = useState(false);

  const networkLabel = isMainnet(chainId) ? "Ethereum Mainnet" : "Sepolia Testnet";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicClient) {
      setError("Connect wallet and wait for RPC client.");
      return;
    }

    setSubmitting(true);
    setError(null);
    setLastEntry(null);
    setCopied(false);

    const result = await validateNewPair(publicClient, erc20, erc7984);
    if (!result.ok) {
      setError(result.error);
      setSubmitting(false);
      return;
    }

    const entry: CustomPairEntry = {
      erc20: result.metadata.erc20,
      erc7984: result.metadata.erc7984,
      symbol: result.metadata.erc7984Symbol,
      decimals: result.metadata.erc20Decimals,
      source: "local-dev",
    };

    addPreviewPair(chainId, entry);
    setLastEntry(entry);
    setErc20("");
    setErc7984("");
    invalidate();
    setSubmitting(false);
  };

  const handleCopySnippet = async () => {
    if (!lastEntry) return;
    await navigator.clipboard.writeText(buildConfigSnippet(chainId, lastEntry));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="emboss-card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/40 transition-colors"
        aria-expanded={open}
      >
        <div>
          <p className="font-semibold text-sm text-[#16171C]">Add a Pair</p>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Preview pair — visible in this browser only ({networkLabel})
          </p>
        </div>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path d="M4 6l4 4 4-4" />
        </svg>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="add-pair-panel"
            variants={PANEL_VARIANTS}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={PANEL_TRANSITION}
            style={{ overflow: "hidden" }}
          >
            <form onSubmit={handleSubmit} className="px-5 pb-5 space-y-4 border-t border-gray-100/80">
              <p className="text-[11px] text-gray-400 pt-3 leading-relaxed">
                Validates ERC-7984 interface and decimals on the{" "}
                <strong>currently connected network</strong> ({chainId}). Pairs never
                sync across browsers — use Copy Config Snippet for permanent config.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                    ERC-20 underlying
                  </label>
                  <input
                    type="text"
                    value={erc20}
                    onChange={(e) => setErc20(e.target.value.trim())}
                    placeholder="0x..."
                    className="mt-1.5 w-full liquid-glass-field rounded-xl px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#F5C518]/40"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                    ERC-7984 wrapper
                  </label>
                  <input
                    type="text"
                    value={erc7984}
                    onChange={(e) => setErc7984(e.target.value.trim())}
                    placeholder="0x..."
                    className="mt-1.5 w-full liquid-glass-field rounded-xl px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#F5C518]/40"
                  />
                </div>
              </div>

              {error && (
                <AlertMessage type="error" title="Validation failed" message={error} />
              )}

              {lastEntry && (
                <div className="space-y-2">
                  <AlertMessage
                    type="success"
                    title="Preview pair added"
                    message={`${lastEntry.symbol} will appear in the registry list for ${networkLabel} only.`}
                  />
                  <button
                    type="button"
                    onClick={handleCopySnippet}
                    className="w-full py-2.5 rounded-xl border border-[#16171C] text-[#16171C] text-sm font-semibold hover:bg-[#16171C] hover:text-white transition-colors"
                  >
                    {copied ? "Copied!" : "Copy Config Snippet"}
                  </button>
                  <pre className="text-[10px] font-mono bg-gray-50 rounded-lg p-3 overflow-x-auto text-gray-600">
                    {buildConfigSnippet(chainId, lastEntry)}
                  </pre>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || !erc20 || !erc7984}
                className="w-full bg-[#16171C] hover:bg-black text-white font-semibold py-3 rounded-xl disabled:opacity-40 transition-all"
              >
                {submitting ? "Validating on-chain…" : "Add Preview Pair"}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
