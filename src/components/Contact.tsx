"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mail, FileText, ArrowUpRight } from "lucide-react";

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

export default function Contact() {
  return (
    <section className="relative z-30 bg-black/60 backdrop-blur-2xl py-40 px-6 sm:px-12 lg:px-24 border-t border-white/5 overflow-hidden">
      {/* Glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-accent/5 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-16">

        <div className="md:w-1/2">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 text-gradient">Let&apos;s Connect</h2>
            <p className="text-neutral-400 font-light mb-8 max-w-md">
              Open to research collaborations and R&D opportunities in Multimodal AI and Robust Intelligence.
            </p>

            <a
              href="mailto:mukherjeesaptarshi289@gmail.com"
              className="inline-flex items-center gap-3 text-lg font-medium text-white hover:text-accent transition-colors group"
            >
              <Mail className="group-hover:scale-110 transition-transform" />
              <span>mukherjeesaptarshi289@gmail.com</span>
            </a>
          </motion.div>
        </div>

        <div className="md:w-1/2 flex flex-col sm:flex-row gap-6 w-full justify-end">
          <motion.a
            href="https://github.com/Sappymukherjee214"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center justify-between px-8 py-5 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition-all duration-300 w-full sm:w-auto shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] hover:shadow-[0_8px_30px_rgba(46,111,242,0.15)] group"
          >
            <div className="flex items-center gap-4">
              <Github size={22} className="text-white group-hover:text-accent transition-colors" />
              <span className="font-medium text-lg tracking-tight">GitHub Profile</span>
            </div>
            <ArrowUpRight size={20} className="text-neutral-500 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all md:ml-6" />
          </motion.a>

          <div className="flex flex-col gap-4 w-full sm:w-auto">
            <motion.a
              href="/Saptarshi_Mukherjee_Resume_Research.pdf"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center justify-between px-8 py-5 rounded-2xl bg-white text-black hover:bg-neutral-200 transition-all duration-300 w-full shadow-[0_4px_20px_rgba(255,255,255,0.2)] hover:shadow-[0_8px_30px_rgba(255,255,255,0.3)] group"
            >
              <div className="flex items-center gap-4">
                <FileText size={22} className="text-black group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-lg tracking-tight">Research CV 1</span>
              </div>
              <ArrowUpRight size={20} className="text-neutral-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all md:ml-6" />
            </motion.a>

            <motion.a
              href="/Saptarshi Mukherjee_IIT Jammu_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex items-center justify-between px-8 py-5 rounded-2xl border border-white/20 bg-transparent text-white hover:bg-white/10 transition-all duration-300 w-full group"
            >
              <div className="flex items-center gap-4">
                <FileText size={22} className="text-white group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-lg tracking-tight">Research CV 2</span>
              </div>
              <ArrowUpRight size={20} className="text-neutral-400 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all md:ml-6" />
            </motion.a>

            <motion.a
              href="/Saptarshi Mukherjee_IIT Dharwad_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center justify-between px-8 py-5 rounded-2xl border border-white/10 bg-black/40 text-neutral-300 hover:text-white hover:bg-white/5 transition-all duration-300 w-full group"
            >
              <div className="flex items-center gap-4">
                <FileText size={22} className="text-neutral-400 group-hover:text-white group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-lg tracking-tight">Research CV 3</span>
              </div>
              <ArrowUpRight size={20} className="text-neutral-500 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all md:ml-6" />
            </motion.a>
          </div>
        </div>

      </div>

      <div className="mt-32 pt-8 border-t border-white/10 text-center flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto px-6 gap-4">
        <p className="text-neutral-500 text-sm font-light">
          © {new Date().getFullYear()} Saptarshi Mukherjee. All rights reserved.
        </p>
        <p className="text-neutral-600 text-sm font-light">
          Designed for Advanced Academic R&D.
        </p>
      </div>
    </section>
  );
}
