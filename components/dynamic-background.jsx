"use client";

import { motion } from "framer-motion";

export default function DynamicBackground() {
  return (
    <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none opacity-30">
      {/* Soft Liquid Mesh Gradients for Light Theme */}
      <motion.div 
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -50, 100, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-purple-400/10 blur-[100px] will-change-transform" 
      />
      <motion.div 
        animate={{
          x: [0, -100, 50, 0],
          y: [0, 100, -50, 0],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute bottom-[-10%] right-[-10%] w-[70vw] h-[70vw] rounded-full bg-pink-400/8 blur-[120px] will-change-transform" 
      />
      <motion.div 
        animate={{
          x: [0, 50, -100, 0],
          y: [0, -100, 50, 0],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-[20%] right-[10%] w-[50vw] h-[50vw] rounded-full bg-violet-400/5 blur-[100px] will-change-transform" 
      />
      
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-grid-white opacity-30" />
    </div>
  );
}
