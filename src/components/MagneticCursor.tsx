"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function MagneticCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for the outer ring
  const springConfig = { damping: 20, stiffness: 250, mass: 0.5 };
  const ringX = useSpring(mouseX, springConfig);
  const ringY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      // Check for magnetic elements
      const target = e.target as HTMLElement;
      const isSelectable = target.closest("a, button, .magnetic-target");
      setIsHovering(!!isSelectable);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [mouseX, mouseY]);

  return (
    <>
      {/* Central dot (fast) */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-white rounded-full z-[10000] pointer-events-none mix-blend-difference"
        style={{ x: mouseX, y: mouseY, translateX: "-50%", translateY: "-50%" }}
      />

      {/* Outer ring (smooth spring) */}
      <motion.div
        className="fixed top-0 left-0 border border-white/30 rounded-full z-[10000] pointer-events-none"
        style={{ 
          x: ringX, 
          y: ringY, 
          translateX: "-50%", 
          translateY: "-50%",
          width: isHovering ? 60 : 32,
          height: isHovering ? 60 : 32,
          backgroundColor: isHovering ? "rgba(255,255,255,0.1)" : "transparent",
          scale: isClicking ? 0.8 : 1,
        }}
        transition={{ type: "spring", damping: 15, stiffness: 150 }}
      />
      
      {/* Background spotlight (moved from old component) */}
      <div className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-300 cursor-spotlight-bg">
        <CursorPositionTracker />
      </div>
    </>
  );
}

function CursorPositionTracker() {
  useEffect(() => {
    const update = (e: MouseEvent) => {
      document.body.style.setProperty("--pos-x", `${e.clientX}px`);
      document.body.style.setProperty("--pos-y", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", update);
    return () => window.removeEventListener("mousemove", update);
  }, []);
  return null;
}
