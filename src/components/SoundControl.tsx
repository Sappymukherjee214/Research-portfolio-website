"use client";
import React, { useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { audioManager } from "@/utils/audio";

export default function SoundControl() {
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [isHovered, setIsHovered] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  // Extremely stable BGM source (GitHub Raw)
  const BGM_URL = "https://raw.githubusercontent.com/rafaelreis-hotmart/Audio-Sample-files/master/sample.mp3";

  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!hasInteracted) {
        audioManager?.enable();
        setHasInteracted(true);
      }
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);
    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [hasInteracted]);

  // Sync volume with managers
  useEffect(() => {
    if (!isMuted) {
      audioManager?.setMasterVolume(volume);
      if (audioRef.current) {
        audioRef.current.volume = volume * 0.6; // Scale BGM slightly lower than effects
      }
    }
  }, [volume, isMuted]);

  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      if (isMuted) return;
      const target = (e.target as HTMLElement).closest('button, a') as HTMLElement;
      if (target) {
        audioManager?.playHover();
      }
    };

    window.addEventListener('mouseover', handleMouseOver);
    return () => window.removeEventListener('mouseover', handleMouseOver);
  }, [isMuted]);

  const toggleSound = () => {
    if (isMuted) {
      audioManager?.enable();
      audioManager?.startAmbient();
      if (audioRef.current) {
        audioRef.current.play().catch(e => console.log("Audio play blocked", e));
      }
      setIsMuted(false);
    } else {
      audioManager?.setMasterVolume(0);
      audioManager?.stopAmbient();
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsMuted(true);
    }
  };

  return (
    <div 
      className="fixed bottom-8 left-8 z-[500] flex items-center gap-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <audio ref={audioRef} src={BGM_URL} loop preload="auto" />
      
      <div className="relative flex items-center">
        <button
          onClick={toggleSound}
          className={`p-3 rounded-full border backdrop-blur-md transition-all duration-500 shadow-lg ${
            isMuted 
              ? 'bg-black/40 border-white/10 text-neutral-500 hover:text-white' 
              : 'bg-accent/20 border-accent/40 text-accent shadow-[0_0_20px_rgba(46,111,242,0.3)]'
          }`}
          aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} className={volume > 0 ? "animate-pulse" : ""} />}
        </button>

        <AnimatePresence>
          {isHovered && !isMuted && (
            <motion.div
              initial={{ opacity: 0, x: -10, scale: 0.9 }}
              animate={{ opacity: 1, x: 12, scale: 1 }}
              exit={{ opacity: 0, x: -10, scale: 0.9 }}
              className="absolute left-full px-4 py-2 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center gap-3 shadow-2xl"
            >
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-24 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent"
                aria-label="Volume regulator"
              />
              <span className="text-[10px] font-mono text-neutral-400 w-8">
                {Math.round(volume * 100)}%
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
