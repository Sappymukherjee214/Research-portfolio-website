"use client";
import React, { useState } from "react";
import { BookOpen, Check, Copy } from "lucide-react";

export default function BibtexCitation({ projectTitle }: { projectTitle: string }) {
  const [copied, setCopied] = useState(false);

  const bibtex = `@misc{mukherjee${new Date().getFullYear()}${projectTitle.split(' ')[0].toLowerCase()},
  title={${projectTitle}},
  author={Mukherjee, Saptarshi},
  year={${new Date().getFullYear()}},
  url={https://github.com/Sappymukherjee214}
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(bibtex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-6 flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5 transition-colors group-hover:bg-white/5">
      <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
        <BookOpen size={14} />
        <span>BibTeX Cite</span>
      </div>
      <button 
        onClick={handleCopy}
        className="p-1.5 rounded-md hover:bg-white/10 text-neutral-400 hover:text-accent transition-colors"
        aria-label="Copy BibTeX Citation"
        title="Copy BibTeX Citation"
      >
        {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
      </button>
    </div>
  );
}
