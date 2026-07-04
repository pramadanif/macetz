import React from 'react';
import { ChevronRight } from 'lucide-react';

export function ConfidentialitySection() {
  return (
    <section className="px-4 py-20 max-w-7xl mx-auto w-full">
      <div className="flex flex-col lg:flex-row w-full rounded-3xl overflow-hidden border border-black/5 bg-[#F5F4F0] shadow-sm">
        
        {/* Left Side */}
        <div className="w-full lg:w-[45%] p-10 lg:p-16 flex flex-col justify-between">
          <h2 className="text-3xl md:text-4xl lg:text-[42px] font-normal tracking-[-0.03em] text-[#16171C] leading-[1.15] mb-12 lg:mb-32">
            Confidentiality is the missing piece to unlock institutional onchain finance
          </h2>
          
          <p className="text-[#6B7280] text-sm md:text-[15px] leading-relaxed max-w-[95%]">
            Until now, every transaction on a public blockchain exposed amounts and
            balances to anyone. For institutions operating in regulated markets, that
            exposure has made onchain finance a non-starter. Zama closes that gap,
            keeping amounts and balances confidential, while maintaining full verifiability
            and compliance.
          </p>
        </div>

        {/* Right Side */}
        <div className="w-full lg:w-[55%] relative bg-gradient-to-r from-[#FFD64A] via-[#FFF1B8]/60 to-[#F5F4F0] flex items-center justify-center p-8 lg:p-12 overflow-hidden min-h-[500px]">
          
          {/* Mask container to fade out top and bottom */}
          <div 
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 w-full h-full px-8" 
            style={{ 
              maskImage: 'linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)', 
              WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)' 
            }}
          >
            
            {/* Blurred Row 1 */}
            <TransferRow opacity="opacity-30" blur="blur-[4px]" />
            {/* Blurred Row 2 */}
            <TokenRow opacity="opacity-50" blur="blur-[2px]" token="cUSDC" />
            
            {/* Active Row 3 */}
            <TransferRow isActive />

            {/* Blurred Row 4 */}
            <TokenRow opacity="opacity-50" blur="blur-[2px]" token="cUSDT" address="0x9307..59" />
            {/* Blurred Row 5 */}
            <TransferRow opacity="opacity-30" blur="blur-[4px]" />
            
          </div>
        </div>
      </div>
    </section>
  );
}

function TransferRow({ opacity = "", blur = "", isActive = false }: { opacity?: string, blur?: string, isActive?: boolean }) {
  return (
    <div className={`w-full max-w-[460px] rounded-xl p-5 lg:p-6 flex items-center justify-between transition-all ${isActive ? 'bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-black/5 z-10 scale-[1.02]' : `bg-white/40 ${opacity} ${blur}`}`}>
      <div className="flex flex-col">
        <span className="text-[12px] text-gray-500 font-medium mb-1">From</span>
        <span className="text-sm font-mono text-black">0x61xb..e064</span>
      </div>
      <div className={`w-6 h-6 lg:w-7 lg:h-7 rounded-full flex items-center justify-center mx-2 shrink-0 ${isActive ? 'bg-[#FFD64A]' : 'bg-[#FFD64A]/50'}`}>
        <ChevronRight className={`w-3 h-3 lg:w-4 lg:h-4 ${isActive ? 'text-black' : 'text-black/50'}`} />
      </div>
      <div className="flex flex-col">
        <span className="text-[12px] text-gray-500 font-medium mb-1">To</span>
        <span className="text-sm font-mono text-black">0x9307..59</span>
      </div>
      <div className="w-px h-10 bg-black/10 mx-4 lg:mx-6" />
      <div className="flex flex-col text-left min-w-[80px]">
        <span className="text-[12px] text-gray-500 font-medium mb-1">Amount</span>
        <span className="text-[15px] font-mono text-black tracking-[0.2em] mt-0.5">**********</span>
      </div>
    </div>
  )
}

function TokenRow({ opacity, blur, token, address = "0x61xb..e064" }: { opacity: string, blur: string, token: string, address?: string }) {
  return (
    <div className={`w-full max-w-[460px] rounded-xl p-5 lg:p-6 flex items-center justify-between bg-white/40 ${opacity} ${blur}`}>
      <div className="flex flex-col gap-2 w-[60%]">
        <div className="flex items-center">
          <span className="text-[12px] text-gray-500 font-medium w-16">Address</span>
          <span className="text-sm font-mono text-black">{address}</span>
        </div>
        <div className="flex items-center">
          <span className="text-[12px] text-gray-500 font-medium w-16">Token</span>
          <span className="text-sm font-mono text-black">{token}</span>
        </div>
      </div>
      <div className="flex flex-col justify-center text-left min-w-[80px]">
        <span className="text-[12px] text-gray-500 font-medium mb-1">Amount</span>
        <span className="text-[15px] font-mono text-black tracking-[0.2em] mt-0.5">**********</span>
      </div>
    </div>
  )
}
