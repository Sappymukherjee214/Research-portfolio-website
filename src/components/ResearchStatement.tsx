"use client";

import { motion } from "framer-motion";

export default function ResearchStatement() {
  return (
    <section className="relative z-30 bg-black/60 backdrop-blur-2xl py-40 px-6 sm:px-12 lg:px-24 flex items-center justify-center border-t border-white/5 overflow-hidden">
      
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
      <div className="absolute top-1/2 left-1/4 -translate-y-1/3 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 1, ease: "easeOut" }}
        >
          <span className="text-accent uppercase tracking-[0.2em] text-sm font-semibold mb-8 block">Research Statement</span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-light leading-tight tracking-tighter text-neutral-400 mix-blend-plus-lighter">
            &ldquo;I am interested in building <span className="text-white font-medium text-gradient">intelligent systems that remain robust under noisy and imperfect real-world conditions</span>, with a focus on multimodal learning, retrieval-augmented generation, and reliable AI.&rdquo;
          </h2>
        </motion.div>
      </div>
    </section>
  );
}
