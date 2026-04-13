"use client";
import { useEffect, useRef } from "react";

export default function CursorSpotlight() {
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      if (spotlightRef.current) {
        spotlightRef.current.style.setProperty('--cursor-x', `${e.clientX}px`);
        spotlightRef.current.style.setProperty('--cursor-y', `${e.clientY}px`);
      }
    };
    window.addEventListener("mousemove", updateCursor);
    return () => window.removeEventListener("mousemove", updateCursor);
  }, []);

  return (
    <div 
      ref={spotlightRef}
      className="pointer-events-none fixed inset-0 z-[100] transition-opacity duration-75 cursor-spotlight-bg"
    />
  );
}
