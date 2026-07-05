"use client";

import React, { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "macetz_tutorial_seen";
const TOTAL_STEPS = 5;

interface TutorialStep {
  title: string;
  description: string | React.ReactNode;
  highlight: "none" | "left" | "center";
  targetTab?: "dashboard" | "registry" | "wrap" | "decrypt" | "faucet";
}

const steps: TutorialStep[] = [
  {
    title: "Welcome to Macetz",
    description: (
      <div className="space-y-3">
        <p>Macetz is the canonical interface for the Zama Wrappers Registry.</p>
        <p>Built for the Zama Developer Program, this dApp allows you to browse, wrap, unwrap, and decrypt ERC-7984 confidential tokens with zero friction on the Sepolia testnet.</p>
        <p>Let's take a quick tour of how you can interact with Fully Homomorphic Encryption (FHE) on-chain.</p>
      </div>
    ),
    highlight: "none",
    targetTab: "dashboard",
  },
  {
    title: "1. The Faucet",
    description: (
      <div className="space-y-3">
        <p>To try the shielding flow, you need standard ERC-20 test tokens.</p>
        <p>The <strong>Faucet</strong> allows you to claim official `cTokenMock` underlying assets. It covers all 7 public-mint Sepolia mocks listed in the Zama documentation.</p>
        <p>Once you mint them, your public ERC-20 balance will be visible on block explorers.</p>
      </div>
    ),
    highlight: "left",
    targetTab: "faucet",
  },
  {
    title: "2. The Wrapper Registry",
    description: (
      <div className="space-y-3">
        <p>The <strong>Registry</strong> is your gateway to canonical confidential assets.</p>
        <p>Macetz dynamically fetches every official ERC-20 ↔ ERC-7984 wrapper pair directly from the on-chain Zama Wrappers Registry.</p>
        <p>It also seamlessly merges local developer pairs under a "Dev Pair" badge without fragmenting the production ecosystem.</p>
      </div>
    ),
    highlight: "center",
    targetTab: "registry",
  },
  {
    title: "3. Shield & Unshield",
    description: (
      <div className="space-y-3">
        <p>In the <strong>Shield</strong> panel, you convert public ERC-20 tokens into their confidential ERC-7984 counterparts via the Zama SDK.</p>
        <p>Once wrapped, your balance becomes an encrypted cipher on the blockchain. The unwrap flow (ERC-7984 → ERC-20) utilizes a full two-step asynchronous process: a relayer decryption followed by finalization.</p>
      </div>
    ),
    highlight: "center",
    targetTab: "wrap",
  },
  {
    title: "4. Universal Decryption",
    description: (
      <div className="space-y-3">
        <p>How do you view an encrypted balance?</p>
        <p>The <strong>Decrypt</strong> panel supports EIP-712 user-decryption. By signing a typed message, you authorize the FHEVM gateway to securely decrypt only your specific balance.</p>
        <p>Macetz makes this universal—it works for <strong>any</strong> ERC-7984 contract address, not just those in the official registry.</p>
      </div>
    ),
    highlight: "center",
    targetTab: "decrypt",
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

  useEffect(() => {
    const handleShow = () => {
      setCurrentStep(0);
      setVisible(true);
      setAnimating(false);
    };
    window.addEventListener("show-tutorial", handleShow);
    return () => window.removeEventListener("show-tutorial", handleShow);
  }, []);

  const dismiss = useCallback(() => {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // silently ignore
    }
  }, []);

  // Change tab when step changes
  useEffect(() => {
    const step = steps[currentStep];
    if (visible && step && step.targetTab) {
      window.dispatchEvent(
        new CustomEvent("tutorial-navigate", {
          detail: step.targetTab,
        })
      );
    }
  }, [currentStep, visible]);

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
        <div className="emboss-card p-6 md:p-8 max-h-[85vh] overflow-y-auto hide-scrollbar">
          <div className="relative z-10">
            {/* Step counter */}
            <p className="text-xs text-gray-400 mb-4 font-medium tracking-wide">
              Step {currentStep + 1} of {TOTAL_STEPS}
            </p>

            {/* Content */}
            <h3 className="text-lg font-semibold text-[#16171C] mb-2">
              {step.title}
            </h3>
            <div className="text-[15px] text-gray-600 leading-relaxed mb-8">
              {step.description}
            </div>

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
