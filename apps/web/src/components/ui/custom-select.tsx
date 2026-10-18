"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
}

export interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: (SelectOption | string)[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  id?: string;
}

export function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Select an option...",
  className = "",
  disabled = false,
  id,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Normalize options to SelectOption[]
  const normalizedOptions: SelectOption[] = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full h-10 rounded-xl border bg-slate-50 dark:bg-[#0e0e0e] px-3.5 py-2 text-xs text-left flex items-center justify-between gap-2 transition-all cursor-pointer select-none focus:outline-none focus:ring-1 focus:ring-sky-500 ${
          isOpen
            ? "border-sky-500 ring-1 ring-sky-500/20"
            : "border-slate-200 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/20"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <span className="flex items-center gap-2 truncate">
          {selectedOption?.icon && (
            <span className="shrink-0">{selectedOption.icon}</span>
          )}
          <span
            className={`truncate font-medium ${
              selectedOption
                ? "text-slate-900 dark:text-neutral-200"
                : "text-slate-400 dark:text-neutral-600"
            }`}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </span>

        <ChevronDown
          className={`h-4 w-4 text-slate-400 dark:text-neutral-500 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-sky-500" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute z-50 left-0 right-0 mt-1.5 max-h-56 overflow-y-auto rounded-xl border border-slate-200 dark:border-white/[0.1] bg-white dark:bg-[#141414] p-1.5 shadow-2xl animate-in fade-in-0 zoom-in-95 duration-150"
        >
          {normalizedOptions.length === 0 ? (
            <div className="px-3 py-2 text-xs text-slate-400 dark:text-neutral-500 text-center">
              No options available
            </div>
          ) : (
            normalizedOptions.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <div
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(opt.value)}
                  className={`px-3 py-2 rounded-lg text-xs flex items-center justify-between gap-2 cursor-pointer transition-colors select-none ${
                    isSelected
                      ? "bg-sky-500/10 text-sky-600 dark:text-sky-400 font-semibold"
                      : "text-slate-700 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate min-w-0">
                    {opt.icon && (
                      <span className="shrink-0">{opt.icon}</span>
                    )}
                    <span className="truncate">{opt.label}</span>
                    {opt.badge && (
                      <span className="shrink-0">{opt.badge}</span>
                    )}
                  </div>
                  {isSelected && (
                    <Check className="h-3.5 w-3.5 text-sky-500 shrink-0" />
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
