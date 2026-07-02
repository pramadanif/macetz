import React from 'react';

export function DeveloperSection() {
  return (
    <section className="px-4 py-20 max-w-7xl mx-auto flex flex-col items-center text-center">
      <div className="text-sm font-semibold text-gray-500 mb-8 tracking-wide">
        Developer / Open Source
      </div>

      {/* Code Editor Panel */}
      <div className="w-full max-w-3xl mb-12 relative group perspective-[1000px]">
        {/* Glow behind */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-blue-500/10 blur-[60px] rounded-full pointer-events-none transition-opacity duration-500 group-hover:opacity-100 opacity-50" />
        
        <div className="dark-panel rounded-2xl overflow-hidden shadow-2xl text-left relative z-10 transform-gpu transition-transform duration-500 group-hover:rotate-x-[2deg] group-hover:-translate-y-1">
          
          {/* Header */}
          <div className="bg-white/5 border-b border-white/10 px-4 py-3 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
            </div>
            <div className="flex-1 text-center text-xs font-mono text-gray-400">Terminal</div>
          </div>

          {/* Code Body */}
          <div className="p-6 lg:p-8 overflow-x-auto text-sm lg:text-base font-mono leading-relaxed hide-scrollbar">
            <pre>
              <code className="text-gray-300">
                <span className="text-pink-500">import</span> {'{'} tokenOps {'}'} <span className="text-pink-500">from</span> <span className="text-green-400">'@/sdk'</span>;<br/><br/>
                <span className="text-blue-400">function</span> <span className="text-yellow-200">createEncryptedShield</span>() {'{'}<br/>
                {'  '}<span className="text-pink-500">return</span> tokenOps.encryption.<span className="text-blue-300">encryptedFrom</span>(...);<br/>
                {'}'}
              </code>
            </pre>
          </div>
        </div>
      </div>

      <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-4">
        Built for Builders.
      </h2>
      <p className="text-gray-400 text-sm mb-6">
        Inter (Regular 400, 500, Medium 500).
      </p>
      
      <button className="glass-pill px-5 py-2.5 text-sm font-medium text-gray-800 hover:text-black transition-colors inline-block">
        GitHub Repository →
      </button>
    </section>
  );
}
