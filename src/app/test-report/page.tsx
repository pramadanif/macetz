import type { Metadata } from "next";
import Link from "next/link";
import report from "@/lib/test-report.json";

export const metadata: Metadata = {
  title: "Test Report — automated suite results",
  description:
    "Live results of the Macetz automated test suite: registry sourcing, integrity checks, pair gating, error handling, icon resolution, and config validation.",
  alternates: { canonical: "/test-report" },
  robots: { index: true, follow: true },
};

// Server component — renders the committed summary produced by `npm run test:report`.
function formatUtc(iso: string): string {
  // Deterministic, locale-independent (server-rendered once; no hydration).
  return new Date(iso).toISOString().replace("T", " ").slice(0, 16) + " UTC";
}

export default function TestReportPage() {
  const allGreen = report.failed === 0;

  return (
    <main className="min-h-screen bg-[#F5F4F0] text-[#16171C] font-telegraf">
      <div className="max-w-3xl mx-auto px-6 py-14 md:py-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 text-sm text-gray-500 mb-8">
          <Link href="/app" className="hover:text-[#16171C] transition-colors">
            App
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-[#16171C] font-medium">Test Report</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
          Automated Test Report
        </h1>
        <p className="text-gray-500 text-sm md:text-base mb-8 max-w-xl leading-relaxed">
          The Macetz test suite runs against the real{" "}
          <code className="text-[13px] bg-black/5 px-1.5 py-0.5 rounded">src/lib</code>{" "}
          modules — no mocks of our own logic. It runs in CI on every push to{" "}
          <code className="text-[13px] bg-black/5 px-1.5 py-0.5 rounded">main</code>.
        </p>

        {/* Hero status card */}
        <div className="emboss-card p-6 md:p-8 mb-6">
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                allGreen ? "bg-green-500/15" : "bg-red-500/15"
              }`}
            >
              {allGreen ? (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              ) : (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              )}
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold tracking-tight">
                {report.passed} / {report.total} passing
              </p>
              <p className="text-sm text-gray-500">
                {allGreen ? "All tests green" : `${report.failed} failing`} ·{" "}
                {report.suiteCount} suites · {report.durationMs} ms
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-6">
            <span className="glass-pill px-4 py-1.5 text-xs font-medium text-gray-600">
              Last run: {formatUtc(report.generatedAt)}
            </span>
            <span className="glass-pill px-4 py-1.5 text-xs font-medium text-gray-600">
              Vitest · TypeScript strict
            </span>
          </div>
        </div>

        {/* Per-category breakdown */}
        <div className="space-y-2.5">
          {report.categories.map((cat) => {
            const catGreen = cat.failed === 0;
            return (
              <div
                key={cat.file}
                className="emboss-card px-5 py-4 flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-[#16171C] truncate">
                    {cat.name}
                  </p>
                  <p className="text-[11px] text-gray-400 font-mono truncate">
                    {cat.file}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-mono text-gray-600">
                    {cat.passed}/{cat.total}
                  </span>
                  <span
                    className={`inline-block w-2.5 h-2.5 rounded-full ${
                      catGreen ? "bg-green-500" : "bg-red-500"
                    }`}
                    aria-label={catGreen ? "passing" : "failing"}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Reproduce */}
        <div className="emboss-card p-6 mt-8">
          <p className="text-sm font-semibold text-[#16171C] mb-2">
            Reproduce locally
          </p>
          <pre className="text-[12px] font-mono bg-black/5 rounded-lg p-3 overflow-x-auto text-gray-700">
{`git clone https://github.com/pramadanif/macetz.git
cd macetz && npm install
npm run test          # run the suite
npm run test:report   # regenerate this page's data`}
          </pre>
          <p className="text-[12px] text-gray-500 mt-3 leading-relaxed">
            This page reflects the summary committed by{" "}
            <code className="text-[11px] bg-black/5 px-1 py-0.5 rounded">npm run test:report</code>.
            The{" "}
            <a
              href="https://github.com/pramadanif/macetz/actions/workflows/ci.yml"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[#16171C]"
            >
              CI workflow
            </a>{" "}
            re-runs the same suite on every push, so a green CI badge means these
            numbers are current.
          </p>
        </div>
      </div>
    </main>
  );
}
