import React from "react";

const LIMITATIONS = [
  "Currently deployed and tested on Sepolia testnet only. Mainnet support is architecturally ready but not yet audited.",
  'The Registry hybrid-sourcing model prioritizes the onchain Wrappers Registry; local config pairs are clearly labeled "Dev Pair" and excluded from production stats.',
  "Distribution via TokenOps SDK currently supports a single token per distribution batch — multi-token batches are on the roadmap.",
  "This is an unaudited community project, built for the Zama Developer Program. Use at your own risk; do not use with real funds beyond testnet.",
];

export function KnownLimitations() {
  return (
    <section className="px-4 py-20 max-w-3xl mx-auto">
      <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 mb-8 text-center">
        Known Limitations
      </h2>
      <ul className="space-y-4">
        {LIMITATIONS.map((item) => (
          <li
            key={item}
            className="emboss-card rounded-2xl px-5 py-4 text-sm text-gray-600 leading-relaxed relative"
          >
            <span className="relative z-10">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
