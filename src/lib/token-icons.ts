/**
 * Token icon resolution — presentation-only utility.
 * No contract calls, no chain interaction.
 *
 * Known tokens get real logos via CDN.
 * Everything else gets a deterministic monogram derived from symbol.
 */

const COINGECKO_CDN = "https://assets.coingecko.com/coins/images";

export const KNOWN_TOKEN_ICONS: Record<string, string> = {
  USDC: "/icons/usdc.svg",
  USDCMock: "/icons/usdc.svg",
  cUSDC: "/icons/usdc.svg",
  cUSDCMock: "/icons/usdc.svg",

  USDT: "/icons/usdt.svg",
  USDTMock: "/icons/usdt.svg",
  cUSDT: "/icons/usdt.svg",
  cUSDTMock: "/icons/usdt.svg",

  WETH: "/icons/weth.svg",
  WETHMock: "/icons/weth.svg",
  cWETH: "/icons/weth.svg",
  cWETHMock: "/icons/weth.svg",

  XAUt: "/icons/xaut.svg",
  XAUtMock: "/icons/xaut.svg",
  cXAUt: "/icons/xaut.svg",
  cXAUtMock: "/icons/xaut.svg",

  ZAMA: "/icons/zama.svg",
  ZAMAMock: "/icons/zama.svg",
  cZAMA: "/icons/zama.svg",
  cZAMAMock: "/icons/zama.svg",

  BRON: "/icons/bron-bron-coin-logo.webp",
  BRONMock: "/icons/bron-bron-coin-logo.webp",
  cBRON: "/icons/bron-bron-coin-logo.webp",
  cBRONMock: "/icons/bron-bron-coin-logo.webp",

  tGBP: "/icons/tgbp.svg",
  tGBPMock: "/icons/tgbp.svg",
  ctGBP: "/icons/tgbp.svg",
  ctGBPMock: "/icons/tgbp.svg",

  steakcUSDC: "/icons/steakcusdc.svg",
  csteakcUSDC: "/icons/steakcusdc.svg",
};

export const CURRENCY_SYMBOL_MAP: Record<string, string> = {
  tGBP: "\u00A3",
  tGBPMock: "\u00A3",
  ctGBP: "\u00A3",
  ctGBPMock: "\u00A3",
};

function hashSymbol(symbol: string): number {
  let hash = 0;
  for (let i = 0; i < symbol.length; i++) {
    hash = (hash * 31 + symbol.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

const MONOGRAM_COLORS = [
  ["#6366f1", "#818cf8"],
  ["#8b5cf6", "#a78bfa"],
  ["#ec4899", "#f472b6"],
  ["#ef4444", "#f87171"],
  ["#f97316", "#fb923c"],
  ["#eab308", "#facc15"],
  ["#22c55e", "#4ade80"],
  ["#14b8a6", "#2dd4bf"],
  ["#0ea5e9", "#38bdf8"],
  ["#6366f1", "#a78bfa"],
];

export function getMonogramColor(symbol: string): [string, string] {
  const idx = hashSymbol(symbol) % MONOGRAM_COLORS.length;
  return MONOGRAM_COLORS[idx] as [string, string];
}

/**
 * On-chain token symbols aren't always clean — some contracts embed the
 * "Mock" marker as literal text like "csteakcUSDC (Mock)" instead of the
 * "csteakcUSDCMock" suffix convention. Strip both forms + surrounding
 * whitespace so icon/monogram lookups aren't tripped up by formatting.
 */
function stripMockMarker(symbol: string): string {
  return symbol
    .replace(/\s*\(mock\)\s*$/i, "")
    .replace(/mock$/i, "")
    .trim();
}

export function getMonogramText(symbol: string): string {
  const currency = CURRENCY_SYMBOL_MAP[symbol] ?? CURRENCY_SYMBOL_MAP[stripMockMarker(symbol)];
  if (currency) return currency;

  const clean = stripMockMarker(symbol).replace(/^c/i, "");
  return clean.slice(0, 2).toUpperCase();
}

export function resolveTokenIcon(
  symbol: string,
  iconUrl?: string
): { type: "url"; url: string } | { type: "monogram"; text: string; colors: [string, string] } {
  if (iconUrl) {
    return { type: "url", url: iconUrl };
  }

  const knownUrl = KNOWN_TOKEN_ICONS[symbol] ?? KNOWN_TOKEN_ICONS[stripMockMarker(symbol)];
  if (knownUrl) {
    return { type: "url", url: knownUrl };
  }

  return {
    type: "monogram",
    text: getMonogramText(symbol),
    colors: getMonogramColor(symbol),
  };
}
