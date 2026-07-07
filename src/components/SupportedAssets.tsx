"use client";

import React from "react";
import Script from "next/script";
import Image from "next/image";
import ethLogo from "../../assets/eth.png";
import usdcLogo from "../../assets/usdc.png";
import usdtLogo from "../../assets/usdt.png";
import { motion } from "motion/react";

const SplineViewer = "spline-viewer" as unknown as React.ElementType;

export function SupportedAssets() {
  const baseAssets = [
    { id: 't', src: usdtLogo, alt: 'USDT' },
    { id: 'c', src: usdcLogo, alt: 'USDC' },
    { id: 'e', src: ethLogo, alt: 'Ethereum' },
  ];
  
  // Duplicate to ensure infinite marquee fills the screen
  const duplicatedAssets = [...baseAssets, ...baseAssets, ...baseAssets, ...baseAssets];

  return (
    <section className="relative py-20 flex flex-col items-center overflow-hidden">
      <Script
        src="https://unpkg.com/@splinetool/viewer/build/spline-viewer.js"
        strategy="afterInteractive"
      />

      <style>{`
        @keyframes marquee-right {
          0% { transform: translate3d(-50%, 0, 0); }
          100% { transform: translate3d(0%, 0, 0); }
        }
        .animate-marquee-right {
          animation: marquee-right 35s linear infinite;
        }
      `}</style>

      <div className="text-center mb-12 lg:mb-20 px-4 max-w-4xl mx-auto flex flex-col items-center">
        <div className="text-sm font-semibold text-gray-500 mb-4 tracking-[0.14em] uppercase">
          Supported Tokens
        </div>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-[-0.03em] text-[#16171C] leading-[1.1] mb-6">
          Supported Ecosystem Assets
        </h2>
        <p className="text-[#6B7280] font-medium text-[15px] md:text-[16px] mb-10 max-w-2xl leading-[1.7]">
          Powered by Zama's fully homomorphic encryption (FHE), standard ERC-20
          tokens pass through a 'shielding' threshold and become their
          confidential ERC-7984 versions.
        </p>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-[170px] flex justify-center opacity-80">
        <div className="relative h-[340px] w-full max-w-6xl px-4">
          <SplineViewer url="https://prod.spline.design/tfgHnHMxrKyXwnM2/scene.splinecode" />
        </div>
      </div>

      <div className="relative z-10 w-full px-4 mt-8 lg:mt-16">
        
        {/* Marquee Track Container */}
        <motion.div 
          initial={{ opacity: 0, filter: "blur(15px)" }}
          whileInView={{ opacity: 1, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative w-full max-w-[1400px] mx-auto h-[160px] lg:h-[220px] flex items-center overflow-hidden"
          style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}
        >
          
          {/* Layer 1: Colored glowing coins (Visible only on the right) */}
          <div 
            className="absolute inset-0 z-10 flex items-center" 
            style={{ clipPath: 'inset(-150px -150px -150px 45%)', WebkitClipPath: 'inset(-150px -150px -150px 45%)' }}
          >
            <div className="flex w-max items-center animate-marquee-right">
              {/* Set 1 */}
              <div className="flex gap-12 lg:gap-24 items-center pr-12 lg:pr-24">
                {duplicatedAssets.map((asset, i) => (
                  <div key={`glow-1-${i}`} className="relative w-24 h-24 lg:w-40 lg:h-40 shrink-0">
                    <div className="absolute inset-2 bg-yellow-400 rounded-full blur-[20px] lg:blur-[40px] opacity-100 mix-blend-screen" />
                    <Image 
                      src={asset.src} 
                      alt={asset.alt} 
                      fill 
                      className="object-contain sepia saturate-[4] hue-rotate-[15deg] brightness-110 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]" 
                      sizes="(max-width: 768px) 96px, 160px" 
                    />
                  </div>
                ))}
              </div>
              {/* Set 2 (Identical for seamless loop) */}
              <div className="flex gap-12 lg:gap-24 items-center pr-12 lg:pr-24">
                {duplicatedAssets.map((asset, i) => (
                  <div key={`glow-2-${i}`} className="relative w-24 h-24 lg:w-40 lg:h-40 shrink-0">
                    <div className="absolute inset-2 bg-yellow-400 rounded-full blur-[20px] lg:blur-[40px] opacity-100 mix-blend-screen" />
                    <Image 
                      src={asset.src} 
                      alt={asset.alt} 
                      fill 
                      className="object-contain sepia saturate-[4] hue-rotate-[15deg] brightness-110 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]" 
                      sizes="(max-width: 768px) 96px, 160px" 
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Layer 2: The Glass Box (Left 45%) with silver/grayscale coins */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[110%] w-[45%] z-20 bg-white/20 backdrop-blur-2xl border-y border-r border-white/60 rounded-r-[3rem] overflow-hidden shadow-[12px_0_30px_rgba(0,0,0,0.06)] shadow-inset-light">
            <div className="absolute inset-0 shadow-[inset_-2px_0_12px_rgba(255,255,255,0.8)] shadow-inset-light pointer-events-none z-30" />
            
            <div className="absolute inset-0 flex items-center">
              <div className="flex w-max items-center animate-marquee-right">
                {/* Set 1 */}
                <div className="flex gap-12 lg:gap-24 items-center pr-12 lg:pr-24">
                  {duplicatedAssets.map((asset, i) => (
                    <div key={`gray-1-${i}`} className="relative w-24 h-24 lg:w-40 lg:h-40 shrink-0 opacity-80 grayscale contrast-125 brightness-95">
                      <Image src={asset.src} alt={asset.alt} fill className="object-contain" sizes="(max-width: 768px) 96px, 160px" />
                    </div>
                  ))}
                </div>
                {/* Set 2 */}
                <div className="flex gap-12 lg:gap-24 items-center pr-12 lg:pr-24">
                  {duplicatedAssets.map((asset, i) => (
                    <div key={`gray-2-${i}`} className="relative w-24 h-24 lg:w-40 lg:h-40 shrink-0 opacity-80 grayscale contrast-125 brightness-95">
                      <Image src={asset.src} alt={asset.alt} fill className="object-contain" sizes="(max-width: 768px) 96px, 160px" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </motion.div>

      </div>
    </section>
  );
}
