"use client";

import { useEffect } from "react";

interface KeyboardShortcutOptions {
  onEscape?: () => void;
}

export function useKeyboardShortcuts({ onEscape }: KeyboardShortcutOptions) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onEscape) {
        e.preventDefault();
        onEscape();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onEscape]);
}
