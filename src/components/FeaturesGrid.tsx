"use client";

import React from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import faucetAsset from "../../assets/faucet2.png";
import { RegistryToggle } from "./RegistryToggle";

export function FeaturesGrid() {
  return (
    <section id="registry" className="px-4 py-32 max-w-[1400px] mx-auto">
      <div className="text-center mb-20 px-4 max-w-4xl mx-auto flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/[0.03] border border-black/[0.06] mb-6">
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
          <span className="text-[13px] font-semibold text-[#52525B] tracking-wide uppercase">
            Official Zama Registry
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-[64px] font-medium tracking-[-0.04em] text-[#0A0A0A] mb-8 leading-[1.05]">
          Single Source of Truth.<br className="hidden lg:block"/> Zero Fragmentation.
        </h2>
        <p className="text-[#52525B] font-medium text-[16px] lg:text-[18px] max-w-3xl mx-auto leading-[1.7]">
          Redundant token deployments lead to severe ecosystem fragmentation. Macetz integrates 
          directly with the official onchain Zama Wrapper Registry, ensuring every ERC-20 ↔ ERC-7984 
          pair is canonical and verified. Eliminate ambiguity and build with absolute confidence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,34%)_minmax(168px,22%)_minmax(0,44%)] gap-6 md:gap-8 md:items-stretch md:min-h-[460px] max-w-6xl mx-auto">
        {/* Left */}
        <div className="flex flex-col gap-6 order-2 md:order-1 md:h-full">
          <div className="glass-panel bg-white/60 backdrop-blur-2xl border border-white/80 rounded-[2rem] p-5 shrink-0 flex items-center justify-center min-h-[68px] shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-500">
            <div className="relative z-10 flex items-center justify-between w-full px-2">
              <span className="text-[15px] font-medium text-[#0A0A0A] tracking-tight">
                Pair Architecture
              </span>
              <RegistryToggle />
            </div>
          </div>

          <div className="glass-panel bg-white/60 backdrop-blur-2xl border border-white/80 rounded-[2.5rem] p-6 lg:p-8 flex-1 flex flex-col shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-500">
            <div className="relative z-10 flex flex-col gap-4 h-full w-full justify-center">
              <div className="bg-white/80 shadow-sm border border-black/[0.04] rounded-[1.25rem] px-5 py-4 flex items-center gap-3 transition-transform hover:-translate-y-0.5">
                <Search className="w-[18px] h-[18px] text-[#A1A1AA] shrink-0" />
                <input
                  type="text"
                  placeholder="Query canonical pairs..."
                  readOnly
                  className="bg-transparent border-none outline-none text-[15px] w-full placeholder-[#A1A1AA] text-[#3F3F46] font-medium"
                />
              </div>
              <div className="bg-white/80 shadow-sm border border-black/[0.04] rounded-[1.25rem] px-5 py-4 flex items-center transition-transform hover:-translate-y-0.5">
                <input
                  type="text"
                  placeholder="Analyze contract instances..."
                  readOnly
                  className="bg-transparent border-none outline-none text-[15px] w-full placeholder-[#A1A1AA] text-[#3F3F46] font-medium"
                />
              </div>
              <div className="bg-white/80 shadow-sm border border-black/[0.04] rounded-[1.25rem] px-5 py-4 flex items-center transition-transform hover:-translate-y-0.5">
                <input
                  type="text"
                  placeholder="Verify burned addresses..."
                  readOnly
                  className="bg-transparent border-none outline-none text-[15px] w-full placeholder-[#A1A1AA] text-[#3F3F46] font-medium"
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            className="shrink-0 self-start bg-[#0A0A0A] text-white rounded-full px-7 py-3.5 text-[15px] font-semibold hover:bg-gray-800 transition-all hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 flex items-center gap-2"
          >
            Explore the Registry <span className="text-gray-400">→</span>
          </button>
        </div>

        {/* Center — faucet fills entire card */}
        <div className="order-1 md:order-2 flex md:h-full min-h-[380px]">
          <div className="glass-panel bg-gradient-to-b from-[#F3F2EE] to-[#E5E4E0] border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-[2.5rem] w-full h-full relative overflow-hidden group hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] transition-all duration-700">
            <div className="absolute inset-0 bg-gradient-to-tr from-yellow-200/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <Image
              src={faucetAsset}
              alt="Faucet distribution visualization"
              fill
              sizes="(max-width: 768px) 90vw, 300px"
              className="object-contain scale-[1.05] group-hover:scale-[1.12] transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
              priority
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col gap-6 order-3 md:h-full">
          <div className="glass-panel bg-white/60 backdrop-blur-2xl border border-white/80 rounded-[2.5rem] p-6 lg:p-8 flex-1 flex flex-col shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-500">
            <div className="relative z-10 flex flex-col gap-6 h-full">
              <div className="bg-white/80 shadow-sm border border-black/[0.04] rounded-[1.25rem] px-5 py-4 flex items-center gap-3">
                <Search className="w-[18px] h-[18px] text-[#A1A1AA] shrink-0" />
                <input
                  type="text"
                  placeholder="Global search..."
                  readOnly
                  className="bg-transparent border-none outline-none text-[15px] w-full placeholder-[#A1A1AA] text-[#3F3F46] font-medium"
                />
              </div>

              <div className="space-y-4 flex-1 flex flex-col justify-center">
                <div className="bg-black/[0.06] h-3.5 rounded-full w-full animate-pulse" />
                <div className="bg-black/[0.06] h-3.5 rounded-full w-[75%] animate-pulse" />
                <div className="bg-black/[0.06] h-3.5 rounded-full w-[90%] animate-pulse" />
              </div>
            </div>
          </div>

          <div className="glass-panel bg-gradient-to-r from-yellow-50 to-[#FCFAEE] backdrop-blur-2xl border border-yellow-200/50 rounded-[2.5rem] px-8 py-7 shrink-0 flex flex-col justify-center shadow-[0_8px_30px_rgba(234,179,8,0.06)] hover:shadow-[0_15px_40px_rgba(234,179,8,0.12)] transition-shadow duration-500">
            <div className="relative z-10 w-full">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[13px] text-yellow-800 font-semibold tracking-wide uppercase">
                  Decryption Status
                </span>
                <span className="text-[13px] font-mono text-yellow-600">68%</span>
              </div>
              <div className="bg-yellow-200/50 h-2 w-full rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-full rounded-full w-[68%] relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite]" style={{ backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
