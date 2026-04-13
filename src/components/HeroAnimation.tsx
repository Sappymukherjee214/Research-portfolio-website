"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useScroll, motion, useTransform } from "framer-motion";

const TOTAL_FRAMES = 160;

export default function HeroAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const { scrollY } = useScroll();
  const titleOpacity = useTransform(scrollY, [0, 300, 600], [1, 1, 0]);
  const titleY = useTransform(scrollY, [0, 600], [0, -100]);

  // Preload images
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const paddedIndex = i.toString().padStart(3, "0");
      img.src = `/frames/ezgif-frame-${paddedIndex}.png`;

      img.onload = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) setImagesLoaded(true);
      };
      
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) setImagesLoaded(true);
      };
      
      loadedImages.push(img);
    }
    setImages(loadedImages);
  }, []);

  const drawFrame = useCallback((frameIndex: number) => {
    const context = canvasRef.current?.getContext("2d");
    if (!context || !canvasRef.current) return;

    if (canvasRef.current.width !== window.innerWidth || canvasRef.current.height !== window.innerHeight) {
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
    }

    const img = images[frameIndex];
    if (img && img.complete && img.naturalWidth !== 0) {
      const canvasRatio = canvasRef.current.width / canvasRef.current.height;
      const imgRatio = img.width / img.height;
      let drawWidth = canvasRef.current.width;
      let drawHeight = canvasRef.current.height;
      let offsetX = 0;
      let offsetY = 0;

      if (canvasRatio > imgRatio) {
        drawHeight = drawWidth / imgRatio;
        offsetY = (canvasRef.current.height - drawHeight) / 2;
      } else {
        drawWidth = drawHeight * imgRatio;
        offsetX = (canvasRef.current.width - drawWidth) / 2;
      }

      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    }
  }, [images]);

  const { scrollYProgress } = useScroll();
  const [idleFrame, setIdleFrame] = useState(0);
  
  // Ambient idle animation loop
  useEffect(() => {
    if (!imagesLoaded) return;
    const interval = setInterval(() => {
      setIdleFrame(prev => (prev + 1) % TOTAL_FRAMES);
    }, 50); // Slow idle playback (20fps)
    return () => clearInterval(interval);
  }, [imagesLoaded]);

  // Map scroll progress to frame index
  const scrollFrameIndex = useTransform(scrollYProgress, [0, 0.4], [0, TOTAL_FRAMES - 1]);
  
  // Handle drawing (Priority: Scroll > Idle)
  useEffect(() => {
    if (!imagesLoaded) return;

    const unsubscribe = scrollFrameIndex.on("change", (latest) => {
      drawFrame(Math.floor(latest));
    });

    // If at top (scroll=0), let the idle frame draw
    if (scrollYProgress.get() < 0.01) {
      drawFrame(idleFrame);
    }

    return () => unsubscribe();
  }, [imagesLoaded, drawFrame, scrollFrameIndex, idleFrame, scrollYProgress]);

  return (
    <div className="w-full relative bg-transparent">
      {/* Background Canvas fixed to viewport ALWAYS */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />
        {/* Overlay overlay to darken canvas slightly */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="h-screen w-full flex items-center justify-center relative z-10">
        <motion.div
          style={{ opacity: titleOpacity, y: titleY }}
          className="flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto mix-blend-plus-lighter"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="mb-6 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs uppercase tracking-[0.2em] text-neutral-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]"
          >
            Tier-1 Research Portfolio
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-gradient mb-6 drop-shadow-2xl"
          >
            Noise-Resilient AI Systems
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
            className="text-xl md:text-2xl text-neutral-400 font-light tracking-wide max-w-2xl"
          >
            Robust Multimodal Intelligence under Real-World Uncertainty
          </motion.p>
        </motion.div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
           <span className="text-xs uppercase tracking-[0.3em]">Scroll to explore</span>
           <div className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent" />
        </div>
      </div>
    </div>
  );
}
