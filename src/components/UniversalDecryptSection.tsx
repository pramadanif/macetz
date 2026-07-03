import React from "react";
import { ArrowRight, Check } from "lucide-react";

const FEATURES = [
  "Auto-detects ERC-7984 tokens already in your wallet",
  "Paste-an-address flow for tokens outside the registry",
  "One signature, decrypted instantly via Zama's public relayer",
  "Your decrypted balance is never sent anywhere — it's computed client-side",
];

export function UniversalDecryptSection() {
  return (
    <section id="decrypt" className="px-4 py-20 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
      <div className="flex-1 text-center lg:text-left">
        <p className="text-xs font-semibold text-gray-500 tracking-[0.14em] uppercase mb-3">
          Decrypt Any Balance
        </p>
        <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-6 leading-[1.1]">
          Not just registry tokens.
          <br className="hidden lg:block" /> Any ERC-7984 token, anywhere.
        </h2>
        <p className="text-gray-500 font-medium text-sm lg:text-base mb-8 max-w-md mx-auto lg:mx-0 leading-relaxed">
          Paste any ERC-7984 contract address — registry-listed or not — and
          decrypt your own balance in one wallet signature via the EIP-712
          user-decryption flow. No relayer setup, no backend. It runs entirely in
          your browser.
        </p>
        <button className="glass-pill px-5 py-2.5 text-sm font-medium text-gray-800 hover:text-black transition-colors inline-flex items-center gap-1">
          Try Decrypting a Balance <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 w-full max-w-md">
        <div className="emboss-card rounded-[2rem] p-6 lg:p-8 space-y-4">
          {FEATURES.map((feature) => (
            <div key={feature} className="relative z-10 flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-yellow-400/20 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-yellow-600" strokeWidth={3} />
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{feature}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
