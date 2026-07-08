import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

// Pure-logic test suite for the lib layer — no DOM, no live network.
// Tests import the REAL src/lib modules so they exercise production code paths.
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    reporters: ["default"],
  },
});
