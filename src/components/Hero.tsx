"use client";

import React from "react";
import Image from "next/image";
import heroAsset from "../../assets/heroasset.png";
import { FloatingEncryptedCard } from "./FloatingEncryptedCard";

const FLOATING_CARDS = [
  {
    title: "Encrypted hex data",
    className: "top-[6%] left-[-4%] md:left-[-10%] lg:left-[-12%]",
    delay: 0,
    fields: [
      { label: "", value: "0x7a3f9c2e1b8d4f6a0e5c3b7d9f1a2e4" },
      { label: "", value: "0xc4e8f2a1b9d6e3f7a0c5b8d2e6f9a1" },
    ],
  },
  {
    title: "Encrypted hex data",
    className: "top-[4%] right-[-4%] md:right-[-8%] lg:right-[-10%]",
    delay: 0.15,
    fields: [
      { label: "Title", value: "0x8f2a1c9e4b7d3f6a0e5" },
      { label: "Amount", value: "0x3d7f1a9c2e8b4f6a0c5" },
    ],
  },
  {
    title: "Encryption",
    className: "top-[42%] right-[-6%] md:right-[-12%] lg:right-[-14%]",
    delay: 0.3,
    fields: [
      { label: "Control", value: "0x5a9c3e7f1b2d8a4e6f0" },
      { label: "Amount", value: "0x1f8e4c2a9b7d3f6e0a5" },
    ],
  },
  {
    title: "Validation Meta",
    className: "bottom-[14%] right-[-2%] md:right-[-6%] lg:right-[-8%]",
    delay: 0.45,
    fields: [
      { label: "Qty", value: "0x9e2f4a8c1b7d3e6f0a5" },
      { label: "Status", value: "0x6c1a9e3f7b2d8a4e0f5" },
    ],
  },
  {
    title: "Encrypted system",
    className: "bottom-[10%] left-[-2%] md:left-[-8%] lg:left-[-10%]",
    delay: 0.6,
    fields: [
      { label: "Source", value: "0x2b7f9a3e1c8d4f6a0e5" },
      { label: "Amount", value: "0x4d8e1f3a9c2b7e6f0a5" },
    ],
  },
];

export function Hero() {
  return (
    <section className="relative px-4 pt-10 pb-24 overflow-hidden flex flex-col items-center text-center">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-yellow-400/10 blur-[120px] rounded-full pointer-events-none" />

      <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.1] mb-6 max-w-2xl mx-auto">
        Wrap. Shield. Distribute.
      </h1>

      <p className="text-gray-500 font-medium text-sm md:text-base leading-relaxed max-w-[600px] mx-auto mb-16 px-4">
        Enter the next era of decentralized finance. Manage ERC-20 to ERC-7984
        confidential wrappers, run encrypted airdrops, and secure your onchain
        payroll without leaking a single number — all powered by Zama Protocol.
      </p>

      <div className="relative w-full max-w-3xl mx-auto mb-12 px-2 sm:px-4 min-h-[340px] md:min-h-[420px]">
        <div className="absolute inset-x-10 top-8 bottom-4 rounded-full bg-yellow-400/15 blur-[90px] pointer-events-none" />

        {FLOATING_CARDS.map((card) => (
          <FloatingEncryptedCard
            key={card.title + card.className}
            title={card.title}
            fields={card.fields}
            className={card.className}
            delay={card.delay}
          />
        ))}

        <div className="relative flex justify-center">
          <Image
            src={heroAsset}
            alt="Hero asset"
            width={658}
            height={689}
            priority
            sizes="(max-width: 768px) 82vw, 520px"
            className="h-auto w-full max-w-[560px] object-contain relative z-10"
          />
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 relative z-30">
        <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold text-sm px-6 py-3 rounded-full transition-colors shadow-lg shadow-yellow-500/20">
          Launch App
        </button>
        <button className="glass-pill hover:bg-white/90 text-gray-800 font-semibold text-sm px-6 py-3 rounded-full transition-colors">
          Read Docs
        </button>
      </div>
    </section>
  );
}
