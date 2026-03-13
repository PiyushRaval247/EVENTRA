"use client";

import { motion } from "framer-motion";

export default function DynamicBackground() {
  return (
    <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none opacity-40">
      {/* Liquid Mesh Gradients with Framer Motion */}
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
        className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-cyan-600/10 blur-[80px] will-change-transform" 
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
        className="absolute bottom-[-10%] right-[-10%] w-[70vw] h-[70vw] rounded-full bg-purple-600/10 blur-[100px] will-change-transform" 
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
        className="absolute top-[20%] right-[10%] w-[50vw] h-[50vw] rounded-full bg-indigo-600/5 blur-[80px] will-change-transform" 
      />
      <motion.div 
        animate={{
          x: [0, -50, 50, 0],
          y: [0, 50, -100, 0],
        }}
        transition={{
          duration: 45,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute bottom-[20%] left-[10%] w-[40vw] h-[40vw] rounded-full bg-blue-600/10 blur-[80px] will-change-transform" 
      />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.03] bg-[length:50px_50px]" />
      
      {/* Depth Layer */}
      <div className="absolute inset-0 bg-radial-[at_50%_50%,transparent_0%,rgba(0,0,0,0.5)_100%]" />
    </div>
  );
}
