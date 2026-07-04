"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

export function CTAFooter() {
  return (
    <section className="px-4 py-20 pb-24 max-w-7xl mx-auto w-full">
      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
        className="cta-gradient-box relative overflow-hidden rounded-[2rem] lg:rounded-[2.5rem] min-h-[320px] lg:min-h-[360px] flex items-end"
      >
        <div className="gradient-hero-fallback rounded-[2rem] lg:rounded-[2.5rem]" aria-hidden="true" />
        <div className="gradient-hero-wave gradient-hero-wave-1 rounded-[2rem] lg:rounded-[2.5rem]" aria-hidden="true" />
        <div className="gradient-hero-wave gradient-hero-wave-2 rounded-[2rem] lg:rounded-[2.5rem]" aria-hidden="true" />
        <div className="gradient-hero-wave gradient-hero-wave-3 rounded-[2rem] lg:rounded-[2.5rem]" aria-hidden="true" />

        <div className="relative z-10 w-full px-8 lg:px-12 pb-10 lg:pb-12 pt-16">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-[-0.03em] text-[#16171C] leading-[1.1] mb-5">
              Ready to stop
              <br />
              leaking alpha?
            </h2>

            <p className="text-[#16171C]/80 font-medium text-[15px] md:text-[16px] leading-[1.7] max-w-md mb-7">
              One registry to wrap from. One flow to distribute through. Zero
              numbers exposed.
            </p>

            <button
              type="button"
              className="inline-flex items-center gap-2 bg-[#16171C] hover:bg-black text-white font-semibold text-sm px-5 py-3 rounded-lg transition-colors hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
            >
              Connect Wallet
              <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
