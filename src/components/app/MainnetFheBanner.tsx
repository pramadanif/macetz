"use client";

import React, { useEffect, useState } from "react";
import { useChainId } from "wagmi";
import { isMainnet } from "@/lib/config";

const STORAGE_KEY = "macetz_mainnet_fhe_banner_dismissed";

export function MainnetFheBanner() {
  const chainId = useChainId();
  const onMainnet = isMainnet(chainId);
  // Render nothing until mounted: chainId and sessionStorage are client-only
  // signals, so deciding visibility during SSR risks a hydration mismatch.
  const [mounted, setMounted] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setDismissed(sessionStorage.getItem(STORAGE_KEY) === "1");
    setMounted(true);
  }, []);

  if (!mounted || !onMainnet || dismissed) return null;

  return (
    <div className="mb-5 p-4 rounded-xl bg-amber-50/90 border border-amber-200/70 text-amber-900 text-sm leading-relaxed">
      <div className="flex items-start justify-between gap-3">
        <p>
          Mainnet FHE operations depend on Zama&apos;s mainnet relayer availability.
          Registry browsing is fully supported; wrap/decrypt may fail until the relayer is provisioned.
        </p>
        <button
          type="button"
          onClick={() => {
            sessionStorage.setItem(STORAGE_KEY, "1");
            setDismissed(true);
          }}
          className="shrink-0 text-xs font-medium text-amber-700 hover:text-amber-900 underline"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
