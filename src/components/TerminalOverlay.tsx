"use client";
import { useState, useRef, useEffect } from "react";
import { Terminal, X } from "lucide-react";
import { expertise, projects } from "@/lib/data";
import { audioManager } from "@/utils/audio";

export default function TerminalOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<string[]>(["Welcome to SM-OS v1.0. Type 'help' to see available commands."]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const cmd = input.trim().toLowerCase();
    const newHistory = [...history, `$ ${input}`];
    
    if (cmd === "help") {
      newHistory.push("Available commands: about, skills, projects, clear");
    } else if (cmd === "about") {
      newHistory.push("Saptarshi Mukherjee - Multimodal AI & Robust Vision Researcher.");
    } else if (cmd === "skills") {
      newHistory.push(...expertise.map(s => `> ${s}`));
    } else if (cmd === "projects") {
      newHistory.push(...projects.map(p => `> ${p.title}`));
    } else if (cmd === "clear") {
      setHistory([]);
      setInput("");
      return;
    } else {
      newHistory.push(`Command not found: ${cmd}`);
    }
    setHistory(newHistory);
    setInput("");
    audioManager?.playClick();
  }

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className="fixed top-6 right-6 z-[200] p-3 rounded-xl bg-black/80 border border-white/10 text-green-400 hover:bg-green-400/10 transition-colors backdrop-blur-md hidden md:flex items-center gap-2 text-xs font-mono opacity-60 hover:opacity-100">
        <Terminal size={14} /> [ CLI Mode ]
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[300] bg-black text-green-400 font-mono p-6 sm:p-12 overflow-y-auto w-full h-full">
      <button onClick={() => setIsOpen(false)} aria-label="Close Terminal" title="Close Terminal" className="fixed top-6 right-6 text-green-400 hover:text-white bg-black/50 p-2 rounded">
        <X size={24} />
      </button>
      <div className="max-w-4xl mx-auto flex flex-col justify-end min-h-full pb-20">
        <div className="mb-8">
          <pre className="text-xs sm:text-sm text-green-500/80 hidden sm:block">
{`
   ____  ___  ___  ______ ___  ____  _____ __  __ ____ 
  / __/ / _ |/ _ \/_  __// _ |/ __ \/ ___// / / //  _/ 
 _\ \  / __ / ___/ / /  / __ / , _// /__ / /_/ /_/ /   
/___/ /_/ |/_/    /_/  /_/ |_/_/|_|\___//____//___/    
                                                       
`}
          </pre>
        </div>
        
        {history.map((line, i) => (
          <div key={i} className="mb-2 whitespace-pre-wrap">{line}</div>
        ))}
        <form onSubmit={handleCommand} className="flex gap-2 mt-4 items-center">
          <span className="text-green-500 font-bold">$</span>
          <input 
            type="text" 
            aria-label="Terminal command input"
            title="Terminal command input"
            value={input} 
            onChange={(e) => {
              setInput(e.target.value);
              audioManager?.playTerminal();
            }} 
            className="flex-1 bg-transparent outline-none border-none text-green-400"
            ref={inputRef}
            spellCheck={false}
          />
        </form>
      </div>
    </div>
  );
}
