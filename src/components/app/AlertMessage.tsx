"use client";

import React from "react";

type AlertType = "success" | "error" | "info" | "loading";

interface AlertMessageProps {
  type: AlertType;
  title?: string;
  message: React.ReactNode;
}

export function AlertMessage({ type, title, message }: AlertMessageProps) {
  const getStyles = () => {
    switch (type) {
      case "error":
        return {
          bg: "bg-[#FFF0F0]",
          border: "border-red-100",
          iconColor: "text-red-500",
          titleColor: "text-red-700",
          textColor: "text-red-600/90",
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ),
        };
      case "success":
        return {
          bg: "bg-[#F0FFF4]",
          border: "border-green-100",
          iconColor: "text-green-500",
          titleColor: "text-green-700",
          textColor: "text-green-600/90",
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        };
      case "loading":
        return {
          bg: "bg-[#FFF8EB]",
          border: "border-amber-100",
          iconColor: "text-amber-500",
          titleColor: "text-amber-700",
          textColor: "text-amber-600/90",
          icon: (
            <div className="w-5 h-5 border-[2.5px] border-amber-400 border-t-transparent rounded-full animate-spin" />
          ),
        };
      case "info":
      default:
        return {
          bg: "bg-[#F0F7FF]",
          border: "border-blue-100",
          iconColor: "text-blue-500",
          titleColor: "text-blue-700",
          textColor: "text-blue-600/90",
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        };
    }
  };

  const style = getStyles();

  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-4 ${style.bg} border ${style.border} shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)]`}
    >
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 shrink-0 ${style.iconColor}`}>
          {style.icon}
        </div>
        <div className="flex-1">
          {title && (
            <h4 className={`text-sm font-semibold tracking-tight ${style.titleColor} mb-0.5`}>
              {title}
            </h4>
          )}
          <div className={`text-[13px] leading-relaxed ${style.textColor}`}>
            {message}
          </div>
        </div>
      </div>
    </div>
  );
}
