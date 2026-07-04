"use client";

import React from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import faucetAsset from "../../assets/faucet2.png";
import { RegistryToggle } from "./RegistryToggle";

export function FeaturesGrid() {
  return (
    <section id="registry" className="features-bento px-4 py-20 max-w-[1100px] mx-auto">
      <div className="text-center mb-12">
        <p className="text-xs font-semibold text-[#8A8A8E] tracking-[0.14em] uppercase mb-3">
          The Official Zama Wrapper Registry
        </p>
        <h2 className="text-3xl lg:text-[38px] font-normal tracking-[-0.03em] text-[#16171C] mb-4 leading-tight">
          One registry. Every confidential pair. Zero fragmentation.
        </h2>
        <p className="text-[#6B7280] font-medium text-sm lg:text-[15px] max-w-[640px] mx-auto leading-relaxed">
          Today, developers spin up their own test tokens instead of using what
          already exists in the official Zama Wrappers Registry — and the
          ecosystem fragments because of it. Macetz reads the onchain registry
          directly as its source of truth, so every ERC-20 ↔ ERC-7984 pair you
          see here is the real, canonical one. No look-alikes. No guessing which
          wrapped token is legitimate.
        </p>
      </div>

      <div className="bento-grid grid grid-cols-1 md:grid-cols-[minmax(0,34%)_minmax(168px,22%)_minmax(0,44%)] gap-4 md:gap-5 md:items-stretch md:min-h-[400px]">
        {/* Left */}
        <div className="bento-col flex flex-col gap-4 order-2 md:order-1 md:h-full">
          <div className="bento-card rounded-[22px] px-5 py-3.5 shrink-0 flex items-center min-h-[52px]">
            <div className="relative z-10 flex items-center gap-3 w-full">
              <RegistryToggle />
              <span className="text-sm font-semibold text-[#16171C] whitespace-nowrap">
                ERC-20 ↔ ERC-7984
              </span>
            </div>
          </div>

          <div className="bento-card rounded-[28px] p-5 flex-1 flex flex-col min-h-[200px]">
            <div className="relative z-10 flex flex-col gap-3 h-full">
              <div className="bento-field rounded-2xl px-4 py-3 flex items-center gap-2.5 min-h-[44px]">
                <Search className="w-4 h-4 text-[#9CA3AF] shrink-0" />
                <input
                  type="text"
                  placeholder="Search"
                  readOnly
                  className="bg-transparent border-none outline-none text-sm w-full placeholder-[#9CA3AF] text-[#4B5563]"
                />
              </div>
              <div className="bento-field rounded-2xl px-4 py-3 flex items-center min-h-[44px]">
                <input
                  type="text"
                  placeholder="Contract addresses..."
                  readOnly
                  className="bg-transparent border-none outline-none text-sm w-full placeholder-[#9CA3AF] text-[#4B5563]"
                />
              </div>
              <div className="bento-field rounded-2xl px-4 py-3 flex items-center min-h-[44px]">
                <input
                  type="text"
                  placeholder="Burned contract addresses..."
                  readOnly
                  className="bg-transparent border-none outline-none text-sm w-full placeholder-[#9CA3AF] text-[#4B5563]"
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            className="bento-explore-btn shrink-0 self-start rounded-full px-5 py-2.5 text-sm font-medium text-[#16171C]"
          >
            Explore the Full Registry →
          </button>
        </div>

        {/* Center — faucet fills entire card */}
        <div className="bento-col order-1 md:order-2 flex md:h-full min-h-[320px]">
          <div className="bento-card bento-faucet-card rounded-[28px] w-full h-full relative overflow-hidden">
            <Image
              src={faucetAsset}
              alt="Faucet asset"
              fill
              sizes="(max-width: 768px) 90vw, 200px"
              className="bento-faucet-image"
              priority
            />
          </div>
        </div>

        {/* Right */}
        <div className="bento-col flex flex-col gap-4 order-3 md:h-full">
          <div className="bento-card rounded-[28px] p-5 flex-1 flex flex-col min-h-[200px]">
            <div className="relative z-10 flex flex-col gap-4 h-full">
              <div className="bento-field rounded-2xl px-4 py-3 flex items-center gap-2.5 min-h-[44px] shrink-0">
                <Search className="w-4 h-4 text-[#9CA3AF] shrink-0" />
                <input
                  type="text"
                  placeholder="Search"
                  readOnly
                  className="bg-transparent border-none outline-none text-sm w-full placeholder-[#9CA3AF] text-[#4B5563]"
                />
              </div>

              <div className="space-y-3 flex-1 flex flex-col justify-start pt-1">
                <div className="bento-skeleton-line h-3 rounded-md w-full" />
                <div className="bento-skeleton-line h-3 rounded-md w-[88%]" />
                <div className="bento-skeleton-line h-3 rounded-md w-[72%]" />
              </div>
            </div>
          </div>

          <div className="bento-card rounded-[28px] px-5 py-5 shrink-0 min-h-[88px] flex items-center">
            <div className="relative z-10 w-full">
              <div className="text-xs text-[#6B7280] font-medium mb-3 text-center">
                Decryption loading...
              </div>
              <div className="bento-progress-track h-1.5 w-full rounded-full overflow-hidden">
                <div className="bento-progress-fill h-full rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
