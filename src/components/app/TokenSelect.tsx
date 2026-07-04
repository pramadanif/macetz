"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { TokenIcon } from "@/components/app/TokenIcon";

export interface TokenSelectOption {
  value: string;
  label: string;
  sublabel?: string;
  symbol: string;
}

interface TokenSelectProps {
  options: TokenSelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function TokenSelect({ options, value, onChange, placeholder = "Choose a token..." }: TokenSelectProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

  const selected = options.find((o) => o.value === value);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPos({
      top: rect.bottom + 8,
      left: rect.left,
      width: rect.width,
    });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      const target = e.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      ) return;
      setOpen(false);
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open]);

  const dropdown = mounted ? createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="fixed z-[200]"
          style={{ top: pos.top, left: pos.left, width: pos.width }}
        >
          <div className="bg-white/70 backdrop-blur-2xl rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.15)] shadow-inset-light border border-white/80 max-h-[320px] overflow-y-auto overscroll-contain p-1.5 flex flex-col gap-0.5">
            {options.length === 0 && (
              <div className="px-4 py-6 text-sm text-gray-500 text-center font-medium">No tokens available</div>
            )}
            {options.map((option) => {
              const isActive = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`w-full px-3 py-2.5 flex items-center gap-3 text-left transition-all duration-200 rounded-xl ${
                    isActive
                      ? "bg-white shadow-[0_4px_12px_rgba(0,0,0,0.04)] border border-black/5 scale-[1.01] z-10"
                      : "hover:bg-white/50 hover:scale-[1.01] border border-transparent"
                  }`}
                >
                  <div className={`p-1 rounded-full ${isActive ? 'bg-[#F5F4F0] shadow-inset-light' : 'bg-white shadow-sm border border-black/5'}`}>
                    <TokenIcon symbol={option.symbol} size={26} />
                  </div>
                  <span className="flex flex-col min-w-0 flex-1">
                    <span className={`text-sm font-semibold truncate transition-colors ${isActive ? "text-[#16171C]" : "text-gray-700 group-hover:text-black"}`}>
                      {option.label}
                    </span>
                    {option.sublabel && (
                      <span className={`text-[11px] truncate ${isActive ? "text-gray-500" : "text-gray-400"}`}>{option.sublabel}</span>
                    )}
                  </span>
                  {isActive && (
                    <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className="shrink-0 bg-green-100 text-green-700 p-1 rounded-full shadow-inset-light">
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3.5 8.5l3 3 6-6" />
                      </svg>
                    </motion.div>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  ) : null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full liquid-glass-field rounded-xl px-4 py-3 text-sm text-left flex items-center justify-between gap-3 focus:outline-none transition-all ${
          open ? "ring-2 ring-[#F5C518]/40" : ""
        }`}
      >
        {selected ? (
          <span className="flex items-center gap-3 min-w-0">
            <TokenIcon symbol={selected.symbol} size={28} />
            <span className="flex flex-col min-w-0">
              <span className="font-medium text-[#16171C] truncate">{selected.label}</span>
              {selected.sublabel && (
                <span className="text-[11px] text-gray-400 truncate">{selected.sublabel}</span>
              )}
            </span>
          </span>
        ) : (
          <span className="text-gray-400">{placeholder}</span>
        )}
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-gray-400 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path d="M4 6l4 4 4-4" />
        </svg>
      </button>
      {dropdown}
    </>
  );
}
