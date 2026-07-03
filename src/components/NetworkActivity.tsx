import React from "react";

const STATS = [
  { value: "18,578", label: "TVS" },
  { value: "24.63", label: "Tokens Wrapped" },
  { value: "434", label: "Encrypted Distributions" },
  { value: "43.37k", label: "Active Addresses" },
];

export function NetworkActivity() {
  return (
    <section className="px-4 py-12 lg:py-24 max-w-7xl mx-auto w-full">
      <div className="dark-panel lg:bg-none lg:border-none lg:!bg-transparent rounded-3xl p-6 md:p-8 lg:p-0 relative overflow-hidden lg:overflow-visible">
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-20 bg-yellow-400/20 blur-2xl rounded-full pointer-events-none lg:hidden" />

        <div className="mb-8 lg:mb-12">
          <div className="lg:hidden inline-block bg-yellow-400/10 text-yellow-500 border border-yellow-500/20 text-xs font-semibold px-2 py-1 rounded-md mb-4">
            Primary Activity
          </div>
          <div className="hidden lg:block text-sm font-semibold text-gray-500 mb-2">
            Primary Activity
          </div>

          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white lg:text-gray-900 tracking-tight">
            Network Activity
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-4 lg:gap-8">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col">
              <div className="hidden lg:block text-sm font-medium text-gray-500 mb-2">
                {stat.label}
              </div>
              <div className="text-2xl md:text-3xl lg:text-5xl font-bold text-white lg:text-gray-900 font-mono tracking-tighter mb-1">
                {stat.value}
              </div>
              <div className="text-xs text-gray-400 lg:hidden">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
