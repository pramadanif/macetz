"use client";

import React from "react";
import { Check } from "lucide-react";
import { motion } from "motion/react";

const FEATURES = [
  "Every official registry pair available straight from the dropdown.",
  "Paste any ERC-7984 address — validated onchain via ERC-165 before decrypting.",
  "One EIP-712 signature decrypts via Zama's public relayer network.",
  "Your signature authorizes decryption of your own balance only — no one else can read it.",
];

export function UniversalDecryptSection() {
  return (
    <section id="decrypt" className="px-4 py-32 max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#F9D48D]/5 to-transparent pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex-1 text-center lg:text-left relative z-10 max-w-2xl mx-auto lg:mx-0 pl-0 lg:pl-10"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/[0.03] border border-black/[0.06] mb-6">
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
          <span className="text-[13px] font-semibold text-[#52525B] tracking-wide uppercase">
            Universal Decryption
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-[-0.03em] text-[#0A0A0A] mb-5 leading-[1.1]">
          Decrypt Any Balance.<br className="hidden lg:block"/> In One Click.
        </h2>
        <p className="text-[#6B7280] font-medium text-[15px] md:text-[16px] mb-8 leading-[1.7] max-w-2xl mx-auto lg:mx-0">
          Gone are the days of complex signature orchestration just to view your own funds. Macetz provides a unified EIP-712 decryption gateway.
        </p>
        <a href="/app" className="bg-[#0A0A0A] text-white rounded-full px-7 py-3.5 text-[15px] font-semibold hover:bg-gray-800 transition-all hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] shadow-inset-dark hover:-translate-y-0.5 inline-flex items-center gap-2">
          Try Decrypting a Balance <span className="text-gray-400">→</span>
        </a>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="flex-1 w-full max-w-lg relative z-10 pr-0 lg:pr-10 mt-10 lg:mt-0"
      >
        <div className="absolute -inset-10 bg-yellow-400/10 blur-[60px] rounded-full pointer-events-none" />
        
        <div className="glass-panel bg-white/60 backdrop-blur-2xl border border-white/80 rounded-[2.5rem] p-8 lg:p-10 space-y-7 shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] shadow-inset-light transition-shadow duration-500">
          {FEATURES.map((feature, idx) => (
            <div key={feature} className="relative z-10 flex items-start gap-4 group">
              <div className="w-[26px] h-[26px] rounded-full bg-gradient-to-b from-yellow-100 to-yellow-50 flex items-center justify-center shrink-0 mt-1 shadow-[0_2px_8px_rgba(250,204,21,0.2)] ring-1 ring-yellow-400/20 group-hover:scale-110 transition-transform duration-300">
                <Check className="w-3.5 h-3.5 text-yellow-600" strokeWidth={3} />
              </div>
              <p className="text-[15px] lg:text-[16px] text-[#52525B] font-medium leading-[1.6] group-hover:text-[#0A0A0A] transition-colors duration-300">
                {feature}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
