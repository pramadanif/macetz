"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

const SCRAMBLE_CHARSET = "ABCDEF0123456789#%&*+=<>";

function randomChar() {
  return SCRAMBLE_CHARSET[Math.floor(Math.random() * SCRAMBLE_CHARSET.length)] ?? "#";
}

function preserve(char: string) {
  return char === " " || /[.,!?;:'"()\-–—]/.test(char);
}

function buildDisplay(target: string, locked: number) {
  return target
    .split("")
    .map((char, index) => {
      if (index < locked) return char;
      if (preserve(char)) return char;
      return randomChar();
    })
    .join("");
}

interface DecryptScrambleTextProps {
  texts: string[];
  className?: string;
  cycleMs?: number;
  charDelayMs?: number;
  showCaret?: boolean;
  as?: "h1" | "p" | "span";
}

export function DecryptScrambleText({
  texts,
  className = "",
  cycleMs = 4500,
  charDelayMs = 25,
  showCaret = false,
  as: Tag = "span",
}: DecryptScrambleTextProps) {
  const [variantIndex, setVariantIndex] = useState(0);
  const [display, setDisplay] = useState(texts[0] ?? "");
  const [lockedCount, setLockedCount] = useState(texts[0]?.length ?? 0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const visibleRef = useRef(true);
  const containerRef = useRef<HTMLElement | null>(null);
  const transitioningRef = useRef(false);
  const variantIndexRef = useRef(0);

  useEffect(() => {
    variantIndexRef.current = variantIndex;
  }, [variantIndex]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry?.isIntersecting ?? true;
      },
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const runTransition = useCallback(
    (nextIndex: number) => {
      const target = texts[nextIndex] ?? "";
      if (!target || transitioningRef.current) return;

      transitioningRef.current = true;
      setIsTransitioning(true);
      setLockedCount(0);

      let locked = 0;

      const scrambleInterval = window.setInterval(() => {
        if (!visibleRef.current) return;
        setDisplay(buildDisplay(target, locked));
      }, 50);

      const lockStep = () => {
        if (!visibleRef.current) return;

        while (locked < target.length && preserve(target[locked]!)) {
          locked += 1;
        }

        if (locked < target.length) {
          locked += 1;
        }

        setLockedCount(locked);
        setDisplay(buildDisplay(target, locked));

        if (locked >= target.length) {
          window.clearInterval(scrambleInterval);
          setDisplay(target);
          setIsTransitioning(false);
          transitioningRef.current = false;
          setVariantIndex(nextIndex);
          variantIndexRef.current = nextIndex;
          return;
        }

        window.setTimeout(lockStep, charDelayMs);
      };

      window.setTimeout(lockStep, charDelayMs);
    },
    [texts, charDelayMs],
  );

  useEffect(() => {
    if (reduceMotion) {
      const timer = window.setInterval(() => {
        if (!visibleRef.current) return;
        setVariantIndex((prev) => (prev + 1) % texts.length);
      }, cycleMs);
      return () => window.clearInterval(timer);
    }

    const timer = window.setInterval(() => {
      if (!visibleRef.current || transitioningRef.current) return;
      const next = (variantIndexRef.current + 1) % texts.length;
      runTransition(next);
    }, cycleMs);

    return () => window.clearInterval(timer);
  }, [reduceMotion, texts.length, cycleMs, runTransition]);

  useEffect(() => {
    if (reduceMotion) {
      setDisplay(texts[variantIndex] ?? "");
      setLockedCount(texts[variantIndex]?.length ?? 0);
      setIsTransitioning(false);
    }
  }, [reduceMotion, texts, variantIndex]);

  const content = reduceMotion ? (
    texts[variantIndex]
  ) : (
    display.split("").map((char, index) => {
      const scrambling =
        isTransitioning && index >= lockedCount && !preserve(char);

      return (
        <span
          key={`${variantIndex}-${index}`}
          className={scrambling ? "text-[#F5C518]" : undefined}
        >
          {char}
        </span>
      );
    })
  );

  return (
    <Tag ref={containerRef as never} className={className}>
      {content}
      {showCaret && isTransitioning ? (
        <span className="inline-block w-[2px] h-[0.9em] bg-[#F5C518] ml-0.5 align-middle animate-pulse font-telegraf" />
      ) : null}
    </Tag>
  );
}
