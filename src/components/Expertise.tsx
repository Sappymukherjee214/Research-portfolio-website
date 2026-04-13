"use client";

import { motion } from "framer-motion";

const skills = [
  "Machine Learning",
  "Computer Vision",
  "Natural Language Processing",
  "Multimodal AI Systems",
  "Retrieval-Augmented Generation (RAG)",
  "Noise-Robust AI Systems"
];

export default function Expertise() {
  return (
    <section className="relative z-30 bg-black/60 backdrop-blur-2xl py-40 px-6 sm:px-12 lg:px-24 border-t border-white/5 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/5 via-black to-black pointer-events-none" />
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-start">
        
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="md:w-1/3"
        >
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 text-gradient">Technical<br/>Expertise</h2>
          <div className="h-1 w-20 bg-accent rounded-full mb-8"></div>
          <p className="text-neutral-400 font-light leading-relaxed">
            Developing state-of-the-art models targeting robustness under noisy inputs and extending the boundaries of multimodal retrieval systems.
          </p>
        </motion.div>

        <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          {skills.map((skill, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ scale: 1.03 }}
              className="px-6 py-5 rounded-2xl border border-white/5 bg-white/5 flex items-center justify-between group cursor-default transition-all duration-300 hover:border-accent/30 hover:bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(46,111,242,0.15)]"
            >
              <span className="font-medium text-neutral-300 group-hover:text-white transition-colors tracking-wide">{skill}</span>
              <div className="w-2 h-2 rounded-full bg-neutral-600 group-hover:bg-accent transition-all duration-500 shadow-[0_0_0_rgba(46,111,242,0)] group-hover:shadow-[0_0_12px_rgba(46,111,242,0.8)] group-hover:scale-150" />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
