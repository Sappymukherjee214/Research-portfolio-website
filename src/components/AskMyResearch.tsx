"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, ArrowRight, Mic, MicOff } from "lucide-react";

const EXAMPLE_QUESTIONS = [
  "What is your work on noise-resilient AI?",
  "Explain your personalized memory-aware RAG system",
  "What research problems interest you?"
];

export default function AskMyResearch() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [stats, setStats] = useState<{ latency: string, tokens: number } | null>(null);

  const toggleListen = () => {
    if (typeof window === "undefined" || !('webkitSpeechRecognition' in window)) {
      alert("Speech recognition isn't supported in this browser.");
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    if (isListening) {
      recognition.stop();
      setIsListening(false);
      return;
    }

    recognition.onstart = () => setIsListening(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      handleAsk(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const handleAsk = async (questionToAsk: string) => {
    if (!questionToAsk.trim()) return;

    setIsLoading(true);
    setResponse(null);
    setError(null);

    try {
      const startTime = performance.now();
      
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: questionToAsk }),
      });


      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch response.");
      }

      const endTime = performance.now();
      setResponse(data.answer);
      setStats({
        latency: (endTime - startTime).toFixed(0),
        tokens: Math.floor(data.answer.length / 3) + 120 // Rough token est
      });

      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(data.answer);
        window.speechSynthesis.speak(utterance);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Something went wrong.");
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAsk(query);
  };

  return (
    <section className="relative z-30 bg-black/60 backdrop-blur-2xl py-32 px-6 sm:px-12 lg:px-24 border-t border-white/5 overflow-hidden">
      {/* Abstract Glowing Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-accent/5 rounded-full blur-[130px] pointer-events-none mix-blend-screen" />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true, margin: "-50px" }}
           transition={{ duration: 0.8 }}
           className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs uppercase tracking-[0.2em] text-neutral-300">
            <Sparkles size={14} className="text-accent" />
            <span>Interactive RAG</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-4 text-gradient">Ask My Research</h2>
          <p className="text-neutral-400 font-light text-lg max-w-2xl mx-auto">
            Interact directly with my work &mdash; no need to search manually. Ask questions to receive concise, context-aware explanations strictly based on my academic portfolio.
          </p>
        </motion.div>

        {/* Search Input Box */}
        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          onSubmit={handleSubmit} 
          className="relative max-w-2xl mx-auto group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-indigo-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          
          <div className="relative glass rounded-2xl p-2 flex items-center transition-all duration-300 border border-white/10 hover:border-white/30 focus-within:border-accent">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., How does your multi-modal RAG handle noise?"
              className="flex-1 bg-transparent border-none outline-none text-white px-4 py-3 placeholder:text-neutral-600 font-light"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={toggleListen}
              className={`p-3 mr-2 rounded-full transition-colors ${isListening ? 'bg-red-500/20 text-red-500' : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'}`}
              title="Voice Input"
            >
              {isListening ? <MicOff size={18} className="animate-pulse" /> : <Mic size={18} />}
            </button>
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="px-6 py-3 bg-white text-black rounded-xl font-medium tracking-wide hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : "Discover"}
            </button>
          </div>
        </motion.form>

        {/* Suggestion Chips */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mt-8 max-w-2xl mx-auto"
        >
          {EXAMPLE_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => { setQuery(q); handleAsk(q); }}
              className="text-xs text-neutral-400 font-light px-3 py-1.5 rounded-full border border-white/5 bg-white/5 hover:bg-white/10 hover:text-white transition-colors"
            >
              {q}
            </button>
          ))}
        </motion.div>

        {/* Response Area */}
        <AnimatePresence>
          {(response || error) && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="mt-12 max-w-2xl mx-auto"
            >
              <div className="glass rounded-2xl p-6 border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                {error ? (
                  <div className="text-red-400 font-light flex items-start gap-3">
                    <span className="text-xl leading-none">&times;</span>
                    <p>{error}</p>
                  </div>
                ) : (
                  <div className="flex gap-4 items-start">
                    <div className="shrink-0 mt-1 w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center border border-accent/40 text-accent">
                      <Sparkles size={12} />
                    </div>
                    <div className="text-neutral-200 font-light leading-relaxed prose prose-invert">
                      {response}
                    </div>
                  </div>
                )}
                
                {stats && !error && (
                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between opacity-50">
                    <div className="flex gap-4 text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                      <span>Latency: {stats.latency}ms</span>
                      <span>Ctx Tokens: {stats.tokens}</span>
                      <span>Model: Gemini 2.5 Flash</span>
                    </div>
                    <div className="px-2 py-1 bg-green-500/10 text-green-400 rounded text-[10px] uppercase tracking-widest">
                      RAG Vector Hit
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
