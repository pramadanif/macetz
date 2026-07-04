"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, ChevronRight, CheckCircle2, Clock } from "lucide-react";
import { motion } from "motion/react";

export function ConfidentialDistribution() {
  const [items, setItems] = useState<{ id: number; addr: string; status: string }[]>([
    { id: 1, addr: "0xet65..4f3", status: "Claimed" },
    { id: 2, addr: "0x9906..036", status: "Pending" },
    { id: 3, addr: "0x61xb..e064", status: "Claimed" },
    { id: 4, addr: "0x560f..229", status: "Pending" },
    { id: 5, addr: "0x8b2a..c41", status: "Pending" },
    { id: 6, addr: "0x34cc..1b9", status: "Claimed" },
    { id: 7, addr: "0x89fc..3b2", status: "Claimed" },
  ]);

  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      
      setTimeout(() => {
        // Snap back instantly and shift array to create an infinite loop
        setIsAnimating(false);
        setItems((prev: { id: number; addr: string; status: string }[]) => {
          const arr = [...prev];
          const first = arr.shift();
          if (first) arr.push(first);
          return arr;
        });
      }, 700);
    }, 2500);
    
    return () => clearInterval(interval);
  }, []);

  // Center focus shifts down during the animation to track the moving item
  const visualActiveIndex = isAnimating ? 3 : 2;

  return (
    <section id="distribute" className="px-4 py-20 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20" style={{ perspective: "1200px" }}>
      
      <motion.div 
        initial={{ opacity: 0, rotateX: -25, y: 40 }}
        whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col lg:flex-row w-full rounded-3xl overflow-hidden border border-black/5 bg-[#F8F8F7] shadow-sm transform-gpu"
      >
        
        {/* Left Side: Original Content */}
        <div className="w-full lg:w-[45%] p-10 lg:p-16 flex flex-col justify-center">
          <div className="text-xs font-semibold text-gray-500 mb-4 tracking-[0.14em] uppercase">
            Confidential Distribution · Powered by TokenOps SDK
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-[-0.03em] text-[#16171C] leading-[1.1] mb-6">
            Distribute to hundreds.
            <br className="hidden lg:block" /> Reveal to none.
          </h2>
          <p className="text-[#6B7280] font-medium text-[15px] md:text-[16px] mb-10 max-w-[95%] leading-[1.7]">
            Payroll, airdrops, and investor distributions all share the same
            problem onchain: everyone can see who got paid and how much. Macetz&apos;s
            distribution layer, built on the TokenOps SDK, keeps amounts and
            recipient lists encrypted end-to-end — while every recipient can
            independently verify and decrypt exactly their own allocation, in one
            click.
          </p>
          
          <div className="flex flex-col items-start gap-4">
            <button className="bg-white hover:bg-gray-50 border border-black/10 shadow-sm px-6 py-3 rounded-full text-sm font-medium text-gray-800 transition-colors inline-flex items-center gap-2">
              Try Confidential Distribution <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-xs text-gray-400 max-w-sm">
              No plaintext amounts. No public recipient list. Just a provable total
              and private claims.
            </p>
          </div>
        </div>

        {/* Right Side: New Split-Layout Design applied to Distribution */}
        <div className="w-full lg:w-[55%] relative bg-gradient-to-r from-[#FFD64A] via-[#FFF1B8]/60 to-[#F8F8F7] flex items-center justify-center p-8 lg:p-12 overflow-hidden min-h-[500px]">
          
          {/* Mask container to fade out top and bottom */}
          <div 
            className="absolute inset-0 flex flex-col items-center justify-start overflow-hidden px-8 pointer-events-none" 
            style={{ 
              maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)', 
              WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)' 
            }}
          >
            <motion.div
              animate={{ y: isAnimating ? -112 : 0 }}
              transition={{ duration: isAnimating ? 0.7 : 0, ease: [0.16, 1, 0.3, 1] }}
              className="w-full flex flex-col gap-4 items-center pt-[10px]"
            >
              {items.map((item: { id: number; addr: string; status: string }, i: number) => {
                const distance = Math.abs(i - visualActiveIndex);

                let opacity = "opacity-100";
                let blur = "";
                let isActive = false;

                if (distance === 0) {
                  isActive = true;
                } else if (distance === 1) {
                  opacity = "opacity-60";
                  blur = "blur-[2px]";
                } else {
                  opacity = "opacity-30";
                  blur = "blur-[5px]";
                }

                return (
                  <DistributionRow 
                    key={item.id}
                    opacity={opacity}
                    blur={blur}
                    isActive={isActive}
                    address={item.addr}
                    status={item.status}
                  />
                );
              })}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function DistributionRow({ opacity = "", blur = "", isActive = false, address, status }: { opacity?: string, blur?: string, isActive?: boolean, address: string, status: string }) {
  const isClaimed = status === "Claimed";
  
  return (
    <div className={`w-full max-w-[460px] h-[96px] rounded-xl p-5 lg:p-6 flex items-center justify-between transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isActive ? 'bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)] shadow-inset-light border border-black/5 z-10 scale-[1.05]' : `bg-white/40 shadow-inset-light ${opacity} ${blur} scale-100`}`}>
      <div className="flex flex-col gap-1 w-[45%]">
        <span className="text-[12px] text-gray-500 font-medium">Recipient</span>
        <span className="text-sm font-mono text-black">{address}</span>
      </div>
      
      <div className="w-px h-10 bg-black/10 mx-2 lg:mx-4" />
      
      <div className="flex flex-col gap-1 w-[25%] text-center">
        <span className="text-[12px] text-gray-500 font-medium">Amount</span>
        <span className="text-[15px] font-mono text-black tracking-[0.2em] mt-0.5">***</span>
      </div>

      <div className="w-px h-10 bg-black/10 mx-2 lg:mx-4" />

      <div className="flex flex-col gap-1 w-[25%] items-end">
        <span className="text-[12px] text-gray-500 font-medium">Status</span>
        <div className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full shadow-inset-light ${isClaimed ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
          {isClaimed ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
          {status}
        </div>
      </div>
    </div>
  )
}
