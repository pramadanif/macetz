"use client";

import React from "react";
import { explorerTxUrl } from "@/lib/config";

/**
 * A consistent "View on Etherscan" link for any on-chain transaction.
 * Network-aware: resolves to the correct explorer for the connected chain.
 */
export function TxLink({
  hash,
  chainId,
  label = "View on Etherscan",
  className = "",
}: {
  hash: string;
  chainId?: number;
  label?: string;
  className?: string;
}) {
  return (
    <a
      href={explorerTxUrl(chainId, hash)}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1 underline font-medium hover:opacity-80 transition-opacity ${className}`}
    >
      {label}
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="shrink-0"
        aria-hidden="true"
      >
        <path d="M7 17 17 7M8 7h9v9" />
      </svg>
    </a>
  );
}
