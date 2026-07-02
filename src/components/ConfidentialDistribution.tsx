import React from 'react';
import { Upload, MoreHorizontal } from 'lucide-react';

export function ConfidentialDistribution() {
  const rows = [
    { id: 1, address: '0xet65555555553b45564f3...', amount: '***' },
    { id: 2, address: '0x990600000000304669036...', amount: '***' },
    { id: 3, address: '0x560f4C02c55B53d09229...', amount: '***' },
  ];

  return (
    <section className="px-4 py-20 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
      
      {/* Left Content */}
      <div className="flex-1 text-center lg:text-left">
        <div className="text-sm font-semibold text-gray-500 mb-3 tracking-wide">
          Confidential Distribution
        </div>
        <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-6 leading-[1.1]">
          Airdrops & Payroll,<br className="hidden lg:block"/> Completely Shielded
        </h2>
        <p className="text-gray-500 font-medium text-sm lg:text-base mb-8 max-w-md mx-auto lg:mx-0">
          Distribute airdrops and payroll onchain. Amounts stay encrypted — only recipients can decrypt their own allocation.
        </p>
        <button className="glass-pill px-5 py-2.5 text-sm font-medium text-gray-800 hover:text-black transition-colors inline-block">
          View SDK Documentation
        </button>
      </div>

      {/* Right Dashboard Panel */}
      <div className="flex-1 w-full max-w-md lg:max-w-none">
        <div className="dark-panel rounded-[2rem] p-6 lg:p-8 shadow-2xl relative overflow-hidden">
          {/* subtle glow */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-yellow-400/10 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="liquid-glass-field rounded-2xl p-4 mb-6 text-center border-dashed border border-white/40 flex flex-col items-center justify-center gap-2 h-32">
            <Upload className="w-6 h-6 text-gray-400" />
            <span className="text-sm text-gray-400 font-medium">CSV upload zone</span>
          </div>

          <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-4 px-2 uppercase tracking-wider">
            <span>Recipient</span>
            <span>Amount</span>
          </div>

          <div className="space-y-3 mb-8">
            {rows.map((row) => (
              <div key={row.id} className="flex items-center justify-between text-sm px-2">
                <span className="text-gray-300 font-mono truncate mr-4">{row.address}</span>
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 tracking-widest">{row.amount}</span>
                  <MoreHorizontal className="w-4 h-4 text-gray-600" />
                </div>
              </div>
            ))}
          </div>

          <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3.5 rounded-xl transition-colors shadow-[0_0_20px_rgba(245,197,24,0.3)]">
            Execute Airdrop
          </button>
        </div>
      </div>

    </section>
  );
}
