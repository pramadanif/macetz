"use client";

import React from "react";
import { ArrowRight, Package, PieChart, Send } from "lucide-react";
import { motion } from "motion/react";

export function HowItWorks() {
  const steps = [
    {
      id: 1,
      title: "Wrap Assets",
      desc: "Convert any registry ERC-20 into its confidential ERC-7984 equivalent.",
      icon: Package,
      theme: "silver",
    },
    {
      id: 2,
      title: "Define Allocations",
      desc: "Set encrypted distribution amounts for your selected recipients.",
      icon: PieChart,
      theme: "silver",
    },
    {
      id: 3,
      title: "Execute Payload",
      desc: "Send it. Amounts stay encrypted onchain; only recipients can decrypt their own.",
      icon: Send,
      theme: "gold",
    },
  ];

  return (
    <section className="px-4 py-32 max-w-[1400px] mx-auto relative">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-16 max-w-4xl mx-auto flex flex-col items-center"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/[0.03] border border-black/[0.06] mb-6">
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
          <span className="text-[13px] font-semibold text-[#52525B] tracking-wide uppercase">
            Operational Pipeline
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-[-0.03em] text-[#0A0A0A] mb-8 leading-[1.1]">
          End-to-End Confidentiality.<br className="hidden lg:block"/> In Three Steps.
        </h2>
        <a href="/app" className="bg-[#0A0A0A] text-white rounded-full px-6 py-3 text-[14px] font-medium hover:bg-gray-800 transition-all hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)] shadow-inset-dark hover:-translate-y-0.5 inline-flex items-center gap-2">
          Explore the Registry <ArrowRight className="w-4 h-4 text-gray-400" />
        </a>
      </motion.div>

      <div className="w-full max-w-5xl mx-auto px-4 lg:px-0">
        <div className="glass-panel bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-8 lg:p-16 border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.03)] shadow-inset-light relative overflow-hidden group">
          
          {/* Subtle Background Glow for Step 3 */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-yellow-400/5 to-transparent pointer-events-none" />

          {/* Desktop Connecting Line */}
          <motion.div 
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.2, delay: 0.2, ease: "easeInOut" }}
            className="hidden md:block absolute top-[6.5rem] left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-gray-200 via-gray-300 to-yellow-300 origin-left" 
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8 relative z-10">
            {steps.map((step) => {
              const Icon = step.icon;
              const isGold = step.theme === "gold";

              return (
                <motion.div 
                  key={step.id} 
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.8, delay: 0.3 + (step.id * 0.15), ease: isGold ? [0.34, 1.56, 0.64, 1] : "easeOut" }}
                  className="flex flex-col items-center text-center relative group/step"
                >
                  
                  {/* Icon Node */}
                  <div className={`w-14 h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center relative mb-8 transition-all duration-500 group-hover/step:-translate-y-1 ${
                    isGold 
                      ? "bg-gradient-to-b from-yellow-50 to-white shadow-[0_4px_15px_rgba(250,204,21,0.15)] ring-1 ring-yellow-400/40" 
                      : "bg-gradient-to-b from-gray-50 to-white shadow-[0_4px_15px_rgba(0,0,0,0.04)] ring-1 ring-black/5"
                  }`}>
                    {/* Hover Glow */}
                    <div className={`absolute inset-0 rounded-full blur-[12px] transition-opacity duration-500 opacity-0 group-hover/step:opacity-60 ${
                      isGold ? "bg-yellow-400" : "bg-gray-300"
                    }`} />
                    
                    <Icon className={`w-5 h-5 lg:w-6 lg:h-6 relative z-10 transition-colors duration-500 ${
                      isGold ? "text-yellow-600" : "text-[#52525B]"
                    }`} strokeWidth={2} />
                  </div>

                  {/* Step Label */}
                  <div className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-4 text-[#A1A1AA]">
                    Step {step.id}
                  </div>

                  {/* Content */}
                  <h3 className="font-medium text-[#0A0A0A] text-xl lg:text-[22px] mb-3 leading-tight tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-[#6B7280] font-medium text-[15px] md:text-[16px] leading-[1.7] max-w-[260px]">
                    {step.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
