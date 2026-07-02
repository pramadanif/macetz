import React from 'react';

export function NetworkActivity() {
  return (
    <section className="px-4 py-12 lg:py-24 max-w-7xl mx-auto w-full">
      {/* Container: Dark on mobile, transparent on desktop */}
      <div className="dark-panel lg:bg-none lg:border-none lg:!bg-transparent rounded-3xl p-6 md:p-8 lg:p-0 relative overflow-hidden lg:overflow-visible">
        
        {/* Mobile Glow */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-20 bg-yellow-400/20 blur-2xl rounded-full pointer-events-none lg:hidden" />

        {/* Header Section */}
        <div className="mb-8 lg:mb-12">
          {/* Mobile Eyebrow Badge */}
          <div className="lg:hidden inline-block bg-yellow-400/10 text-yellow-500 border border-yellow-500/20 text-xs font-semibold px-2 py-1 rounded-md mb-4">
            Primary Activity
          </div>
          {/* Desktop Eyebrow Text */}
          <div className="hidden lg:block text-sm font-semibold text-gray-500 mb-2">
            Token Stats / Live Registry
          </div>
          
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white lg:text-gray-900 tracking-tight">
            Network Activity
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-4 lg:gap-8">
          
          {/* Stat 1: TVS */}
          <div className="flex flex-col">
            <div className="hidden lg:block text-sm font-medium text-gray-500 mb-2">Total Value Shielded</div>
            <div className="text-2xl md:text-3xl lg:text-5xl font-bold text-white lg:text-gray-900 font-mono tracking-tighter mb-1">
              <span className="lg:hidden">TVS</span>
              <span className="hidden lg:inline">TVS</span>
            </div>
            <div className="text-xs text-gray-400 lg:hidden">Total Value Shielded (TVS)</div>
            {/* Desktop value - showing right next to TVS in ref, but structured like this */}
            <div className="hidden lg:block text-5xl font-bold text-gray-900 font-mono tracking-tighter mt-1">
              1,430
            </div>
          </div>

          {/* Stat 2: Tokens Wrapped */}
          <div className="flex flex-col">
            <div className="hidden lg:block text-sm font-medium text-gray-500 mb-2">Tokens Wrapped</div>
            <div className="text-2xl md:text-3xl lg:text-5xl font-bold text-white lg:text-gray-900 font-mono tracking-tighter mb-1">
              <span className="lg:hidden">18,578</span>
              <span className="hidden lg:inline">49.8Mn</span>
            </div>
            <div className="text-xs text-gray-400 lg:hidden">Tokens Wrapped</div>
          </div>

          {/* Stat 3: Encrypted (Mobile Only) / Active Addresses (Desktop) */}
          <div className="flex flex-col lg:hidden">
            <div className="text-2xl md:text-3xl font-bold text-white font-mono tracking-tighter mb-1">
              24.63
            </div>
            <div className="text-xs text-gray-400">Encrypted<br/>Distributions</div>
          </div>

          {/* Stat 4: Active Addresses */}
          <div className="flex flex-col">
            <div className="hidden lg:block text-sm font-medium text-gray-500 mb-2">Active Addresses</div>
            <div className="text-2xl md:text-3xl lg:text-5xl font-bold text-white lg:text-gray-900 font-mono tracking-tighter mb-1">
              <span className="lg:hidden">434</span>
              <span className="hidden lg:inline">43.37k</span>
            </div>
            <div className="text-xs text-gray-400 lg:hidden">Active Addresses</div>
          </div>

        </div>
      </div>
    </section>
  );
}
