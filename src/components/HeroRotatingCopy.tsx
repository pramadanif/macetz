"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

const SCRAMBLE_CHARSET = "ABCDEF0123456789#%&*+=<>";

function randomChar() {
  return SCRAMBLE_CHARSET[Math.floor(Math.random() * SCRAMBLE_CHARSET.length)];
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

export const HERO_COPY_VARIANTS = [
  {
    headline: "Shield. Distribute.",
    subtext:
      "The official Zama Wrappers Registry, turned into a product — plus confidential distribution powered by TokenOps SDK.",
  },
  {
    headline: "Encrypt. Decrypt.",
    subtext:
      "Wrap any ERC-20 into ERC-7984, decrypt your balance in one click, and send private payouts without leaking a single number.",
  },
  {
    headline: "Hide. Reveal, only to you.",
    subtext:
      "One registry to wrap from. One flow to distribute through. Zero numbers exposed.",
  },
  {
    headline: "Shield. Prove.",
    subtext:
      "Built on Zama Protocol. Powered by FHE. Verified onchain — never revealed onchain.",
  },
] as const;

export function HeroRotatingCopy() {
  const [variantIndex, setVariantIndex] = useState(0);
  const [headlineDisplay, setHeadlineDisplay] = useState<string>(
    HERO_COPY_VARIANTS[0].headline,
  );
  const [lockedCount, setLockedCount] = useState(
    HERO_COPY_VARIANTS[0].headline.length,
  );
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [subtextVisible, setSubtextVisible] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);

  const visibleRef = useRef(true);
  const containerRef = useRef<HTMLDivElement>(null);
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

  const runTransition = useCallback((nextIndex: number) => {
    const target = HERO_COPY_VARIANTS[nextIndex]?.headline ?? "";
    if (!target || transitioningRef.current) return;

    transitioningRef.current = true;
    setIsTransitioning(true);
    setSubtextVisible(false);
    setLockedCount(0);

    let locked = 0;

    const scrambleInterval = window.setInterval(() => {
      if (!visibleRef.current) return;
      setHeadlineDisplay(buildDisplay(target, locked));
    }, 40);

    const lockStep = () => {
      if (!visibleRef.current) return;

      while (locked < target.length && preserve(target[locked])) {
        locked += 1;
      }

      if (locked < target.length) {
        locked += 1;
      }

      setLockedCount(locked);
      setHeadlineDisplay(buildDisplay(target, locked));

      if (locked >= target.length) {
        window.clearInterval(scrambleInterval);
        setHeadlineDisplay(target);
        setIsTransitioning(false);
        transitioningRef.current = false;
        setVariantIndex(nextIndex);
        variantIndexRef.current = nextIndex;
        window.setTimeout(() => setSubtextVisible(true), 80);
        return;
      }

      window.setTimeout(lockStep, 22);
    };

    window.setTimeout(lockStep, 22);
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      const current = HERO_COPY_VARIANTS[variantIndex];
      setHeadlineDisplay(current.headline);
      setSubtextVisible(true);
      setIsTransitioning(false);
    }
  }, [reduceMotion, variantIndex]);

  useEffect(() => {
    const cycleMs = 5000;

    if (reduceMotion) {
      const timer = window.setInterval(() => {
        if (!visibleRef.current) return;
        setVariantIndex((prev) => (prev + 1) % HERO_COPY_VARIANTS.length);
      }, cycleMs);
      return () => window.clearInterval(timer);
    }

    const timer = window.setInterval(() => {
      if (!visibleRef.current || transitioningRef.current) return;
      const next = (variantIndexRef.current + 1) % HERO_COPY_VARIANTS.length;
      runTransition(next);
    }, cycleMs);

    return () => window.clearInterval(timer);
  }, [reduceMotion, runTransition]);

  const current = HERO_COPY_VARIANTS[variantIndex];

  return (
    <div ref={containerRef} className="hero-copy-block text-center max-w-3xl mx-auto px-4 mb-10">
      <h1 className="hero-headline mb-5">
        <span className="text-black">Wrap.</span>{" "}
        {reduceMotion ? (
          <span className="text-black">{current.headline}</span>
        ) : (
          headlineDisplay.split("").map((char, index) => {
            const scrambling =
              isTransitioning && index >= lockedCount && !preserve(char);

            return (
              <span
                key={`h-${index}`}
                className={scrambling ? "hero-scramble-char" : "text-black"}
              >
                {char}
              </span>
            );
          })
        )}
      </h1>

      <p
        className={`hero-subtext transition-opacity duration-300 ${
          subtextVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {current.subtext}
        {isTransitioning && !reduceMotion ? (
          <span className="hero-decrypt-caret" aria-hidden="true" />
        ) : null}
      </p>
    </div>
  );
}
