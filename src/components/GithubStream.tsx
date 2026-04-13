"use client";
import React, { useState } from "react";
import { GitCommit } from "lucide-react";
import { motion } from "framer-motion";

export default function GithubStream() {
  const simulatedCommits = [
    { id: "a8f93cd", message: "Update ViT noise robustness benchmarks", date: "10 mins ago", repo: "robust-vision-research" },
    { id: "3bc49df", message: "Integrate FFT feature extraction in deepfake pipeline", date: "2 hours ago", repo: "fake-image-detection-system" },
    { id: "e4d2a1b", message: "Fixed context memory decay issue", date: "1 day ago", repo: "multimodal-memory-AI-system" },
    { id: "9fc830e", message: "Add baseline stats for Gaussian blur degradation", date: "2 days ago", repo: "robust-vision-research" },
    { id: "1c7a82b", message: "Refactoring RAG pipeline for Digital Twin", date: "3 days ago", repo: "RAG-Driven-Digital-Twin" }
  ];

  const [commits] = useState<{ id: string, message: string, date: string, repo: string }[]>(simulatedCommits);

  return (
    <div className="w-full max-w-md mx-auto relative group mt-16 lg:mt-0">
      <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-purple-500/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="relative bg-black/40 border border-white/10 p-6 rounded-3xl backdrop-blur-md shadow-2xl">
        <h3 className="text-white font-semibold text-lg flex items-center gap-3 mb-6">
          <GitCommit className="text-accent" />
          Live Commit Stream
        </h3>
        <div className="space-y-4">
          {commits.map((commit, idx) => (
            <motion.div 
              key={commit.id} 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex gap-4 border-l-2 border-white/5 pl-4 ml-2 relative"
            >
              <div className="absolute w-2 h-2 bg-accent rounded-full -left-[5px] top-1.5" />
              <div>
                <p className="text-sm text-neutral-200 line-clamp-1">{commit.message}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs font-mono text-neutral-500">{commit.id}</span>
                  <span className="text-xs text-neutral-600">{commit.date}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t border-white/5 text-center">
          <a href="https://github.com/Sappymukherjee214" target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:text-white transition-colors">View full activity →</a>
        </div>
      </div>
    </div>
  );
}
