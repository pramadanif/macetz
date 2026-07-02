import React from 'react';

export function CTAFooter() {
  return (
    <footer className="px-4 py-24 pb-32 max-w-7xl mx-auto w-full flex flex-col items-center">
      <div className="relative w-full max-w-3xl">
        {/* Large yellow glow behind CTA */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[150%] bg-yellow-400/20 blur-[100px] rounded-[100%] pointer-events-none" />
        
        <div className="glass-panel border-white/80 rounded-[3rem] p-12 lg:p-20 text-center relative z-10 overflow-hidden">
          {/* Subtle light leak effect */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 blur-[50px] rounded-full mix-blend-overlay pointer-events-none" />
          
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-6 leading-tight relative z-10">
            Ready to stop<br />leaking alpha?
          </h2>
          <p className="text-gray-500 font-medium text-sm lg:text-base max-w-sm mx-auto mb-10 relative z-10">
            Subtle liquid glass mesh gradient with swirling light grey scoreboard.
          </p>
          
          <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-base px-8 py-4 rounded-full transition-colors shadow-[0_4px_20px_rgba(245,197,24,0.4)] hover:scale-105 transform-gpu relative z-10">
            Connect Wallet
          </button>
        </div>
      </div>
    </footer>
  );
}
