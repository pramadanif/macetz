import React from "react";

export function DeveloperSection() {
  return (
    <section className="relative w-full py-32 bg-[#050505] flex flex-col items-center justify-center overflow-hidden">
      {/* Lens flare / Aurora effects in background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        {/* Top left yellowish glow */}
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-[#F7D08A]/10 rounded-full blur-[120px]" />
        {/* Subtle rainbow streak approximation using rotated gradients */}
        <div className="absolute top-[10%] left-[-10%] w-[60%] h-[200px] bg-gradient-to-br from-transparent via-[#F7D08A]/10 to-transparent rotate-[30deg] blur-2xl mix-blend-screen" />
        <div className="absolute top-[15%] left-[-5%] w-[50%] h-[150px] bg-gradient-to-br from-transparent via-[#E99757]/10 to-transparent rotate-[35deg] blur-2xl mix-blend-screen" />
      </div>

      <div className="relative z-10 max-w-5xl w-full px-6 flex flex-col items-center text-center">
        {/* Title */}
        <h2 className="text-4xl md:text-5xl lg:text-[64px] font-normal tracking-[-0.03em] mb-6 leading-[1.1]">
          <span className="text-white">Build </span>
          <span className="bg-gradient-to-r from-[#F9D48D] via-[#F1AC71] to-[#E99757] bg-clip-text text-transparent">
            confidential onchain
            <br />
            finance.
          </span>
          <br />
          <span className="text-white">
            The hard cryptography is
            <br />
            already done.
          </span>
        </h2>

        {/* Subtitle */}
        <p className="text-[#A1A1AA] text-sm md:text-base max-w-lg leading-relaxed mb-16">
          Deploy confidential smart contracts without learning a<br className="hidden md:block" />
          new language or touching complex cryptography.
        </p>

        {/* Code Editor */}
        <div className="w-full max-w-[800px] rounded-xl bg-[#1C1C1C] border border-[#2A2A2A] shadow-2xl overflow-hidden text-left font-mono">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A2A2A]">
            <span className="text-[13px] text-[#A1A1AA]">Confidential Token Standard</span>
            <a
              href="#"
              className="inline-flex items-center justify-center bg-[#FFD600] text-black text-xs font-bold px-3 py-1.5 rounded hover:bg-[#FFD600]/90 transition-colors"
            >
              Docs ↗
            </a>
          </div>

          {/* Code */}
          <div className="px-6 py-6 overflow-x-auto">
            <div className="flex text-[13px] leading-[1.6]">
              {/* Line Numbers */}
              <div className="flex flex-col text-right pr-6 text-[#555555] select-none shrink-0">
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
                <span>6</span>
                <span>7</span>
                <span>8</span>
                <span>9</span>
                <span>10</span>
                <span>11</span>
                <span>12</span>
              </div>
              
              {/* Code Content */}
              <div className="flex flex-col whitespace-pre">
                {/* Line 1 */}
                <span><span className="text-[#6B7280]">// SPDX-License-Identifier: BSD-3-Clause-Clear</span></span>
                {/* Line 2 */}
                <span><span className="text-[#A1A1AA]">pragma solidity</span> <span className="text-[#EAB308]">^0.8.27</span>;</span>
                {/* Line 3 */}
                <span></span>
                {/* Line 4 */}
                <span><span className="text-[#A1A1AA]">import</span> {"{FHE}"} <span className="text-[#A1A1AA]">from</span> <span className="text-[#86EFAC]">"@fhevm/solidity/lib/FHE.sol"</span>;</span>
                {/* Line 5 */}
                <span><span className="text-[#A1A1AA]">import</span> {"{ZamaEthereumConfig}"} <span className="text-[#A1A1AA]">from</span> <span className="text-[#86EFAC]">"@fhevm/solidity/config/ZamaConfig.sol"</span>;</span>
                {/* Line 6 */}
                <span><span className="text-[#A1A1AA]">import</span> {"{ERC7984}"} <span className="text-[#A1A1AA]">from</span> <span className="text-[#86EFAC]">"@openzeppelin/confidential-contracts/token/ERC7984/ERC7984.sol"</span>;</span>
                {/* Line 7 */}
                <span></span>
                {/* Line 8 */}
                <span><span className="text-[#A1A1AA]">contract</span> <span className="text-white">ConfidentialToken</span> <span className="text-[#A1A1AA]">is</span> <span className="text-white">ZamaEthereumConfig, ERC7984</span> {"{"}</span>
                {/* Line 9 */}
                <span>    <span className="text-[#22D3EE]">constructor</span>(<span className="text-[#F97316]">uint64</span> <span className="text-white">amount</span>) <span className="text-[#22D3EE]">ERC7984</span>(<span className="text-[#86EFAC]">"Confidential Token"</span>, <span className="text-[#86EFAC]">"cTOKEN"</span>, <span className="text-[#86EFAC]">""</span>) {"{"}</span>
                {/* Line 10 */}
                <span>        <span className="text-white">_mint(msg.sender, FHE.asEuint64(amount));</span></span>
                {/* Line 11 */}
                <span>    <span className="text-white">{"}"}</span></span>
                {/* Line 12 */}
                <span><span className="text-white">{"}"}</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
