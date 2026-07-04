"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
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
    title: "Encrypted hex data",
    className: "top-[10%] left-[2%] md:top-[12%] md:left-[0%] lg:left-[2%]",
    delay: 0,
    fields: [
      { label: "", value: "0x7a3f9c2e1b8d4f6a0e5c3b7d9f1a2e4" },
      { label: "", value: "0xc4e8f2a1b9d6e3f7a0c5b8d2e6f9a1" },
    ],
  },
  {
    title: "Encrypted hex data",
    className: "top-[8%] right-[2%] md:top-[10%] md:right-[0%] lg:right-[2%]",
    delay: 0.15,
    fields: [
      { label: "Title", value: "0x8f2a1c9e4b7d3f6a0e5" },
      { label: "Amount", value: "0x3d7f1a9c2e8b4f6a0c5" },
    ],
  },
  {
    title: "Encryption",
    className: "hidden sm:block top-[46%] right-[-2%] md:right-[0%] lg:right-[1%]",
    delay: 0.3,
    fields: [
      { label: "Control", value: "0x5a9c3e7f1b2d8a4e6f0" },
      { label: "Amount", value: "0x1f8e4c2a9b7d3f6e0a5" },
    ],
  },
  {
    title: "Validation Meta",
    className: "hidden md:block bottom-[16%] right-[4%] lg:right-[6%]",
    delay: 0.45,
    fields: [
      { label: "Qty", value: "0x9e2f4a8c1b7d3e6f0a5" },
      { label: "Status", value: "0x6c1a9e3f7b2d8a4e0f5" },
    ],
  },
  {
    title: "Encrypted system",
    className: "hidden sm:block bottom-[14%] left-[2%] md:left-[0%] lg:left-[2%]",
    delay: 0.6,
    fields: [
      { label: "Source", value: "0x2b7f9a3e1c8d4f6a0e5" },
      { label: "Amount", value: "0x4d8e1f3a9c2b7e6f0a5" },
    ],
  },
];

export function Hero() {
  return (
    <section className="hero-section relative overflow-hidden">
      <div className="hero-section__glow pointer-events-none" aria-hidden="true" />

      <div className="hero-section__inner max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 lg:pt-14 pb-16 lg:pb-20">
        <div className="hero-section__grid">
          <div className="hero-section__copy">
            <HeroRotatingCopy />

            <div className="hero-section__actions">
              <div className="hero-section__ctas">
                <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium text-sm px-6 py-3 rounded-full transition-colors shadow-lg shadow-yellow-500/20 inline-flex items-center gap-1">
                  Launch Registry <ArrowRight className="w-4 h-4" />
                </button>
                <button className="glass-pill hover:bg-white/90 text-gray-800 font-normal text-sm px-6 py-3 rounded-full transition-colors">
                  View Live Distribution Demo
                </button>
              </div>

              <p className="hero-section__trust">
                Built on Zama Protocol · FHEVM · ERC-7984 · Open Source · Live on
                Sepolia
              </p>
            </div>
          </div>

          <div className="hero-section__visual">
            <div className="hero-section__stage">
              <div className="hero-section__pills">
                {ANNOTATION_PILLS.map((pill) => (
                  <span
                    key={pill}
                    className="glass-pill px-3.5 py-1.5 text-[10px] md:text-[11px] font-normal text-gray-700 rounded-full"
                  >
                    {pill}
                  </span>
                ))}
              </div>

              <div className="hero-section__asset-wrap">
                <div className="hero-section__asset-glow pointer-events-none" aria-hidden="true" />
                <div className="hero-section__asset-ring pointer-events-none" aria-hidden="true" />

                {FLOATING_CARDS.map((card) => (
                  <FloatingEncryptedCard
                    key={card.title + card.className}
                    title={card.title}
                    fields={card.fields}
                    className={card.className}
                    delay={card.delay}
                    size="lg"
                  />
                ))}

                <div className="hero-section__asset-image relative z-10">
                  <Image
                    src={heroAsset}
                    alt="Hero asset"
                    width={658}
                    height={689}
                    priority
                    sizes="(max-width: 768px) 88vw, (max-width: 1280px) 52vw, 620px"
                    className="hero-section__hero-img"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
