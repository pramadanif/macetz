"use client";

import React, { useState, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  DOCS_SECTIONS,
  DOCS_TOC_EXTENDED,
  type DocsBlock,
  type DocsCodeBlock,
  type DocsSection,
} from "@/lib/docs-content";

const PANEL_VARIANTS = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: "auto" },
  exit: { opacity: 0, height: 0 },
};
const PANEL_TRANSITION = { duration: 0.2, ease: "easeInOut" as const };

function languageLabel(lang: string): string {
  const map: Record<string, string> = {
    json: "JSON",
    bash: "Shell",
    env: "Env",
  };
  return map[lang] ?? lang.toUpperCase();
}

function highlightTokens(code: string, language: string): React.ReactNode[] {
  const lines = code.split("\n");
  return lines.map((line, lineIdx) => {
    let content: React.ReactNode = line;

    if (language === "json") {
      const parts = line.split(/("(?:[^"\\]|\\.)*")/g);
      content = parts.map((part, i) => {
        if (part.startsWith('"') && part.endsWith('"')) {
          const isKey = parts[i + 1]?.trimStart().startsWith(":");
          return (
            <span key={i} className={isKey ? "text-[#7c3aed]" : "text-[#0d9488]"}>
              {part}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      });
    } else if (language === "bash") {
      if (line.trim().startsWith("#")) {
        content = <span className="text-gray-400">{line}</span>;
      }
    }

    return (
      <span key={lineIdx} className="block">
        {content}
        {lineIdx < lines.length - 1 ? "\n" : null}
      </span>
    );
  });
}

function DocsCodeBlockView({ block }: { block: DocsCodeBlock }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(block.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [block.code]);

  return (
    <div className="rounded-xl border border-gray-200/80 bg-[#1a1b1f] overflow-hidden my-4">
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 bg-[#222328]">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
          {languageLabel(block.language)}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="text-[11px] font-semibold px-2.5 py-1 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          aria-label={`Copy ${block.id} code`}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-[12px] leading-relaxed font-mono text-gray-100">
        <code>{highlightTokens(block.code, block.language)}</code>
      </pre>
    </div>
  );
}

function resolveCodeBlock(section: DocsSection, blockId: string): DocsCodeBlock | undefined {
  return section.codeBlocks?.find((b) => b.id === blockId);
}

function renderBlock(block: DocsBlock, section: DocsSection, key: number) {
  switch (block.type) {
    case "paragraph":
      return (
        <p key={key} className="text-[15px] text-gray-600 leading-relaxed mb-4">
          {block.text}
        </p>
      );
    case "list":
      return (
        <ul key={key} className="list-disc pl-5 space-y-2 mb-4 text-[15px] text-gray-600 leading-relaxed">
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
    case "subheading":
      return (
        <h3 key={key} className="text-[15px] font-semibold text-[#16171C] mt-6 mb-2 tracking-tight">
          {block.text}
        </h3>
      );
    case "anchor":
      return (
        <h3
          key={key}
          id={block.id}
          className="text-[15px] font-semibold text-[#16171C] mt-8 mb-2 tracking-tight scroll-mt-24"
        >
          {block.label}
        </h3>
      );
    case "code": {
      const codeBlock = resolveCodeBlock(section, block.blockId);
      if (!codeBlock) return null;
      return <DocsCodeBlockView key={key} block={codeBlock} />;
    }
    default:
      return null;
  }
}

function TocLink({
  id,
  title,
  depth,
  activeId,
  onNavigate,
}: {
  id: string;
  title: string;
  depth: number;
  activeId: string;
  onNavigate: (id: string) => void;
}) {
  const isActive = activeId === id;
  return (
    <li>
      <a
        href={`#${id}`}
        onClick={(e) => {
          e.preventDefault();
          onNavigate(id);
        }}
        className={`block py-1.5 text-[13px] font-medium transition-all duration-200 rounded-lg ${
          depth > 0 ? "pl-4" : "pl-2"
        } ${
          isActive
            ? "text-[#16171C] bg-[#F5C518]/15 border-l-2 border-[#F5C518] -ml-px pl-[calc(0.5rem-2px)]"
            : "text-gray-500 hover:text-gray-800 border-l-2 border-transparent"
        }`}
      >
        {title}
      </a>
    </li>
  );
}

export function DocsPanel() {
  const [mobileTocOpen, setMobileTocOpen] = useState(false);
  const [activeId, setActiveId] = useState(DOCS_TOC_EXTENDED[0]?.id ?? "getting-started");

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(id);
    }
    setMobileTocOpen(false);
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-[#16171C]">Documentation</h1>
        <p className="text-sm text-gray-500 mt-1">
          How Macetz works, how to add pairs, and how to deploy your own confidential token.
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
        {/* Mobile TOC — collapsible */}
        <div className="lg:hidden emboss-card overflow-hidden">
          <button
            type="button"
            onClick={() => setMobileTocOpen((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-white/40 transition-colors"
            aria-expanded={mobileTocOpen}
          >
            <span className="font-semibold text-sm text-[#16171C]">On this page</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className={`text-gray-400 transition-transform duration-200 ${mobileTocOpen ? "rotate-180" : ""}`}
            >
              <path d="M4 6l4 4 4-4" />
            </svg>
          </button>
          <AnimatePresence initial={false}>
            {mobileTocOpen && (
              <motion.nav
                key="mobile-toc"
                variants={PANEL_VARIANTS}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={PANEL_TRANSITION}
                style={{ overflow: "hidden" }}
                aria-label="Table of contents"
                className="border-t border-gray-100/80 px-3 pb-3"
              >
                <ul className="space-y-0.5 pt-2">
                  {DOCS_TOC_EXTENDED.map((item) => (
                    <TocLink
                      key={item.id}
                      {...item}
                      activeId={activeId}
                      onNavigate={scrollToSection}
                    />
                  ))}
                </ul>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop sticky TOC */}
        <nav
          aria-label="Table of contents"
          className="hidden lg:block w-48 shrink-0"
        >
          <div className="sticky top-8">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-3 px-2">
              On this page
            </p>
            <ul className="space-y-0.5">
              {DOCS_TOC_EXTENDED.map((item) => (
                <TocLink
                  key={item.id}
                  {...item}
                  activeId={activeId}
                  onNavigate={scrollToSection}
                />
              ))}
            </ul>
          </div>
        </nav>

        {/* Content */}
        <article className="flex-1 min-w-0 space-y-10">
          {DOCS_SECTIONS.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="emboss-card p-6 lg:p-8 scroll-mt-24"
              aria-labelledby={`docs-heading-${section.id}`}
            >
              <h2
                id={`docs-heading-${section.id}`}
                className="text-lg font-semibold tracking-tight text-[#16171C] mb-4"
              >
                {section.title}
              </h2>
              <div>{section.blocks.map((block, i) => renderBlock(block, section, i))}</div>
            </section>
          ))}
        </article>
      </div>
    </div>
  );
}
