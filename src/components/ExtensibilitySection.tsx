"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export function ExtensibilitySection() {
  return (
    <section 
      id="extensibility" 
      className="relative w-full py-32 bg-[#050505] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Lens flare / Aurora effects in background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        {/* Top left yellowish glow */}
        <motion.div 
          animate={{ x: ["0%", "8%", "-4%", "0%"], y: ["0%", "-6%", "5%", "0%"] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-[#F7D08A]/10 rounded-full blur-[120px]" 
        />
        {/* Subtle rainbow streak approximation using rotated gradients */}
        <motion.div 
          animate={{ rotate: [30, 38, 25, 30], scale: [1, 1.1, 0.95, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] left-[-10%] w-[60%] h-[200px] bg-gradient-to-br from-transparent via-[#F7D08A]/15 to-transparent blur-3xl mix-blend-screen origin-center" 
        />
        <motion.div 
          animate={{ rotate: [35, 25, 42, 35], scale: [1, 1.05, 0.9, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[15%] left-[-5%] w-[50%] h-[150px] bg-gradient-to-br from-transparent via-[#E99757]/15 to-transparent blur-3xl mix-blend-screen origin-center" 
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-5xl w-full px-6 flex flex-col items-center text-center"
      >
        {/* Title */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-[-0.03em] mb-6 leading-[1.1]">
          <span className="text-white">Seamless Pair </span>
          <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-[#F9D48D] via-[#F1AC71] to-[#E99757] bg-clip-text text-transparent">
            Integration.
          </span>
        </h2>

        {/* Subtitle */}
        <p className="text-[#A1A1AA] font-medium text-[15px] md:text-[16px] max-w-2xl leading-[1.7] mb-16">
          Macetz utilizes a hybrid sourcing model. While the onchain Wrappers Registry serves as the primary source of truth, developers can effortlessly declare custom environments via a local configuration file. This enables rapid prototyping for pending registrations.
        </p>

        {/* Code Editor */}
        <div className="w-full max-w-[800px] rounded-xl bg-[#1C1C1C] border border-[#2A2A2A] shadow-inset-dark overflow-hidden text-left font-mono">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A2A2A]">
            <span className="text-[13px] text-[#A1A1AA]">config/custom-pairs.json</span>
            <a
              href="#"
              className="inline-flex items-center justify-center bg-[#FFD600] text-black text-xs font-bold px-3 py-1.5 rounded hover:bg-[#FFD600]/90 transition-colors"
            >
              Docs ↗
            </a>
          </div>

          {/* Code */}
          <div className="px-6 py-6 overflow-x-auto">
            <div className="flex text-[13px] leading-[1.6]">
              {/* Line Numbers */}
              <div className="flex flex-col text-right pr-6 text-[#555555] select-none shrink-0">
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
                <span>6</span>
                <span>7</span>
                <span>8</span>
                <span>9</span>
                <span>10</span>
                <span>11</span>
                <span>12</span>
              </div>
              
              {/* Code Content */}
              <div className="flex flex-col whitespace-pre">
                   <span><span className="text-[#E5E7EB]">{"{"}</span></span>
                   <span><span className="text-[#E5E7EB]">  </span><span className="text-[#86EFAC]">"pairs"</span><span className="text-[#E5E7EB]">{": ["}</span></span>
                   <span><span className="text-[#E5E7EB]">    {"{"}</span></span>
                   <span><span className="text-[#E5E7EB]">      </span><span className="text-[#86EFAC]">"erc20"</span><span className="text-[#E5E7EB]">{": "}</span><span className="text-[#EAB308]">"0xYourTestToken..."</span><span className="text-[#E5E7EB]">{","}</span></span>
                   <span><span className="text-[#E5E7EB]">      </span><span className="text-[#86EFAC]">"erc7984"</span><span className="text-[#E5E7EB]">{": "}</span><span className="text-[#EAB308]">"0xYourWrappedToken..."</span><span className="text-[#E5E7EB]">{","}</span></span>
                   <span><span className="text-[#E5E7EB]">      </span><span className="text-[#86EFAC]">"symbol"</span><span className="text-[#E5E7EB]">{": "}</span><span className="text-[#EAB308]">"cXYZ"</span><span className="text-[#E5E7EB]">{","}</span></span>
                   <span><span className="text-[#E5E7EB]">      </span><span className="text-[#86EFAC]">"decimals"</span><span className="text-[#E5E7EB]">{": "}</span><span className="text-[#22D3EE]">18</span><span className="text-[#E5E7EB]">{","}</span></span>
                   <span><span className="text-[#E5E7EB]">      </span><span className="text-[#86EFAC]">"source"</span><span className="text-[#E5E7EB]">{": "}</span><span className="text-[#EAB308]">"local-dev"</span></span>
                   <span><span className="text-[#E5E7EB]">    {"}"}</span></span>
                   <span><span className="text-[#E5E7EB]">  {"]"}</span></span>
                   <span><span className="text-[#E5E7EB]">{"}"}</span></span>
                   <span></span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center mt-16 max-w-2xl mx-auto">
          <p className="text-center text-[#A1A1AA] font-medium text-[15px] mb-8 leading-[1.7]">
            Upon server initialization, custom pairs instantly populate the Registry with complete wrap/unwrap functionality. They are automatically labeled as developer instances, ensuring strict separation from official assets.
          </p>
          <button className="bg-white text-black rounded-full px-7 py-3.5 text-[15px] font-semibold hover:bg-gray-200 transition-all hover:shadow-[0_8px_20px_rgba(255,255,255,0.15)] shadow-inset-light flex items-center gap-2">
            Read the Extensibility Guide <ArrowRight className="w-4 h-4 text-gray-500" />
          </button>
        </div>

      </motion.div>
    </section>
  );
}
