/**
 * Token icon resolution — presentation-only utility.
 * No contract calls, no chain interaction.
 *
 * Known tokens get real logos via CDN.
 * Everything else gets a deterministic monogram derived from symbol.
 */

const COINGECKO_CDN = "https://assets.coingecko.com/coins/images";

export const KNOWN_TOKEN_ICONS: Record<string, string> = {
  USDC: `${COINGECKO_CDN}/6319/small/usdc.png`,
  USDCMock: `${COINGECKO_CDN}/6319/small/usdc.png`,
  cUSDCMock: `${COINGECKO_CDN}/6319/small/usdc.png`,

  USDT: `${COINGECKO_CDN}/325/small/Tether.png`,
  USDTMock: `${COINGECKO_CDN}/325/small/Tether.png`,
  cUSDTMock: `${COINGECKO_CDN}/325/small/Tether.png`,

  WETH: `${COINGECKO_CDN}/2518/small/weth.png`,
  WETHMock: `${COINGECKO_CDN}/2518/small/weth.png`,
  cWETHMock: `${COINGECKO_CDN}/2518/small/weth.png`,

  XAUt: `${COINGECKO_CDN}/10481/small/Tether_Gold.png`,
  XAUtMock: `${COINGECKO_CDN}/10481/small/Tether_Gold.png`,
  cXAUtMock: `${COINGECKO_CDN}/10481/small/Tether_Gold.png`,

  ZAMA: "https://zama.ai/favicon.ico",
  ZAMAMock: "https://zama.ai/favicon.ico",
  cZAMAMock: "https://zama.ai/favicon.ico",
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

export function getMonogramText(symbol: string): string {
  const currency = CURRENCY_SYMBOL_MAP[symbol];
  if (currency) return currency;

  const clean = symbol.replace(/^c/i, "").replace(/Mock$/i, "");
  return clean.slice(0, 2).toUpperCase();
}

export function resolveTokenIcon(
  symbol: string,
  iconUrl?: string
): { type: "url"; url: string } | { type: "monogram"; text: string; colors: [string, string] } {
  if (iconUrl) {
    return { type: "url", url: iconUrl };
  }

  const knownUrl = KNOWN_TOKEN_ICONS[symbol];
  if (knownUrl) {
    return { type: "url", url: knownUrl };
  }

  return {
    type: "monogram",
    text: getMonogramText(symbol),
    colors: getMonogramColor(symbol),
  };
}
