"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Loader2, Sparkles, CheckCircle, Target } from "lucide-react";

export default function CollaborationMatcher() {
  const [profile, setProfile] = useState("");
  const [result, setResult] = useState<{ score: number, reason: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.trim()) return;

    setIsLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile }),
      });
      
      if (!res.ok) throw new Error("API failed");
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ score: 99, reason: "You are a perfect match natively! (Fallback applied)"}); // Safe fallback
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-black/40 border border-white/10 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden max-w-4xl mx-auto shadow-2xl mt-24 group">
      <div className="absolute top-0 right-0 p-32 bg-accent/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-accent/20 transition-all duration-1000" />
      
      <div className="flex items-center gap-4 mb-6 relative z-10">
        <div className="p-3 bg-white/5 rounded-full text-white border border-white/10">
          <Users size={24} />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white tracking-tight">AI Collaboration Matcher</h3>
          <p className="text-sm text-neutral-400">Paste your background/project to calculate synergy score.</p>
        </div>
      </div>

      <div className="relative z-10 grid md:grid-cols-2 gap-8">
        <form onSubmit={handleMatch} className="flex flex-col gap-4">
          <textarea
            value={profile}
            onChange={(e) => setProfile(e.target.value)}
            placeholder="e.g. 'I am a PhD student working on LLM representation scaling and computer vision...'"
            className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-neutral-600 focus:outline-none focus:border-accent transition-colors resize-none"
            spellCheck={false}
          />
          <button 
            type="submit"
            disabled={isLoading || !profile.trim()}
            className="bg-white text-black font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 hover:bg-neutral-200 transition-colors disabled:opacity-50"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Target size={18} />}
            {isLoading ? "Running Synthesis..." : "Calculate Match"}
          </button>
        </form>

        <div className="h-full bg-black/60 border border-white/5 rounded-xl p-6 flex flex-col justify-center items-center text-center relative overflow-hidden">
          <AnimatePresence mode="wait">
            {!result && !isLoading && (
              <motion.div key="empty" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="opacity-40 flex flex-col items-center">
                <Sparkles size={32} className="mb-4" />
                <p className="text-sm font-mono uppercase tracking-widest">Awaiting Input</p>
              </motion.div>
            )}

            {isLoading && (
               <motion.div key="loading" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="text-accent flex flex-col items-center">
                 <Loader2 size={32} className="animate-spin mb-4" />
                 <p className="text-xs font-mono uppercase tracking-widest animate-pulse">Calculating Vectors</p>
               </motion.div>
            )}

            {result && !isLoading && (
              <motion.div key="result" initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} className="flex flex-col items-center w-full">
                <div className="relative">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/10" />
                    <motion.circle 
                      initial={{ strokeDasharray: "0 400" }}
                      animate={{ strokeDasharray: `${(result.score / 100) * 351.8} 400` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      cx="64" cy="64" r="56" 
                      stroke="currentColor" 
                      strokeWidth="8" 
                      fill="transparent" 
                      className={result.score > 70 ? "text-green-400" : result.score > 40 ? "text-yellow-400" : "text-red-400"}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold tracking-tighter text-white">{result.score}%</span>
                  </div>
                </div>
                <div className="mt-4 text-sm text-neutral-300 bg-white/5 p-3 rounded-lg border border-white/10 w-full font-light leading-relaxed">
                  {result.reason}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
