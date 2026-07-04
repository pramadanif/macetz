import React from "react";
import { Upload, MoreHorizontal } from "lucide-react";
import { ArrowRight } from "lucide-react";

export function ConfidentialDistribution() {
  const rows = [
    { id: 1, address: "0xet65555555553b45564f3...", status: "Claimed" },
    { id: 2, address: "0x990600000000304669036...", status: "Pending" },
    { id: 3, address: "0x560f4C02c55B53d09229...", status: "Pending" },
  ];

  return (
    <section id="distribute" className="px-4 py-20 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
      <div className="flex-1 text-center lg:text-left">
        <div className="text-xs font-semibold text-gray-500 mb-3 tracking-[0.14em] uppercase">
          Confidential Distribution · Powered by TokenOps SDK
        </div>
        <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-6 leading-[1.1]">
          Distribute to hundreds.
          <br className="hidden lg:block" /> Reveal to none.
        </h2>
        <p className="text-gray-500 font-medium text-sm lg:text-base mb-8 max-w-md mx-auto lg:mx-0 leading-relaxed">
          Payroll, airdrops, and investor distributions all share the same
          problem onchain: everyone can see who got paid and how much. Macetz&apos;s
          distribution layer, built on the TokenOps SDK, keeps amounts and
          recipient lists encrypted end-to-end — while every recipient can
          independently verify and decrypt exactly their own allocation, in one
          click.
        </p>
        <button className="glass-pill px-5 py-2.5 text-sm font-medium text-gray-800 hover:text-black transition-colors inline-flex items-center gap-1">
          Try Confidential Distribution <ArrowRight className="w-4 h-4" />
        </button>
        <p className="text-xs text-gray-400 mt-4 max-w-md mx-auto lg:mx-0">
          No plaintext amounts. No public recipient list. Just a provable total
          and private claims.
        </p>
      </div>

      <div className="flex-1 w-full max-w-md lg:max-w-none">
        <div className="dark-panel rounded-[2rem] p-6 lg:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-yellow-400/10 blur-[80px] rounded-full pointer-events-none" />

          <div className="relative z-10 text-sm font-semibold text-gray-300 mb-4">
            Distribution Setup
          </div>

          <div className="liquid-glass-field rounded-2xl p-4 mb-6 text-center border-dashed border border-white/40 flex flex-col items-center justify-center gap-2 h-32 relative z-10">
            <Upload className="w-6 h-6 text-gray-400" />
            <span className="text-sm text-gray-400 font-medium">
              Drop CSV or paste addresses
            </span>
          </div>

          <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-4 px-2 uppercase tracking-wider relative z-10">
            <span>Recipient</span>
            <span>Amount</span>
            <span>Status</span>
          </div>

          <div className="space-y-3 mb-8 relative z-10">
            {rows.map((row) => (
              <div
                key={row.id}
                className="flex items-center justify-between text-sm px-2"
              >
                <span className="text-gray-300 font-telegraf truncate mr-4 flex-1">
                  {row.address}
                </span>
                <span className="text-gray-400 tracking-widest mr-3">***</span>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    row.status === "Claimed"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-gray-500/20 text-gray-400"
                  }`}
                >
                  {row.status}
                </span>
                <MoreHorizontal className="w-4 h-4 text-gray-600 ml-2 shrink-0" />
              </div>
            ))}
          </div>

          <button className="relative z-10 w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3.5 rounded-xl transition-colors shadow-[0_0_20px_rgba(245,197,24,0.3)]">
            Execute Confidential Airdrop
          </button>
        </div>
      </div>
    </section>
  );
}
