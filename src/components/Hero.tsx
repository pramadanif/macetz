"use client";

import React from 'react';
import { motion } from 'motion/react';
import { CoinPlaceholder } from './CoinPlaceholder';

export function Hero() {
  return (
    <section className="relative px-4 pt-32 pb-24 overflow-hidden flex flex-col items-center text-center">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-yellow-400/10 blur-[120px] rounded-full pointer-events-none" />

      <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.1] mb-6 max-w-2xl mx-auto">
        Wrap. Shield. Distribute.
      </h1>
      
      <p className="text-gray-500 font-medium text-sm md:text-base leading-relaxed max-w-[600px] mx-auto mb-16 px-4">
        Enter the next era of decentralized finance. Manage ERC-20 to ERC-7984 confidential wrappers, run encrypted airdrops, and secure your onchain payroll without leaking a single number — all powered by Zama Protocol.
      </p>

      {/* Centerpiece: Pedestal and Coins */}
      <div className="relative w-full max-w-lg mx-auto h-[320px] mb-12 flex justify-center items-end pb-8">
        
        {/* Glass Pedestal */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[280px] h-[80px] rounded-[100%] bg-white/40 backdrop-blur-xl border-t border-white/60 shadow-[0_10px_40px_rgba(0,0,0,0.1),_inset_0_-10px_20px_rgba(255,255,255,0.5)] z-0 flex items-center justify-center">
          <div className="w-[200px] h-[40px] rounded-[100%] bg-yellow-400/30 blur-xl" />
          <div className="absolute inset-0 rounded-[100%] border-[2px] border-white/30" />
        </div>

        {/* Floating Coins */}
        <div className="absolute inset-0 z-10 perspective-[1000px]">
          {/* Top Left Coin */}
          <motion.div
            animate={{ y: [0, -15, 0], rotateX: [10, 20, 10], rotateY: [-15, -5, -15] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-8 left-[15%]"
          >
            <CoinPlaceholder type="silver" size="lg" />
          </motion.div>

          {/* Top Right Coin */}
          <motion.div
            animate={{ y: [0, -10, 0], rotateX: [-10, 5, -10], rotateY: [15, 25, 15] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-12 right-[15%]"
          >
            <CoinPlaceholder type="gold" size="lg" />
          </motion.div>

          {/* Bottom Center Coin */}
          <motion.div
            animate={{ y: [0, -8, 0], rotateZ: [-5, 5, -5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 scale-125 origin-bottom"
          >
            <CoinPlaceholder type="silver" size="xl" />
          </motion.div>
        </div>

        {/* Annotations */}
        <div className="absolute top-20 left-0 hidden md:block">
          <div className="glass-pill text-[10px] px-3 py-1 text-gray-600 font-mono flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            Encrypted flow data
          </div>
          <svg className="absolute top-full left-1/2 w-16 h-16 pointer-events-none stroke-gray-300 stroke-1 fill-none" style={{ strokeDasharray: '2,2' }}>
            <path d="M 0 0 C 0 30, 40 30, 40 60" />
          </svg>
        </div>

        <div className="absolute top-12 right-0 hidden md:block">
          <div className="glass-pill text-[10px] px-3 py-1 text-gray-600 font-mono">
            Encrypted data<br/>
            <span className="text-gray-400">0x...83920</span>
          </div>
          <svg className="absolute top-full right-1/2 w-16 h-16 pointer-events-none stroke-gray-300 stroke-1 fill-none" style={{ strokeDasharray: '2,2' }}>
            <path d="M 16 0 C 16 20, -20 30, -30 50" />
          </svg>
        </div>

        <div className="absolute bottom-4 -right-4 z-20 hidden md:block">
          <div className="glass-pill text-[10px] px-3 py-1 text-gray-600 font-mono">
            Untrusted Data
          </div>
        </div>
      </div>

      {/* CTAs */}
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
