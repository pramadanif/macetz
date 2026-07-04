"use client";

import React from "react";
import { motion } from "motion/react";
import { EncryptedText } from "./EncryptedText";

interface Field {
  label: string;
  value: string;
}

interface FloatingEncryptedCardProps {
  title: string;
  fields: Field[];
  className?: string;
  delay?: number;
  size?: "md" | "lg";
}

export function FloatingEncryptedCard({
  title,
  fields,
  className = "",
  delay = 0,
  size = "md",
}: FloatingEncryptedCardProps) {
  const isLarge = size === "lg";

  return (
    <motion.div
      className={`absolute z-20 pointer-events-none ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: [0, -12, 0],
      }}
      transition={{
        opacity: { duration: 1, delay, ease: "easeOut" },
        y: { duration: 8, repeat: Infinity, ease: "easeInOut", delay },
      }}
    >
      <div
        className={`bg-white/70 backdrop-blur-2xl border border-white shadow-[0_16px_40px_-12px_rgba(0,0,0,0.1)] rounded-[20px] overflow-hidden relative ${
          isLarge
            ? "px-5 py-4 min-w-[210px]"
            : "px-4 py-3 min-w-[170px]"
        }`}
      >
        {/* Subtle inner highlight */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.8)] animate-pulse" />
            <p
              className={`font-semibold uppercase tracking-wider text-gray-800/70 ${
                isLarge ? "text-[10px]" : "text-[9px]"
              }`}
            >
              {title}
            </p>
          </div>
          
          <div className="flex flex-col gap-2.5">
            {fields.map((field) => (
              <div key={`${field.label}-${field.value}`} className="flex flex-col gap-1.5">
                {field.label && (
                  <span
                    className={`text-gray-500/80 font-medium ${isLarge ? "text-[10px]" : "text-[9px]"}`}
                  >
                    {field.label}
                  </span>
                )}
                <div className="bg-[#F5F4F0]/80 rounded-lg px-2.5 py-2 border border-black/[0.04] shadow-inner">
                  <EncryptedText
                    text={field.value}
                    className={`font-mono text-gray-800 font-medium leading-none block truncate ${
                      isLarge ? "text-[11px]" : "text-[10px]"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
