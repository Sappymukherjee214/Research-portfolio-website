"use client";
import { useEffect } from "react";
import { audioManager } from "@/utils/audio";

export default function AudioInitializer() {
  useEffect(() => {
    const handleInteraction = () => {
      audioManager?.enable();
      // Remove listeners once enabled
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };

    let lastHoveredElement: HTMLElement | null = null;
    const handleMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('button, a') as HTMLElement;
      if (target && target !== lastHoveredElement) {
        audioManager?.playHover();
        lastHoveredElement = target;
      } else if (!target) {
        lastHoveredElement = null;
      }
    };

    document.addEventListener('click', handleInteraction);
    document.addEventListener('keydown', handleInteraction);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return null;
}
