"use client";

import React, { useEffect, useState } from "react";

interface RegistryToggleProps {
  autoCycle?: boolean;
}

export function RegistryToggle({ autoCycle = true }: RegistryToggleProps) {
  const [on, setOn] = useState(true);

  useEffect(() => {
    if (!autoCycle) return;

    const timer = window.setInterval(() => {
      setOn((prev) => !prev);
    }, 2800);

    return () => window.clearInterval(timer);
  }, [autoCycle]);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => setOn((prev) => !prev)}
      className={`registry-toggle ${on ? "registry-toggle--on" : "registry-toggle--off"}`}
    >
      <span className={`registry-toggle__thumb ${on ? "registry-toggle__thumb--on" : ""}`} />
    </button>
  );
}
