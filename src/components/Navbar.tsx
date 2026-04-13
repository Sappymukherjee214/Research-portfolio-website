"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { Menu, X, Cpu, Globe, Database, Shield } from "lucide-react";

const navLinks = [
  { name: "Vision", href: "#vision" },
  { name: "Research", href: "#projects" },
  { name: "Network", href: "#network" },
  { name: "Expertise", href: "#expertise" },
  { name: "Assistant", href: "#assistant" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [scrolled, setScrolled] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Active section detection
      const sections = navLinks.map(link => link.href.substring(1));
      const current = sections.find(section => {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          return rect.top >= -200 && rect.top <= 400;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id.substring(1));
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled ? 'py-4' : 'py-8'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          
          {/* Logo / Title */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 group cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center border border-accent/30 group-hover:bg-accent/30 transition-all duration-300">
              <Cpu className="text-accent" size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold tracking-tighter text-lg leading-none">SM-RESEARCH</span>
              <span className="text-[10px] text-neutral-500 font-mono tracking-widest uppercase">System Operational</span>
            </div>
          </motion.div>

          {/* Desktop Navigation - Pill Style */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="hidden lg:flex items-center px-2 py-1.5 rounded-full border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl relative"
          >
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                className={`relative px-5 py-2 text-sm font-medium transition-colors duration-300 ${
                  activeSection === link.href.substring(1) ? 'text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {activeSection === link.href.substring(1) && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-white/5 rounded-full border border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
                    transition={{ type: "spring", duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{link.name}</span>
              </button>
            ))}
            
            {/* Scroll Progress in Pill */}
            <motion.div 
              style={{ scaleX }}
              className="absolute bottom-0 left-4 right-4 h-[1px] bg-accent origin-left opacity-30" 
            />
          </motion.div>

          {/* System Status Indicators */}
          <div className="hidden lg:flex items-center gap-6 text-[10px] font-mono text-neutral-500">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span>LATENCY: 12ms</span>
            </div>
            <div className="flex items-center gap-2 border-l border-white/10 pl-6">
              <Shield size={12} className="text-accent/60" />
              <span>SSL: VERIFIED</span>
            </div>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="lg:hidden p-2 text-neutral-400 hover:text-white transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-2xl border-b border-white/10 overflow-hidden"
            >
              <div className="p-8 flex flex-col gap-6">
                {navLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => scrollToSection(link.href)}
                    className="text-2xl font-bold tracking-tighter text-neutral-400 hover:text-white text-left transition-colors"
                  >
                    {link.name}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
