"use client";

import React from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import heroAsset from "../../assets/heroasset.png";
import { FloatingEncryptedCard } from "./FloatingEncryptedCard";
import { HeroRotatingCopy } from "./HeroRotatingCopy";

const ANNOTATION_PILLS = [
  "Registry-sourced, onchain",
  "EIP-712 decrypt",
  "TokenOps distribution",
];

const FLOATING_CARDS = [
  {
    title: "ERC-7984 Shielding",
    className: "hidden sm:block bottom-[12%] -left-[6%] lg:bottom-[15%] lg:-left-[10%] xl:-left-[12%]",
    delay: 0.9,
    fields: [
      { label: "Ciphertext", value: "0x2b7f9a3e1c8d4f6a0" },
      { label: "euint64", value: "Encrypted State" },
    ],
  },
  {
    title: "EIP-712 Decryption",
    className: "hidden md:block top-[42%] -right-[10%] lg:top-[40%] lg:-right-[14%] xl:-right-[16%]",
    delay: 1.5,
    fields: [
      { label: "Signature", value: "0x6c1a9e3f7b2d8a4" },
      { label: "Plaintext", value: "1,000.00 cUSDC" },
    ],
  },
];

export function Hero() {
  return (
    <section className="hero-section relative overflow-hidden bg-[#F5F4F0] min-h-[95vh] flex flex-col justify-center">
      {/* Refined Elegant Glow Effects */}
      <div className="absolute top-[40%] right-[-10%] lg:right-[5%] -translate-y-1/2 w-[800px] h-[600px] bg-[#F5C518]/15 blur-[140px] rounded-full pointer-events-none mix-blend-multiply" aria-hidden="true" />
      <div className="absolute top-[35%] right-[0%] lg:right-[10%] -translate-y-1/2 w-[500px] h-[500px] bg-white/50 blur-[90px] rounded-full pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 lg:pt-36 pb-16 lg:pb-24 w-full">
        
        {/* Two-Column Grid Layout */}
        <div className="hero-section__grid items-center">
          
          {/* Left Column: Copy & Actions */}
          <div className="hero-section__copy !items-start !text-left">
            {/* Top Annotation Pills (Aligned left on desktop) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-wrap justify-start gap-2.5 mb-8"
            >
              {ANNOTATION_PILLS.map((pill, i) => (
                <span
                  key={pill}
                  className="bg-white/70 backdrop-blur-md border border-white/80 shadow-inset-light px-4 py-2 text-[11px] font-semibold tracking-wide text-gray-500 rounded-full"
                  style={{ animationDelay: `${i * 0.15}s` }}
                >
                  {pill}
                </span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            >
              <HeroRotatingCopy />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="flex flex-col items-start gap-6 mt-8 w-full"
            >
              {/* Elegant Buttons */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <button className="bg-[#16171C] hover:bg-black text-white font-medium text-[15px] px-8 py-4 rounded-full transition-all duration-300 shadow-inset-dark hover:-translate-y-0.5 inline-flex items-center gap-2">
                  Launch Registry <ArrowUpRight className="w-4 h-4 opacity-70" />
                </button>
                <button className="bg-white/70 hover:bg-white backdrop-blur-md border border-white/80 text-gray-800 font-medium text-[15px] px-8 py-4 rounded-full transition-all duration-300 shadow-inset-light inline-flex items-center gap-2">
                  View Live Demo
                </button>
              </div>

              <p className="text-[11px] font-semibold text-gray-400 tracking-[0.1em] uppercase mt-2 opacity-80 text-left">
                Built on Zama Protocol • FHEVM • Live on Sepolia
              </p>
            </motion.div>
          </div>

          {/* Right Column: Visual Asset Stage */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="hero-section__visual"
          >
            <div className="hero-section__stage w-full relative">
              <div className="hero-section__asset-wrap !pt-0 relative w-full flex items-center justify-center">
                
                {/* Floating Cards (Placed elegantly around the larger image) */}
                {FLOATING_CARDS.map((card) => (
                  <FloatingEncryptedCard
                    key={card.title}
                    title={card.title}
                    fields={card.fields}
                    className={card.className}
                    delay={card.delay}
                    size="lg"
                  />
                ))}

                {/* Main Hero Image */}
                <div className="hero-section__asset-image relative z-10 w-full flex justify-center transform transition-transform duration-1000 hover:scale-[1.01]">
                  <Image
                    src={heroAsset}
                    alt="Hero asset"
                    width={658}
                    height={689}
                    priority
                    sizes="(max-width: 768px) 80vw, (max-width: 1280px) 45vw, 600px"
                    className="hero-section__hero-img !w-[90%] lg:!w-[85%] lg:-mr-10 h-auto object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.08)]"
                  />
                </div>
              </div>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
