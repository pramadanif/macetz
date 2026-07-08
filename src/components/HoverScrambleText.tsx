"use client";

import React, { useState, useCallback, useRef } from "react";

const SCRAMBLE_CHARSET = "ABCDEF0123456789#%&*+=<>";

function randomChar() {
  return SCRAMBLE_CHARSET[Math.floor(Math.random() * SCRAMBLE_CHARSET.length)] ?? "#";
}

function preserve(char: string) {
  return char === " " || /[.,!?;:'"()\-–—]/.test(char);
}

function buildDisplay(target: string, locked: number) {
  return target
    .split("")
    .map((char, index) => {
      if (index < locked) return char;
      if (preserve(char)) return char;
      return randomChar();
    })
    .join("");
}

export function HoverScrambleText({ text, className = "" }: { text: string; className?: string }) {
  const [display, setDisplay] = useState(text);
  const [lockedCount, setLockedCount] = useState(text.length);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const startScramble = useCallback(() => {
    setIsTransitioning(true);
    setLockedCount(0);
    
    let locked = 0;
    if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);

    const scrambleInterval = window.setInterval(() => {
      setDisplay(buildDisplay(text, locked));
    }, 60);
    intervalRef.current = scrambleInterval;

    const lockStep = () => {
      while (locked < text.length && preserve(text[locked]!)) {
        locked += 1;
      }
      if (locked < text.length) {
        locked += 1;
      }
      setLockedCount(locked);
      setDisplay(buildDisplay(text, locked));

      if (locked >= text.length) {
        if (intervalRef.current !== null) {
          window.clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setDisplay(text);
        setIsTransitioning(false);
        return;
      }
      timeoutRef.current = window.setTimeout(lockStep, 45);
    };
    
    timeoutRef.current = window.setTimeout(lockStep, 45);
  }, [text]);

  const stopScramble = useCallback(() => {
    if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    setDisplay(text);
    setIsTransitioning(false);
    setLockedCount(text.length);
  }, [text]);

  return (
    <span 
      className={className} 
      onMouseEnter={startScramble} 
      onMouseLeave={stopScramble}
    >
      {display.split("").map((char, index) => {
        const scrambling = isTransitioning && index >= lockedCount && !preserve(char);
        return (
          <span
            key={index}
            className={scrambling ? "" : ""}
          >
            {char}
          </span>
        );
      })}
    </span>
  );
}
