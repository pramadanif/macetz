"use client";

import React, { useEffect, useState } from "react";

const SCRAMBLE_CHARS = "0123456789abcdefABCDEF";

function scrambleValue(text: string, revealRatio: number) {
  return text
    .split("")
    .map((char, index) => {
      if (char === " " || char === "x" || char === "0" || char === "." || char === ":") {
        return char;
      }

      const revealIndex = Math.floor(revealRatio * text.length);
      if (index < revealIndex) {
        return char;
      }

      return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
    })
    .join("");
}

interface EncryptedTextProps {
  text: string;
  className?: string;
  intervalMs?: number;
}

export function EncryptedText({
  text,
  className = "",
  intervalMs = 55,
}: EncryptedTextProps) {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    let tick = 0;

    const timer = window.setInterval(() => {
      tick += 1;
      const cycle = tick % 70;
      const revealRatio = cycle < 45 ? cycle / 45 : 1;
      setDisplay(scrambleValue(text, revealRatio));
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [text, intervalMs]);

  return <span className={className}>{display}</span>;
}
