import { describe, it, expect } from "vitest";
import { formatWalletError } from "@/lib/errors";
import { MAINNET_CHAIN_ID, SEPOLIA_CHAIN_ID } from "@/lib/config";

// Wallet errors must be human-readable AND network-aware: never tell a mainnet
// user to "switch to Sepolia", and reference the right native gas token.
describe("formatWalletError", () => {
  it("maps a user rejection to a friendly message", () => {
    expect(formatWalletError(new Error("User rejected the request"))).toMatch(/rejected/i);
  });

  it("gives chain-correct gas guidance", () => {
    const mainnet = formatWalletError(new Error("out of gas"), MAINNET_CHAIN_ID);
    expect(mainnet).toContain("ETH");
    expect(mainnet).not.toContain("Sepolia");

    const sepolia = formatWalletError(new Error("out of gas"), SEPOLIA_CHAIN_ID);
    expect(sepolia).toContain("Sepolia ETH");
  });

  it("never tells a mainnet user to switch to Sepolia on a wrong-network error", () => {
    const msg = formatWalletError(new Error("wrong network"), MAINNET_CHAIN_ID);
    expect(msg).toContain("Ethereum mainnet");
    expect(msg.toLowerCase()).not.toContain("sepolia");
  });

  it("returns a non-empty string for an unknown error", () => {
    const msg = formatWalletError({ weird: true });
    expect(typeof msg).toBe("string");
    expect(msg.length).toBeGreaterThan(0);
  });
});
