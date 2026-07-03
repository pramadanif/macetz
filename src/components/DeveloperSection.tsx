import React from "react";
import { ArrowRight } from "lucide-react";

export function DeveloperSection() {
  return (
    <section id="docs" className="px-4 py-20 max-w-7xl mx-auto flex flex-col items-center text-center">
      <div className="text-sm font-semibold text-gray-500 mb-8 tracking-wide">
        Developer / Open Source
      </div>

      <div className="w-full max-w-3xl mb-12 relative group perspective-[1000px]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-blue-500/10 blur-[60px] rounded-full pointer-events-none transition-opacity duration-500 group-hover:opacity-100 opacity-50" />

        <div className="dark-panel rounded-2xl overflow-hidden shadow-2xl text-left relative z-10 transform-gpu transition-transform duration-500 group-hover:rotate-x-[2deg] group-hover:-translate-y-1">
          <div className="bg-white/5 border-b border-white/10 px-4 py-3 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
            </div>
            <div className="flex-1 text-center text-xs font-mono text-gray-400">
              sdk.ts
            </div>
          </div>

          <div className="p-6 lg:p-8 overflow-x-auto text-sm lg:text-base font-mono leading-relaxed hide-scrollbar">
            <pre>
              <code className="text-gray-300">
                <span className="text-pink-500">import</span> {"{ registry, tokenOps }"}{" "}
                <span className="text-pink-500">from</span>{" "}
                <span className="text-green-400">&apos;@macetz/sdk&apos;</span>
                <br />
                <br />
                <span className="text-gray-500">// Wrap a registry-sourced ERC-20 into ERC-7984</span>
                <br />
                <span className="text-blue-400">const</span> wrapped ={" "}
                <span className="text-pink-500">await</span> registry.
                <span className="text-yellow-200">wrap</span>(token, amount)
                <br />
                <br />
                <span className="text-gray-500">// Distribute confidentially via TokenOps</span>
                <br />
                <span className="text-pink-500">await</span> tokenOps.
                <span className="text-yellow-200">distribute</span>({"{"}
                <br />
                {"  "}token: wrapped,
                <br />
                {"  "}recipients: encryptedList,
                <br />
                {"}"})
              </code>
            </pre>
          </div>
        </div>
      </div>

      <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-4">
        Built for Builders.
      </h2>
      <p className="text-gray-500 text-sm mb-6 max-w-xl leading-relaxed">
        Fully open source. Registry reading, wrap/unwrap logic, EIP-712
        decryption, and the TokenOps distribution flow — all documented, all
        extensible. Fork it, self-host it, or add your own pairs in minutes.
      </p>

      <button className="glass-pill px-5 py-2.5 text-sm font-medium text-gray-800 hover:text-black transition-colors inline-flex items-center gap-1">
        GitHub Repository <ArrowRight className="w-4 h-4" />
      </button>
    </section>
  );
}
