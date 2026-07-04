"use client";

import React, { useEffect, useRef, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { CoinPlaceholder } from "./CoinPlaceholder";

const NAV_LINKS = [
  { label: "Registry", href: "#registry" },
  { label: "Extensibility", href: "#extensibility" },
  { label: "Decrypt", href: "#decrypt" },
  { label: "Distribute", href: "#distribute" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const headerRef = useRef<HTMLElement>(null);

  // Detect scroll to add background blur effect and scroll spy
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      
      // Scroll Spy Logic
      const sections = NAV_LINKS.map(link => link.href.substring(1));
      let current = "";
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Check if element is in the upper part of the viewport
          if (rect.top <= 250 && rect.bottom >= 250) {
            current = section;
            break;
          }
        }
      }
      setActiveSection(current);
    };
    
    window.addEventListener("scroll", handleScroll);
    // Initial check
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 inset-x-0 z-50 flex justify-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        scrolled ? "pt-4" : "pt-6 sm:pt-8"
      } px-4`}
    >
      {/* Floating Pill Container */}
      <div
        className={`relative w-full max-w-5xl flex items-center justify-between transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-visible ${
          scrolled
            ? "h-[64px] px-4 sm:px-6 bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.06)] rounded-[32px]"
            : "h-[68px] px-2 sm:px-4 bg-transparent border border-transparent rounded-[32px]"
        }`}
      >
        {/* Brand */}
        <a href="/" className="flex items-center gap-2.5 shrink-0 group z-10 pl-2">
          <div className="relative">
            <CoinPlaceholder 
              type="silver" 
              size="sm" 
              className="w-8 h-8 transition-transform duration-500 group-hover:rotate-[15deg] group-hover:scale-110 shadow-sm" 
            />
          </div>
          <span className="font-bold text-[22px] tracking-tight text-[#16171C]">
            Macetz
          </span>
        </a>

        {/* Desktop Nav Links (Centered) */}
        <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-1.5 p-1.5 bg-white/50 backdrop-blur-md rounded-full border border-white/60 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.href.substring(1);
            return (
              <a
                key={link.label}
                href={link.href}
                className={`px-5 py-2 rounded-full text-[14px] font-medium transition-all duration-300 ${
                  isActive 
                    ? 'bg-black text-white shadow-md' 
                    : 'text-gray-600 hover:text-black hover:bg-white/80'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 z-10">
          <button className="hidden sm:flex items-center gap-2 bg-[#16171C] hover:bg-black text-white font-medium text-[14px] px-6 py-2.5 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-black/10 hover:-translate-y-0.5">
            Connect
            <ArrowUpRight className="w-4 h-4 opacity-70" />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
            className="md:hidden flex items-center justify-center w-11 h-11 rounded-full bg-white/80 border border-white/60 shadow-sm hover:bg-white transition-colors"
          >
            {menuOpen ? (
              <X className="w-5 h-5 text-gray-800" strokeWidth={2.25} />
            ) : (
              <Menu className="w-5 h-5 text-gray-800" strokeWidth={2.25} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`absolute top-[calc(100%+16px)] left-4 right-4 md:hidden transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] transform origin-top ${
          menuOpen 
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" 
            : "opacity-0 scale-95 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="bg-white/90 backdrop-blur-2xl border border-white/60 shadow-[0_24px_48px_rgba(0,0,0,0.1)] rounded-[32px] p-4 flex flex-col gap-2">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.href.substring(1);
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center justify-between px-6 py-4 rounded-2xl text-[15px] font-medium transition-colors ${
                  isActive ? 'bg-black/5 text-black' : 'text-gray-800 hover:bg-black/5'
                }`}
              >
                {link.label}
                <ArrowUpRight className="w-4 h-4 opacity-30" />
              </a>
            );
          })}
          <div className="h-px w-full bg-black/5 my-2" />
          <button
            type="button"
            className="w-full bg-[#16171C] text-white font-medium text-[15px] px-6 py-4 rounded-2xl transition-all duration-300 hover:bg-black flex justify-center items-center gap-2"
          >
            Connect Wallet
            <ArrowUpRight className="w-4 h-4 opacity-70" />
          </button>
        </div>
      </div>
    </header>
  );
}
