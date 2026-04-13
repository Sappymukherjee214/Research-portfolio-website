"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Sliders } from "lucide-react";
import { audioManager } from "@/utils/audio";

export default function VisionPlayground() {
  const [noiseLevel, setNoiseLevel] = useState(0);

  // Confidence formula to simulate degradation
  const maxConfidence = 94.8;
  const currentConfidence = Math.max(9.59, maxConfidence - (noiseLevel * 8.5)).toFixed(2);

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden mt-16 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center gap-4">
        <div className="p-3 bg-accent/20 rounded-full text-accent">
          <Sliders size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Live Vision Model Degradation</h3>
          <p className="text-sm text-neutral-400">Interactive demonstration of robustness under visual noise.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* Visual Element */}
        <div className="relative aspect-video rounded-xl overflow-hidden bg-black flex items-center justify-center border border-white/10">
          <Image 
            src="/vision_sample_object.png" 
            alt="Sample Vision Object"
            fill
            sizes="(max-width: 768px) 100vw, 448px"
            className="absolute inset-0 w-full h-full object-cover vision-sample-image"
            data-noise={noiseLevel}
          />
          
          {noiseLevel > 0 && (
            <svg 
              className="absolute inset-0 w-full h-full opacity-40 mix-blend-overlay pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <filter id="noiseFilter">
                <feTurbulence 
                  type="fractalNoise" 
                  baseFrequency={0.5 + noiseLevel * 0.5} 
                  numOctaves={3} 
                  stitchTiles="stitch"
                />
              </filter>
              <rect width="100%" height="100%" filter="url(#noiseFilter)" />
            </svg>
          )}

          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 text-white font-mono text-xs">
            Model Conf: {currentConfidence}%
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col justify-center">
          <label htmlFor="noise-level" className="text-sm font-semibold text-neutral-300 mb-2 flex justify-between">
            <span>Gaussian Noise Injection</span>
            <span className="text-accent">{noiseLevel}/10</span>
          </label>
          <input 
            id="noise-level"
            type="range" 
            min="0" 
            max="10" 
            value={noiseLevel}
            onChange={(e) => {
              const val = Number(e.target.value);
              setNoiseLevel(val);
              audioManager?.playStatic(val);
            }}
            className="w-full accent-blue-500 h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer mb-8"
            aria-label="Gaussian Noise Injection"
            title="Gaussian Noise Injection Level"
          />
          
          <div className="space-y-4">
            <div className="p-4 bg-black/40 rounded-xl border border-white/5">
              <div className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Architecture</div>
              <div className="text-sm text-neutral-200 font-mono">ResNet-18 / ViT Hybrid</div>
            </div>
            <div className="p-4 bg-black/40 rounded-xl border border-white/5">
              <div className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Status</div>
              <div className={`text-sm font-mono ${noiseLevel > 6 ? 'text-red-400' : 'text-green-400'}`}>
                {noiseLevel > 6 ? 'High Degradation Detected. ~85% accuracy drop limit reached.' : 'Stable Inference Environment'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
