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
}

export function FloatingEncryptedCard({
  title,
  fields,
  className = "",
  delay = 0,
}: FloatingEncryptedCardProps) {
  return (
    <motion.div
      className={`absolute z-20 pointer-events-none ${className}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{
        opacity: 1,
        y: [0, -6, 0],
      }}
      transition={{
        opacity: { duration: 0.6, delay },
        y: { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay },
      }}
    >
      <div className="emboss-card rounded-2xl px-3 py-2.5 shadow-[0_12px_40px_rgba(17,24,39,0.1)] min-w-[148px] max-w-[196px]">
        <div className="relative z-10 space-y-1.5">
          <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-gray-500">
            {title}
          </p>
          {fields.map((field) => (
            <div key={`${field.label}-${field.value}`} className="space-y-0.5">
              {field.label ? (
                <span className="text-[8px] text-gray-400 block">{field.label}</span>
              ) : null}
              <EncryptedText
                text={field.value}
                className="text-[9px] font-mono text-gray-700 leading-tight block truncate"
              />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
