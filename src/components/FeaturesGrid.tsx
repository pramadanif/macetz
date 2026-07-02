import React from 'react';
import { Search } from 'lucide-react';

export function FeaturesGrid() {
  return (
    <section className="px-4 py-20 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 mb-4">
          The Official Zama Wrapper Registry
        </h2>
        <p className="text-gray-500 font-medium text-sm lg:text-base max-w-xl mx-auto">
          Asymmetrical Bento-box layout: distinct UI micro-interactions per feature.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        {/* Card 1: Converter */}
        <div className="emboss-card rounded-3xl p-6 lg:p-8 flex flex-col min-h-[300px]">
          <div className="glass-pill self-start px-3 py-1.5 rounded-full flex items-center gap-2 mb-8">
            <div className="w-5 h-3 bg-yellow-400 rounded-full flex items-center p-0.5">
              <div className="w-2.5 h-2.5 bg-white rounded-full shadow-sm" />
            </div>
            <span className="text-xs font-semibold text-gray-800">ERC-20 ↔ ERC-7984</span>
          </div>
          
          <div className="mt-auto space-y-3">
            <div className="liquid-glass-field rounded-xl p-3 flex items-center gap-2">
              <Search className="w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Contract address..." 
                className="bg-transparent border-none outline-none text-sm w-full placeholder-gray-400 font-mono"
                readOnly
              />
            </div>
            <div className="liquid-glass-field rounded-xl p-3 flex items-center gap-2">
              <input 
                type="text" 
                placeholder="Bonded contract addresses..." 
                className="bg-transparent border-none outline-none text-sm w-full placeholder-gray-400 font-mono"
                readOnly
              />
            </div>
            <button className="glass-pill mt-4 px-4 py-2 text-sm font-medium text-gray-700 hover:text-black transition-colors self-start">
              Explore Registry
            </button>
          </div>
        </div>

        {/* Card 2: Faucet Illustration */}
        <div className="emboss-card rounded-3xl p-6 lg:p-8 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-blue-50/50" />
          {/* Abstract Faucet Graphic */}
          <div className="relative z-10 w-24 h-24">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-gray-400">
              <path d="M70 40H30V50C30 50 30 60 40 60H50V70H45V80H55V70H50V60H60C70 60 70 50 70 50V40Z" fill="url(#metalGrad)" />
              <path d="M50 85C50 85 45 90 45 95C45 97.7614 47.2386 100 50 100C52.7614 100 55 97.7614 55 95C55 90 50 85 50 85Z" fill="#9CA3AF" className="animate-pulse" />
              <defs>
                <linearGradient id="metalGrad" x1="30" y1="40" x2="70" y2="80" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#E5E7EB" />
                  <stop offset="1" stopColor="#9CA3AF" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Card 3: Decryption Search */}
        <div className="emboss-card rounded-3xl p-6 lg:p-8 flex flex-col min-h-[300px]">
          <div className="liquid-glass-field rounded-xl p-3 flex items-center gap-2 mb-6">
            <Search className="w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Q Search" 
              className="bg-transparent border-none outline-none text-sm w-full placeholder-gray-400"
              readOnly
            />
          </div>

          {/* Skeleton List */}
          <div className="space-y-3 mb-auto">
            <div className="h-4 bg-gray-200/60 rounded-md w-full animate-pulse" />
            <div className="h-4 bg-gray-200/60 rounded-md w-5/6 animate-pulse" />
            <div className="h-4 bg-gray-200/60 rounded-md w-4/6 animate-pulse" />
          </div>

          <div className="mt-8">
            <div className="text-xs text-gray-500 font-medium mb-2">Decryption loading...</div>
            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-400 w-1/3 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
