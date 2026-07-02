import React from 'react';
import { Menu } from 'lucide-react';
import { CoinPlaceholder } from './CoinPlaceholder';

export function Header() {
  return (
    <div className="fixed top-4 left-0 right-0 z-50 px-4 flex justify-center pointer-events-none">
      <header className="glass-panel rounded-full p-2 pr-4 flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.08)] w-full max-w-[1200px] pointer-events-auto">
        <div className="flex items-center gap-3 pl-2">
          <CoinPlaceholder type="silver" size="sm" className="w-8 h-8" />
          <span className="font-bold text-xl tracking-tight text-yellow-500">
            Macetz
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="bg-[#F5C518] hover:bg-yellow-500 text-black font-semibold text-sm px-5 py-2.5 rounded-full transition-colors shadow-sm">
            Connect Wallet
          </button>
          <button className="p-2 rounded-full hover:bg-black/5 transition-colors ml-1">
            <Menu className="w-6 h-6 text-gray-800" strokeWidth={2.5} />
          </button>
        </div>
      </header>
    </div>
  );
}
