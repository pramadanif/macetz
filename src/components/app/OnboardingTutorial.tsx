"use client";

import React, { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "macetz_tutorial_seen";
const TOTAL_STEPS = 5;

interface TutorialStep {
  title: string;
  description: string;
  highlight: "none" | "left" | "center";
}

const steps: TutorialStep[] = [
  {
    title: "Welcome",
    description:
      "Welcome to Macetz! Your gateway to confidential tokens on Sepolia.",
    highlight: "none",
  },
  {
    title: "Sidebar Navigation",
    description:
      "Use the sidebar to navigate between Shield, Registry, Decrypt, and Faucet.",
    highlight: "left",
  },
  {
    title: "Registry",
    description:
      "Browse all registered ERC-20 ↔ ERC-7984 wrapper pairs from the on-chain registry.",
    highlight: "center",
  },
  {
    title: "Shield Tokens",
    description:
      "Shield your ERC-20 tokens into confidential ERC-7984 equivalents with one click.",
    highlight: "center",
  },
  {
    title: "Faucet",
    description:
      "Claim free mock tokens to try the full flow. Start with the Faucet!",
    highlight: "center",
  },
];

export function OnboardingTutorial() {
  const [visible, setVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY) !== "true") {
        setVisible(true);
      }
    } catch {
      // localStorage unavailable (e.g. private browsing restrictions)
    }
  }, []);

  const dismiss = useCallback(() => {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // silently ignore
    }
  }, []);

  const goNext = useCallback(() => {
    if (animating) return;
    if (currentStep >= TOTAL_STEPS - 1) {
      dismiss();
      return;
    }
    setAnimating(true);
    setTimeout(() => {
      setCurrentStep((s) => s + 1);
      setAnimating(false);
    }, 200);
  }, [currentStep, animating, dismiss]);

  if (!visible) return null;

  const step = steps[currentStep]!;
  const isLastStep = currentStep === TOTAL_STEPS - 1;

  const cardPosition =
    step.highlight === "left"
      ? "left-[280px] top-1/2 -translate-y-1/2"
      : "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2";

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity duration-300"
        onClick={dismiss}
        aria-hidden="true"
      />

      {/* Highlight cutout hint for sidebar steps */}
      {step.highlight === "left" && (
        <div
          className="absolute left-0 top-0 bottom-0 w-[260px] border-r-2 border-[#F5C518]/60 bg-white/5 pointer-events-none"
          aria-hidden="true"
        />
      )}

      {/* Tutorial card */}
      <div
        className={`absolute ${cardPosition} w-full max-w-[400px] px-4 transition-all duration-200 ${
          animating ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
      >
        <div className="emboss-card rounded-3xl p-8">
          <div className="relative z-10">
            {/* Step counter */}
            <p className="text-xs text-gray-400 mb-4 font-medium tracking-wide">
              Step {currentStep + 1} of {TOTAL_STEPS}
            </p>

            {/* Content */}
            <h3 className="text-lg font-semibold text-[#16171C] mb-2">
              {step.title}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-8">
              {step.description}
            </p>

            {/* Dot indicators */}
            <div className="flex items-center gap-1.5 mb-6" aria-hidden="true">
              {steps.map((_, i) => (
                <span
                  key={i}
                  className={`block rounded-full transition-all duration-300 ${
                    i === currentStep
                      ? "w-5 h-2 bg-[#F5C518]"
                      : i < currentStep
                        ? "w-2 h-2 bg-[#F5C518]/40"
                        : "w-2 h-2 bg-gray-300"
                  }`}
                />
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <button
                onClick={dismiss}
                className="text-gray-500 text-sm hover:text-gray-700 transition-colors"
              >
                Skip
              </button>
              <button
                onClick={goNext}
                className="bg-[#16171C] text-white rounded-full px-6 py-2.5 text-sm font-medium hover:bg-black transition-colors"
              >
                {isLastStep ? "Get Started" : "Next"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
