"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
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

  const dropdown = open && mounted ? createPortal(
    <div
      ref={dropdownRef}
      className="fixed z-[200]"
      style={{ top: pos.top, left: pos.left, width: pos.width }}
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200/80 max-h-[320px] overflow-y-auto overscroll-contain">
        {options.length === 0 && (
          <div className="px-4 py-3 text-sm text-gray-400">No tokens available</div>
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
              className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors duration-100 first:rounded-t-2xl last:rounded-b-2xl ${
                isActive
                  ? "bg-[#F5C518]/8"
                  : "hover:bg-gray-50"
              }`}
            >
              <TokenIcon symbol={option.symbol} size={32} />
              <span className="flex flex-col min-w-0 flex-1">
                <span className={`text-sm font-medium truncate ${isActive ? "text-[#16171C]" : "text-gray-700"}`}>
                  {option.label}
                </span>
                {option.sublabel && (
                  <span className="text-[11px] text-gray-400 truncate">{option.sublabel}</span>
                )}
              </span>
              {isActive && (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#F5C518" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <path d="M3.5 8.5l3 3 6-6" />
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </div>,
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
