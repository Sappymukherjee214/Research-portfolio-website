"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ForceGraph3D = dynamic(() => import("react-force-graph-3d"), { ssr: false });

export default function NetworkGraph() {
  const [data, setData] = useState({ nodes: [], links: [] });

  useEffect(() => {
    // Generate a simple knowledge graph based on their research
    const gData = {
      nodes: [
        { id: "Multimodal AI", group: 1, val: 20 },
        { id: "Computer Vision", group: 1, val: 20 },
        { id: "Robust ML", group: 1, val: 20 },
        { id: "RAG Systems", group: 2, val: 15 },
        { id: "Digital Twin", group: 2, val: 15 },
        { id: "Deepfakes", group: 2, val: 15 },
        { id: "Noise Mitigation", group: 3, val: 10 },
        { id: "Semantic Search", group: 3, val: 10 },
        { id: "Generalization", group: 3, val: 10 },
      ],
      links: [
        { source: "Robust ML", target: "Multimodal AI" },
        { source: "Robust ML", target: "Computer Vision" },
        { source: "Robust ML", target: "Noise Mitigation" },
        { source: "Computer Vision", target: "Deepfakes" },
        { source: "Multimodal AI", target: "RAG Systems" },
        { source: "RAG Systems", target: "Digital Twin" },
        { source: "RAG Systems", target: "Semantic Search" },
        { source: "Multimodal AI", target: "Generalization" },
      ]
    };
    setData(gData as any);
  }, []);

  return (
    <div className="w-full h-96 bg-black/40 rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center relative cursor-move">
      <div className="absolute top-4 left-4 z-10 text-xs tracking-widest text-neutral-400 font-mono uppercase bg-black/50 px-3 py-1 rounded-full backdrop-blur-md">Interactive 3D Knowledge Graph</div>
      <ForceGraph3D
        graphData={data}
        width={800} // This is rough, ideally responsive but OK for MVP
        height={400}
        backgroundColor="rgba(0,0,0,0)"
        nodeRelSize={6}
        nodeAutoColorBy="group"
        linkOpacity={0.3}
        linkColor={() => "rgba(255,255,255,0.2)"}
      />
    </div>
  );
}
