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
      initial={{ opacity: 0, y: 12 }}
      animate={{
        opacity: 1,
        y: [0, -5, 0],
      }}
      transition={{
        opacity: { duration: 0.6, delay },
        y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay },
      }}
    >
      <div
        className={`emboss-card rounded-2xl shadow-[0_16px_48px_rgba(17,24,39,0.12)] ${
          isLarge
            ? "px-3.5 py-3 min-w-[160px] max-w-[210px]"
            : "px-3 py-2.5 min-w-[148px] max-w-[196px]"
        }`}
      >
        <div className="relative z-10 space-y-1.5">
          <p
            className={`font-semibold uppercase tracking-[0.14em] text-gray-500 ${
              isLarge ? "text-[10px]" : "text-[9px]"
            }`}
          >
            {title}
          </p>
          {fields.map((field) => (
            <div key={`${field.label}-${field.value}`} className="space-y-0.5">
              {field.label ? (
                <span
                  className={`text-gray-400 block ${isLarge ? "text-[9px]" : "text-[8px]"}`}
                >
                  {field.label}
                </span>
              ) : null}
              <EncryptedText
                text={field.value}
                className={`font-telegraf text-gray-700 leading-tight block truncate ${
                  isLarge ? "text-[10px]" : "text-[9px]"
                }`}
              />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
