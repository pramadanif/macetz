/**
 * Browser-only preview pairs — stored per chainId in localStorage.
 * Never synced to the repo; judges use Admin UI or custom-pairs.json for permanent pairs.
 */

import type { CustomPairEntry } from "./types";

const STORAGE_KEY = "macetz_preview_pairs";

type PreviewStore = Record<string, CustomPairEntry[]>;

function readStore(): PreviewStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as PreviewStore;
  } catch {
    return {};
  }
}

function writeStore(store: PreviewStore): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function loadPreviewPairs(chainId: number): CustomPairEntry[] {
  const store = readStore();
  return store[String(chainId)] ?? [];
}

export function addPreviewPair(chainId: number, entry: CustomPairEntry): void {
  const store = readStore();
  const key = String(chainId);
  const existing = store[key] ?? [];
  const deduped = existing.filter(
    (p) => p.erc7984.toLowerCase() !== entry.erc7984.toLowerCase()
  );
  store[key] = [...deduped, entry];
  writeStore(store);
}

export function buildConfigSnippet(
  chainId: number,
  entry: CustomPairEntry
): string {
  const payload = { [String(chainId)]: [entry] };
  return JSON.stringify(payload, null, 2);
}
