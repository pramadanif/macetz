import React from 'react';
import { CoinPlaceholder } from './CoinPlaceholder';

export function SupportedAssets() {
  const assets = [
    { id: 1, type: 'silver', symbol: 'T' },
    { id: 2, type: 'silver', symbol: 'S' },
    { id: 3, type: 'silver', symbol: 'E' },
    { id: 4, type: 'gold', symbol: 'ETH' },
    { id: 5, type: 'gold', symbol: 'DAI' },
    { id: 6, type: 'gold', symbol: 'USDT' },
  ];

  return (
    <section className="py-20 flex flex-col items-center overflow-hidden">
      <div className="text-center mb-12 px-4 max-w-2xl mx-auto">
        <div className="text-sm font-semibold text-gray-500 mb-3 tracking-wide">
          Supported Tokens
        </div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 mb-4">
          Supported Ecosystem Assets
        </h2>
        <p className="text-gray-500 font-medium text-sm leading-relaxed">
          Based on zero-knowledge proofs, standard crypto assets pass through 'shielding' threshold, transforming into confidential versions.
        </p>
      </div>

      {/* Horizontal Scrolling Row */}
      <div className="w-full relative px-4">
        {/* Fades for edges on desktop */}
        <div className="absolute left-0 top-0 bottom-0 w-12 lg:w-32 bg-gradient-to-r from-[#F5F4F0] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 lg:w-32 bg-gradient-to-l from-[#F5F4F0] to-transparent z-10 pointer-events-none" />
        
        <div className="flex items-center gap-4 lg:gap-8 overflow-x-auto hide-scrollbar pb-8 px-4 lg:justify-center w-full max-w-5xl mx-auto snap-x snap-mandatory">
          <div className="min-w-[50%] lg:min-w-0 shrink-0" /> {/* Spacer for centering scroll start on mobile */}
          
          <div className="glass-panel rounded-full p-3 lg:p-4 flex items-center gap-3 lg:gap-6 shrink-0 relative">
             <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-yellow-400/20 blur-xl rounded-full pointer-events-none" />
            
            {assets.map((asset) => (
              <div key={asset.id} className="snap-center relative shrink-0">
                <CoinPlaceholder 
                  type={asset.type as any} 
                  size="md" 
                  icon={<span className="font-bold text-xs lg:text-sm">{asset.symbol}</span>}
                  className="lg:w-16 lg:h-16"
                />
              </div>
            ))}
          </div>

          <div className="min-w-[50%] lg:min-w-0 shrink-0" /> {/* Spacer for centering scroll end on mobile */}
        </div>
      </div>
    </section>
  );
}
