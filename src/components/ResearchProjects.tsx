"use client";

import React from "react";
import { motion } from "framer-motion";

function Github(props: React.ComponentProps<"svg"> & { size?: number | string }) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.7c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 8 18v4"></path>
    </svg>
  );
}

import { projects } from "@/lib/data";
import BibtexCitation from "./BibtexCitation";


export default function ResearchProjects() {
  return (
    <section className="relative z-30 bg-black/60 backdrop-blur-2xl py-40 px-6 sm:px-12 lg:px-24 border-t border-white/5 overflow-hidden">
      {/* Abstract radial ambient glows */}
      <div className="absolute top-0 left-1/4 w-[800px] height-[800px] h-[800px] rounded-full bg-accent/5 blur-[150px] pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none translate-y-1/2" />
      <div className="max-w-7xl mx-auto">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 text-gradient">Research Projects</h2>
          <p className="text-neutral-400 max-w-2xl text-lg mb-16 font-light">
            A selection of my contributions towards building intelligent, reliable, and robust systems 
            under real-world noise and uncertainty.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group glass rounded-2xl p-8 flex flex-col justify-between hover:bg-white/5 hover:border-white/20 transition-all duration-500 shadow-[0_4px_24px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_40px_rgba(46,111,242,0.15)] relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />
              <div>
                <h3 className="text-xl font-semibold leading-relaxed mb-4 text-neutral-100 group-hover:text-white transition-colors relative z-10 tracking-tight">
                  {project.title}
                </h3>
                <p className="text-neutral-400 font-light text-sm leading-relaxed relative z-10">
                  {project.description}
                </p>
              </div>

              <div className="mt-10 pt-6 border-t border-white/5 relative z-10">
                <a 
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-medium text-neutral-300 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 transition-all group/btn"
                >
                  <Github size={16} className="group-hover/btn:scale-110 transition-transform" />
                  View GitHub
                </a>
                <BibtexCitation projectTitle={project.title} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
