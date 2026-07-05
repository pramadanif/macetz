"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

const STORAGE_KEY = "macetz_tutorial_seen";

type Tab = "dashboard" | "registry" | "wrap" | "decrypt" | "faucet" | "distribute";

interface TutorialStep {
  title: string;
  description: string | React.ReactNode;
  targetTab?: Tab;
  targetSelector?: string; // e.g. "#faucet-mint-btn"
  position?: "top" | "bottom" | "center";
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
    targetTab: "dashboard",
    position: "center",
  },
  {
    title: "1. The Faucet",
    description: (
      <div className="space-y-3">
        <p>To try the shielding flow, you need standard ERC-20 test tokens.</p>
        <p>The <strong>Faucet</strong> allows you to claim official `cTokenMock` underlying assets. It covers all 7 public-mint Sepolia mocks listed in the Zama documentation.</p>
      </div>
    ),
    targetTab: "faucet",
    targetSelector: "#nav-faucet",
    position: "center",
  },
  {
    title: "1a. Faucet Mock Tokens",
    description: "Select the mock token you wish to mint from this list.",
    targetTab: "faucet",
    targetSelector: "#faucet-token-list",
    position: "bottom",
  },
  {
    title: "1b. Minting",
    description: "Click here to mint 1,000 test tokens. Your public ERC-20 balance will then be visible on block explorers.",
    targetTab: "faucet",
    targetSelector: "#faucet-mint-btn",
    position: "top",
  },
  {
    title: "2. The Wrapper Registry",
    description: (
      <div className="space-y-3">
        <p>The <strong>Registry</strong> is your gateway to canonical confidential assets.</p>
        <p>Macetz dynamically fetches every official ERC-20 ↔ ERC-7984 wrapper pair directly from the on-chain Zama Wrappers Registry.</p>
      </div>
    ),
    targetTab: "registry",
    targetSelector: "#nav-registry",
    position: "center",
  },
  {
    title: "2a. Registry Browser",
    description: "Here you can view all available pairs. It merges official pairs with local developer pairs under a 'Dev Pair' badge.",
    targetTab: "registry",
    targetSelector: "#registry-table",
    position: "top",
  },
  {
    title: "3. Shield & Unshield",
    description: (
      <div className="space-y-3">
        <p>In the <strong>Shield</strong> panel, you convert public ERC-20 tokens into their confidential ERC-7984 counterparts via the Zama SDK.</p>
      </div>
    ),
    targetTab: "wrap",
    targetSelector: "#nav-wrap",
    position: "center",
  },
  {
    title: "3a. Token Selection",
    description: "Choose which public asset you want to shield from this dropdown.",
    targetTab: "wrap",
    targetSelector: "#wrap-token-select",
    position: "bottom",
  },
  {
    title: "3b. Execute Shield",
    description: "Once you enter an amount, click here to wrap. Your balance becomes an encrypted cipher on the blockchain. The unwrap flow operates similarly.",
    targetTab: "wrap",
    targetSelector: "#wrap-submit-btn",
    position: "top",
  },
  {
    title: "4. Universal Decryption",
    description: (
      <div className="space-y-3">
        <p>How do you view an encrypted balance?</p>
        <p>Macetz supports EIP-712 user-decryption, acting universally across any ERC-7984 contract address.</p>
      </div>
    ),
    targetTab: "decrypt",
    targetSelector: "#nav-decrypt",
    position: "center",
  },
  {
    title: "4a. Decrypt Balance",
    description: "By signing a typed message when clicking this button, you authorize the FHEVM gateway to securely decrypt only your specific balance.",
    targetTab: "decrypt",
    targetSelector: "#decrypt-submit-btn",
    position: "top",
  },
  {
    title: "5. Distribute Tokens",
    description: (
      <div className="space-y-3">
        <p>The <strong>Distribute</strong> panel enables you to send standard or confidential tokens to multiple addresses in one go.</p>
      </div>
    ),
    targetTab: "distribute",
    targetSelector: "#nav-distribute",
    position: "center",
  },
  {
    title: "5a. Token Selection",
    description: "Select the shielded asset you want to use for confidential payroll or airdrops.",
    targetTab: "distribute",
    targetSelector: "#distribute-token-select",
    position: "bottom",
  },
  {
    title: "5b. Review & Execute",
    description: "Add your recipients manually or upload a CSV, then click here to execute a fully encrypted batch transfer.",
    targetTab: "distribute",
    targetSelector: "#distribute-next-btn",
    position: "top",
  },
];

const TOTAL_STEPS = steps.length;

