"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
  showCloseButton?: boolean;
  preventClose?: boolean;
  className?: string;
}

const maxWidthMap = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
};

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = "md",
  showCloseButton = true,
  preventClose = false,
  className = "",
}: ModalProps) {
  // Handle ESC key
  useEffect(() => {
    if (!isOpen || preventClose || !onClose) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, preventClose, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !preventClose && onClose) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full ${maxWidthMap[maxWidth]} rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#121212] shadow-2xl animate-in zoom-in-95 duration-200 my-auto overflow-hidden flex flex-col ${className}`}
      >
        {(title || (showCloseButton && onClose)) && (
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/[0.06] bg-slate-50/50 dark:bg-[#161616]/50 px-6 py-4.5 shrink-0">
            <div className="min-w-0 pr-3">
              {typeof title === "string" ? (
                <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                  {title}
                </h3>
              ) : (
                title
              )}
              {description && (
                <div className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                  {description}
                </div>
              )}
            </div>

            {showCloseButton && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="text-slate-400 hover:text-slate-700 dark:text-neutral-400 dark:hover:text-white p-1.5 rounded-lg bg-slate-100 dark:bg-neutral-800/60 hover:bg-slate-200 dark:hover:bg-neutral-800 transition-colors cursor-pointer shrink-0"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
