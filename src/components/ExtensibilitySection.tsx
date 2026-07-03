import React from "react";
import { ArrowRight } from "lucide-react";

export function ExtensibilitySection() {
  return (
    <section id="extensibility" className="px-4 py-20 max-w-7xl mx-auto">
      <div className="text-center mb-10 max-w-3xl mx-auto">
        <p className="text-xs font-semibold text-gray-500 tracking-[0.14em] uppercase mb-3">
          Extensibility
        </p>
        <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 mb-4">
          Adding a pair is a two-minute job, not a pull request review.
        </h2>
        <p className="text-gray-500 font-medium text-sm lg:text-base leading-relaxed">
          Macetz sources pairs as a hybrid: the official onchain Wrappers Registry
          is always the primary source of truth, and a local config file lets you
          declare custom or dev-only pairs on top of it — useful while a new pair
          is still pending official registration.
        </p>
      </div>

      <div className="dark-panel rounded-2xl overflow-hidden shadow-2xl max-w-3xl mx-auto text-left">
        <div className="bg-white/5 border-b border-white/10 px-4 py-3 text-xs font-mono text-gray-400">
          config/custom-pairs.json
        </div>
        <pre className="p-6 lg:p-8 overflow-x-auto text-sm font-mono leading-relaxed text-gray-300 hide-scrollbar">
          <code>{`{
  "pairs": [
    {
      "erc20": "0xYourTestToken...",
      "erc7984": "0xYourWrappedToken...",
      "symbol": "cXYZ",
      "decimals": 18,
      "source": "local-dev"
    }
  ]
}`}</code>
        </pre>
      </div>

      <p className="text-center text-gray-500 text-sm mt-6 max-w-2xl mx-auto">
        Restart the dev server — your pair shows up in the Registry, wrap/unwrap
        included, automatically flagged as &quot;Dev Pair&quot; so it&apos;s never
        confused with an official one.
      </p>

      <div className="text-center mt-6">
        <button className="glass-pill px-5 py-2.5 text-sm font-medium text-gray-800 hover:text-black transition-colors inline-flex items-center gap-1">
          Read the Full Extensibility Guide <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