export function OnboardingTutorial() {
  const [visible, setVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    try {
      if (typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY) !== "true") {
        setVisible(true);
      }
    } catch {
      // localStorage unavailable
    }
  }, []);

  useEffect(() => {
    const handleShow = () => {
      setCurrentStep(0);
      setVisible(true);
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

  const step = steps[currentStep]!;

  // Dispatch navigation
  useEffect(() => {
    if (visible && step && step.targetTab) {
      window.dispatchEvent(
        new CustomEvent("tutorial-navigate", {
          detail: step.targetTab,
        })
      );
    }
  }, [currentStep, visible, step]);

  // Track target rect
  useEffect(() => {
    if (!visible || !step) return;
    
    if (!step.targetSelector) {
      setTargetRect(null);
      return;
    }

    const update = () => {
      const el = document.querySelector(step.targetSelector!);
      if (el) {
        setTargetRect(el.getBoundingClientRect());
      } else {
        setTargetRect(null);
      }
    };

    update();
    const interval = setInterval(update, 100);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [currentStep, visible, step]);

  const goNext = useCallback(() => {
    if (currentStep >= TOTAL_STEPS - 1) {
      dismiss();
      return;
    }
    setCurrentStep((s) => s + 1);
  }, [currentStep, dismiss]);

  const goPrev = useCallback(() => {
    if (currentStep <= 0) return;
    setCurrentStep((s) => s - 1);
  }, [currentStep]);

  if (!visible) return null;

  const isLastStep = currentStep === TOTAL_STEPS - 1;

  // Calculate Card Position
  let cardStyle: any = {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };

  if (targetRect && step.position !== "center") {
    // Attempt to position relative to the element
    if (step.position === "bottom") {
      cardStyle = {
        top: targetRect.bottom + 20,
        left: Math.min(Math.max(20, targetRect.left + targetRect.width / 2), typeof window !== "undefined" ? window.innerWidth - 420 : 0),
        transform: "translateX(0)", // we adjust left manually to prevent offscreen
      };
      if (typeof window !== "undefined" && (cardStyle.left as number) < window.innerWidth / 2) {
        cardStyle.transform = "translateX(0)";
      } else {
        cardStyle.left = targetRect.right;
        cardStyle.transform = "translateX(-100%)";
      }
    } else if (step.position === "top") {
      cardStyle = {
        top: targetRect.top - 20,
        left: Math.min(Math.max(20, targetRect.left + targetRect.width / 2), typeof window !== "undefined" ? window.innerWidth - 420 : 0),
        transform: "translateY(-100%)",
      };
      if (typeof window !== "undefined" && (cardStyle.left as number) > window.innerWidth / 2) {
         cardStyle.left = targetRect.right;
         cardStyle.transform = "translate(-100%, -100%)";
      }
    }
  }

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true">
      {/* Background Mask */}
      <div 
        className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${!targetRect ? "opacity-100" : "opacity-0"}`} 
        onClick={dismiss} 
      />
      
      {/* Dynamic Spotlight */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" onClick={dismiss}>
        <AnimatePresence>
          {targetRect && (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1, 
                x: targetRect.left - 12, 
                y: targetRect.top - 12, 
                width: targetRect.width + 24, 
                height: targetRect.height + 24 
              }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 200, mass: 0.8 }}
              className="absolute rounded-2xl shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] ring-4 ring-[#F5C518]/80 pointer-events-auto cursor-pointer"
            />
          )}
        </AnimatePresence>
      </div>

      {/* Tutorial card */}
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1, ...cardStyle }}
        transition={{ type: "spring", damping: 25, stiffness: 150 }}
        className="absolute w-full max-w-[400px] px-4"
      >
        <div className="emboss-card p-6 md:p-8 max-h-[85vh] overflow-y-auto hide-scrollbar bg-white/95 backdrop-blur-xl shadow-2xl">
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
            <div className="flex flex-wrap items-center gap-1.5 mb-6" aria-hidden="true">
              {steps.map((_, i) => (
                <span
                  key={i}
                  className={`block rounded-full transition-all duration-300 ${
                    i === currentStep
                      ? "w-4 h-1.5 bg-[#F5C518]"
                      : i < currentStep
                        ? "w-1.5 h-1.5 bg-[#F5C518]/40"
                        : "w-1.5 h-1.5 bg-gray-200"
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
              <div className="flex gap-2">
                {currentStep > 0 && (
                  <button
                    onClick={goPrev}
                    className="bg-gray-100 text-gray-600 rounded-full px-4 py-2.5 text-sm font-medium hover:bg-gray-200 transition-colors"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={goNext}
                  className="bg-[#16171C] text-white rounded-full px-6 py-2.5 text-sm font-medium hover:bg-black transition-colors"
                >
                  {isLastStep ? "Finish" : "Next"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
