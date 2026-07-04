"use client";

import React, { useState } from "react";
import { resolveTokenIcon } from "@/lib/token-icons";

interface TokenIconProps {
  symbol: string;
  iconUrl?: string;
  size?: number;
  className?: string;
}

export function TokenIcon({ symbol, iconUrl, size = 32, className = "" }: TokenIconProps) {
  const resolved = resolveTokenIcon(symbol, iconUrl);
  const [imgError, setImgError] = useState(false);

  if (resolved.type === "url" && !imgError) {
    return (
      <div
        className={`rounded-full overflow-hidden flex-shrink-0 ${className}`}
        style={{ width: size, height: size }}
      >
        <img
          src={resolved.url}
          alt={symbol}
          width={size}
          height={size}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
          loading="lazy"
        />
      </div>
    );
  }

  const monogram = resolved.type === "monogram"
    ? resolved
    : {
        text: symbol.slice(0, 2).toUpperCase(),
        colors: ["#6366f1", "#818cf8"] as [string, string],
      };

  const fontSize = size < 28 ? 10 : size < 40 ? 12 : 14;

  return (
    <div
      className={`rounded-full flex-shrink-0 flex items-center justify-center font-bold text-white shadow-sm ${className}`}
      style={{
        width: size,
        height: size,
        fontSize,
        background: `linear-gradient(135deg, ${monogram.colors[0]}, ${monogram.colors[1]})`,
      }}
    >
      {monogram.text}
    </div>
  );
}
