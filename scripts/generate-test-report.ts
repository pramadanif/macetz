/**
 * Transforms the raw Vitest JSON output (.vitest-report.json) into the compact
 * summary the /test-report page renders (src/lib/test-report.json).
 *
 * Run indirectly via `npm run test:report`.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");

// Friendly category label per test file — keep in sync with tests/.
const LABELS: Record<string, string> = {
  "integrity.test.ts": "Registry Integrity Checks",
  "registry-merge.test.ts": "Registry Sourcing & Merge",
  "pair-gating.test.ts": "Operational Pair Gating",
  "errors.test.ts": "Chain-Aware Error Handling",
  "token-icons.test.ts": "Token Icon Resolution",
  "config-snippet.test.ts": "Add-a-Pair Config Snippet",
  "disperse-csv.test.ts": "Distribute CSV & Singleton",
};

interface RawAssertion {
  status: string;
}
interface RawFileResult {
  name: string;
  startTime: number;
  endTime: number;
  assertionResults: RawAssertion[];
}
interface RawReport {
  numTotalTests: number;
  numPassedTests: number;
  numFailedTests: number;
  success: boolean;
  testResults: RawFileResult[];
}

const raw = JSON.parse(
  readFileSync(join(root, ".vitest-report.json"), "utf8")
) as RawReport;

const categories = raw.testResults
  .map((file) => {
    const base = file.name.split("/").pop() ?? file.name;
    const passed = file.assertionResults.filter((a) => a.status === "passed").length;
    const failed = file.assertionResults.filter((a) => a.status === "failed").length;
    return {
      name: LABELS[base] ?? base.replace(/\.test\.ts$/, ""),
      file: `tests/${base}`,
      passed,
      failed,
      total: passed + failed,
      durationMs: Math.max(0, Math.round(file.endTime - file.startTime)),
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

const durationMs = categories.reduce((sum, c) => sum + c.durationMs, 0);

const summary = {
  generatedAt: new Date().toISOString(),
  total: raw.numTotalTests,
  passed: raw.numPassedTests,
  failed: raw.numFailedTests,
  success: raw.success,
  suiteCount: raw.testResults.length,
  durationMs,
  categories,
};

writeFileSync(
  join(root, "src/lib/test-report.json"),
  JSON.stringify(summary, null, 2) + "\n"
);

console.log(
  `test-report.json written — ${summary.passed}/${summary.total} passing across ${summary.suiteCount} suites`
);
