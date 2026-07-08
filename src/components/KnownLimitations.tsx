"use client";

import React from "react";
import { motion } from "motion/react";
import { AlertTriangle, TestTube2, GitBranch, Layers, Eye } from "lucide-react";

const LIMITATIONS = [
  {
    icon: TestTube2,
    title: "Sepolia-First, Mainnet Relayer-Dependent",
    desc: "The full bounty flow is validated on Sepolia. Ethereum mainnet supports registry browsing today; mainnet wrap/decrypt depend on Zama's mainnet relayer availability and sit behind a real-funds confirmation gate.",
  },
  {
    icon: Eye,
    title: "Recipient Addresses Are Public",
    desc: "Confidential Distribution FHE-encrypts amounts end-to-end — only each recipient can decrypt their own amount, and no third party sees individual figures. Recipient addresses, however, remain visible onchain: this is a property of the underlying TokenOps Disperse mechanism, which routes transfers to plaintext addresses, not an oversight in Macetz.",
  },
  {
    icon: GitBranch,
    title: "Hybrid Sourcing",
    desc: 'The Registry prioritizes the onchain Wrappers Registry; local config pairs are clearly labeled "Dev Pair" and excluded from production stats.',
  },
  {
    icon: Layers,
    title: "Single Token Batches",
    desc: "Distribution via TokenOps SDK currently supports a single token per distribution batch — multi-token batches are on the roadmap.",
  },
  {
    icon: AlertTriangle,
    title: "Unaudited Beta",
    desc: "This is a community project built for the Zama Developer Program. Use at your own risk; do not use with real funds.",
  },
];

export function KnownLimitations() {
  return (
    <section className="px-4 py-32 max-w-7xl mx-auto relative">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-yellow-400/5 blur-[100px] rounded-full pointer-events-none" aria-hidden="true" />
      
      <div className="text-center mb-16 lg:mb-20 max-w-4xl mx-auto flex flex-col items-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/[0.03] border border-black/[0.06] mb-6"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
          <span className="text-[13px] font-semibold text-[#52525B] tracking-wide uppercase">
            Transparency Report
          </span>
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-[-0.03em] text-[#16171C] leading-[1.1] mb-6"
        >
          Current Limitations
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-[#6B7280] font-medium text-[15px] md:text-[16px] max-w-2xl mx-auto leading-[1.7]"
        >
          We believe in complete transparency. While Macetz demonstrates the powerful capabilities of FHEVM, please be aware of these current architectural constraints.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 max-w-5xl mx-auto relative z-10">
        {LIMITATIONS.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              className="group flex flex-col md:flex-row gap-5 lg:gap-6 items-start bg-white/40 hover:bg-white/80 backdrop-blur-xl border border-black/[0.04] hover:border-yellow-400/30 rounded-[1.5rem] p-6 lg:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] shadow-inset-light transition-all duration-500"
            >
              <div className="shrink-0 w-12 h-12 rounded-full bg-gradient-to-b from-gray-50 to-white border border-black/5 shadow-sm flex items-center justify-center group-hover:scale-110 group-hover:-translate-y-1 transition-transform duration-500">
                <Icon className="w-5 h-5 text-[#52525B] group-hover:text-yellow-600 transition-colors duration-500" strokeWidth={2} />
              </div>
              <div className="flex flex-col">
                <h3 className="text-[17px] font-semibold text-[#16171C] mb-2 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-[#6B7280] font-medium text-[14px] leading-[1.65]">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
