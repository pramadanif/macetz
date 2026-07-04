import React from "react";
import { ArrowUpRight } from "lucide-react";

export function CTAFooter() {
  return (
    <section className="px-4 py-20 pb-24 max-w-7xl mx-auto w-full">
      <div className="cta-gradient-box relative overflow-hidden rounded-[2rem] lg:rounded-[2.5rem] min-h-[320px] lg:min-h-[360px] flex items-end">
        <div className="gradient-hero-fallback rounded-[2rem] lg:rounded-[2.5rem]" aria-hidden="true" />
        <div className="gradient-hero-wave gradient-hero-wave-1 rounded-[2rem] lg:rounded-[2.5rem]" aria-hidden="true" />
        <div className="gradient-hero-wave gradient-hero-wave-2 rounded-[2rem] lg:rounded-[2.5rem]" aria-hidden="true" />
        <div className="gradient-hero-wave gradient-hero-wave-3 rounded-[2rem] lg:rounded-[2.5rem]" aria-hidden="true" />

        <div className="relative z-10 w-full px-8 lg:px-12 pb-10 lg:pb-12 pt-16">
          <div className="max-w-xl">
            <h2 className="text-[34px] md:text-[44px] lg:text-[50px] font-normal tracking-[-0.03em] text-[#16171C] leading-[1.05] mb-5">
              Ready to stop
              <br />
              leaking alpha?
            </h2>

            <p className="text-[#16171C]/80 text-sm md:text-[15px] leading-relaxed max-w-md mb-7">
              One registry to wrap from. One flow to distribute through. Zero
              numbers exposed.
            </p>

            <button
              type="button"
              className="inline-flex items-center gap-2 bg-[#16171C] hover:bg-black text-white font-semibold text-sm px-5 py-3 rounded-lg transition-colors"
            >
              Connect Wallet
              <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
