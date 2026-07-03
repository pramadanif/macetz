import React from "react";
import { ArrowRight, Layers, LayoutGrid, Target } from "lucide-react";
import { CoinPlaceholder } from "./CoinPlaceholder";

export function HowItWorks() {
  const steps = [
    {
      id: 1,
      title: "1. Wrap Assets",
      desc: "Convert any registry ERC-20 into its confidential ERC-7984 equivalent.",
      icon: <Layers className="w-5 h-5" />,
      coin: "silver",
    },
    {
      id: 2,
      title: "2. Define Allocations",
      desc: "Set encrypted distribution amounts for your recipients.",
      icon: <LayoutGrid className="w-5 h-5" />,
      coin: "silver",
    },
    {
      id: 3,
      title: "3. Execute Encrypted Payload",
      desc: "Send it. Amounts stay encrypted onchain; only recipients decrypt their own.",
      icon: <Target className="w-5 h-5" />,
      coin: "gold",
    },
  ];

  return (
    <section className="px-4 py-20 max-w-7xl mx-auto flex flex-col items-center">
      <div className="text-center mb-12 lg:mb-16">
        <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 mb-6">
          End-to-End Confidentiality in 3 Steps
        </h2>
        <button className="glass-pill px-4 py-2 text-sm font-medium text-gray-700 hover:text-black transition-colors inline-flex items-center gap-1">
          Explore Registry <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 md:gap-6 lg:gap-8 w-full">
        {steps.map((step) => (
          <div
            key={step.id}
            className="emboss-card rounded-2xl lg:rounded-[2rem] p-4 lg:p-8 flex flex-col items-center text-center relative group"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100px] h-[100px] bg-yellow-400/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="mb-4 lg:mb-8 relative z-10">
              <CoinPlaceholder
                type={step.coin as "silver" | "gold"}
                size="md"
                icon={step.icon}
                className="lg:w-20 lg:h-20"
              />
            </div>

            <h3 className="font-bold text-gray-900 text-xs sm:text-sm lg:text-xl mb-2 lg:mb-3 leading-tight relative z-10">
              {step.title}
            </h3>

            <p className="hidden lg:block text-gray-500 text-sm leading-relaxed relative z-10">
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
