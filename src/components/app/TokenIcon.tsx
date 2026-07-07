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
  const isConfidential = symbol.toLowerCase().startsWith("c");

  const renderContent = () => {
    if (resolved.type === "url" && !imgError) {
      return (
        <div className="rounded-full overflow-hidden w-full h-full">
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
        className="rounded-full w-full h-full flex items-center justify-center font-bold text-white shadow-sm"
        style={{
          fontSize,
          background: `linear-gradient(135deg, ${monogram.colors[0]}, ${monogram.colors[1]})`,
        }}
      >
        {monogram.text}
      </div>
    );
  };

  const shieldSize = Math.max(14, size * 0.4);

  return (
    <div
      className={`relative flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {renderContent()}
      {isConfidential && (
        <img
          src="/icons/shield.svg"
          alt="Confidential"
          className="absolute -bottom-1 -right-1 object-contain z-10 drop-shadow-sm"
          style={{ width: shieldSize, height: shieldSize }}
        />
      )}
    </div>
  );
}
