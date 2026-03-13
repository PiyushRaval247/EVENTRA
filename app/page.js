"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  Globe, 
  ShieldCheck, 
  Zap, 
  ArrowRight,
  ChevronDown,
  Users,
  Ticket,
  Calendar
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const FeatureCard = ({ icon: Icon, title, desc, className = "", delay = 0 }) => (
  <motion.div
    variants={itemVariants}
    className={`glass rounded-3xl p-8 flex flex-col gap-6 hover:bg-white/[0.05] transition-colors border-white/5 ${className}`}
  >
    <div className="p-4 bg-cyan-500/10 rounded-2xl w-fit border border-cyan-500/20">
      <Icon className="w-8 h-8 text-cyan-400" />
    </div>
    <h3 className="text-2xl font-bold text-white tracking-tight">{title}</h3>
    <p className="text-gray-400 leading-relaxed font-light">{desc}</p>
  </motion.div>
);

export default function LandingPage() {
  return (
    <div className="flex flex-col w-full overflow-x-hidden mesh-gradient min-h-screen -mt-32">
      {/* IMMERSIVE HERO V3 (OBSIDIAN) */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 pt-32 pb-12 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-grid-white opacity-20 pointer-events-none" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse-slow delay-1000" />

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-7xl mx-auto z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
        >
          {/* Left Content (Asymmetric) */}
          <div className="lg:col-span-7 text-left">
            <motion.h1 
              variants={itemVariants}
              className="text-7xl md:text-[120px] font-[950] leading-[0.85] tracking-[-0.06em] mb-6 text-white"
            >
              THE <br />
              <span className="text-gradient-premium">UNREAL</span> <br />
              ERA.
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="max-w-xl text-gray-400 text-xl md:text-2xl font-light mb-8 leading-relaxed tracking-tight"
            >
              The most powerful platform to design, manage, and scale professional events. 
              Accelerated by Gemini AI. Built for the elite.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-6">
              <Link href="/create-event">
                <Button size="xl" className="rounded-2xl px-12 py-8 bg-white text-black hover:bg-cyan-50 font-black text-xl transition-all hover:scale-[1.02] active:scale-95 glow-cyan">
                  Start Building <ArrowRight className="ml-3 w-6 h-6" />
                </Button>
              </Link>
              <Link href="/explore">
                <Button size="xl" variant="ghost" className="rounded-2xl px-10 py-8 text-white border border-white/10 hover:bg-white/5 font-black text-lg tracking-widest uppercase">
                  Explore
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Right Visual (Cinematic Frame) */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-5 relative group"
          >
            <div className="absolute -inset-1 bg-linear-to-r from-cyan-500 to-purple-600 rounded-[42px] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative obsidian-card rounded-[40px] overflow-hidden border border-white/10 shadow-2xl">
              <img 
                src="/hero.gif" 
                alt="Eventra Platform Evolution" 
                className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 scale-[1.01] group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              
              {/* Floating Badge */}
              <div className="absolute bottom-6 left-6 right-6 p-6 glass rounded-2xl border-white/5 backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
                    <Zap className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm tracking-tight">AI Deployment v2.4</div>
                    <div className="text-cyan-400/60 text-[10px] uppercase font-black tracking-widest">Global Node: Active</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* THE BENTO EXPERIENCE */}
      <section className="max-w-7xl mx-auto px-6 w-full py-24">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="flex flex-col gap-16"
        >
          <div className="max-w-3xl">
            <motion.h2 variants={itemVariants} className="text-5xl md:text-8xl font-[950] text-white mb-6 uppercase tracking-[-0.05em] leading-[0.9]">
              ENGINEERED <br /><span className="text-cyan-500 font-light italic">EXCELLENCE.</span>
            </motion.h2>
            <motion.p variants={itemVariants} className="text-gray-400 text-xl font-light tracking-tight">
              A suite of hyper-optimized tools designed for the modern event architect. 
              Zero compromise on power.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
            {/* Bento Item 1: Large (AI) */}
            <motion.div 
              variants={itemVariants}
              className="md:col-span-4 obsidian-card rounded-[40px] p-12 relative overflow-hidden group min-h-[400px] flex flex-col justify-end"
            >
              <div className="absolute top-12 right-12 w-32 h-32 bg-cyan-500/10 rounded-full blur-[60px] group-hover:bg-cyan-500/20 transition-all duration-700" />
              <div className="relative z-10">
                <div className="p-4 bg-white/5 rounded-2xl w-fit mb-8 border border-white/10 group-hover:scale-110 transition-transform duration-500">
                  <Sparkles className="w-8 h-8 text-cyan-400" />
                </div>
                <h3 className="text-4xl font-black text-white mb-4 tracking-tighter uppercase">AI CORE ARCHITECTURE</h3>
                <p className="text-gray-400 text-lg font-light leading-relaxed max-w-xl">
                  Leverage the full power of Gemini 2.0 to generate descriptions, marketing hooks, 
                  and dynamic schedules in under 3 seconds.
                </p>
              </div>
            </motion.div>

            {/* Bento Item 2: Small (Security) */}
            <motion.div 
              variants={itemVariants}
              className="md:col-span-2 obsidian-card rounded-[40px] p-10 flex flex-col items-center justify-center text-center group border border-white/5"
            >
              <div className="p-5 bg-cyan-500/10 rounded-full mb-8 border border-cyan-500/20 group-hover:glow-cyan transition-all duration-500">
                <ShieldCheck className="w-10 h-10 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-black text-white mb-4 tracking-tighter uppercase">FORGED SECURITY</h3>
              <p className="text-gray-500 text-sm font-light leading-relaxed uppercase tracking-widest">
                Encrypted QR Tokens <br /> Instant Verification
              </p>
            </motion.div>

            {/* Bento Item 3: Medium (Global) */}
            <motion.div 
              variants={itemVariants}
              className="md:col-span-3 obsidian-card rounded-[40px] p-10 flex flex-col gap-6 group hover:glow-purple transition-all duration-700"
            >
              <div className="flex justify-between items-start">
                <div className="p-4 bg-purple-500/10 rounded-2xl border border-purple-500/20">
                  <Globe className="w-8 h-8 text-purple-400" />
                </div>
                <span className="px-3 py-1 bg-white/5 text-[9px] font-black uppercase tracking-widest text-purple-400 border border-white/10 rounded-full">Edge Ready</span>
              </div>
              <h3 className="text-3xl font-black text-white tracking-tighter uppercase">GLOBAL SCALE</h3>
              <p className="text-gray-400 font-light">
                High-performance delivery ensuring your event pages load instantly for users across 140+ countries.
              </p>
            </motion.div>

            {/* Bento Item 4: Medium (Realtime) */}
            <motion.div 
              variants={itemVariants}
              className="md:col-span-3 obsidian-card rounded-[40px] p-10 flex flex-col gap-6 group hover:glow-cyan transition-all duration-700"
            >
              <div className="flex justify-between items-start">
                <div className="p-4 bg-cyan-500/10 rounded-2xl border border-cyan-500/20">
                  <Zap className="w-8 h-8 text-cyan-400" />
                </div>
              </div>
              <h3 className="text-3xl font-black text-white tracking-tighter uppercase">LIVE ENGINE</h3>
              <p className="text-gray-400 font-light">
                Real-time attendee tracking and instant ticketing updates. Monitor your event lifecycle as it happens.
              </p>
              <div className="mt-auto h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-linear-to-r from-cyan-500 to-purple-500 animate-pulse" />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* THE LIFECYCLE SCROLLYTELLING */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full bg-linear-to-b from-transparent via-cyan-500/20 to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center mb-32"
          >
            <h2 className="text-6xl md:text-9xl font-[950] text-white tracking-[-0.06em] uppercase">THE <span className="text-gradient">LIFECYCLE.</span></h2>
          </motion.div>

          <div className="space-y-40">
            {[
              { 
                step: "01", 
                title: "AUTOMATED GENESIS", 
                desc: "Describe your vision in natural language. Gemini AI architect the foundation—schedules, descriptions, and metadata—in real-time.",
                icon: Sparkles,
                image: "/hero.png",
                align: "left"
              },
              { 
                step: "02", 
                title: "HYPER-POLISH", 
                desc: "Elite refinement via our high-end design system. Every pixel is calculated. Every interaction is measured.",
                icon: Zap,
                image: "/workflow-mockup.png",
                align: "right"
              },
              { 
                step: "03", 
                title: "INSTANT SYNC", 
                desc: "Deploy to global edge nodes immediately. Secure ticketing, real-time analytics, and attendee orchestration on one unified board.",
                icon: Globe,
                image: "/hero.png",
                align: "left"
              },
            ].map((s, i) => (
              <div key={i} className={`flex flex-col lg:flex-row gap-20 items-center ${s.align === 'right' ? 'lg:flex-row-reverse' : ''}`}>
                <motion.div 
                  initial={{ opacity: 0, x: s.align === 'left' ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="lg:w-1/2"
                >
                  <div className="flex items-center gap-6 mb-8">
                    <span className="text-5xl font-black text-white/5 tracking-tighter italic">{s.step}</span>
                    <div className="h-[2px] w-12 bg-cyan-500/30" />
                    <s.icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h3 className="text-4xl md:text-6xl font-[950] text-white mb-8 tracking-tighter uppercase leading-none">{s.title}</h3>
                  <p className="text-gray-400 text-xl font-light leading-relaxed max-w-lg mb-10 tracking-tight">
                    {s.desc}
                  </p>
                  <div className="flex gap-4">
                    <div className="h-1 w-20 bg-cyan-500/50 rounded-full" />
                    <div className="h-1 w-12 bg-white/5 rounded-full" />
                    <div className="h-1 w-8 bg-white/5 rounded-full" />
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  className="lg:w-1/2 relative group"
                >
                  <div className="absolute -inset-2 bg-linear-to-tr from-cyan-500/10 to-purple-500/10 rounded-[44px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="relative obsidian-card rounded-[40px] overflow-hidden border border-white/5 p-4 shadow-3xl">
                    <img 
                      src={s.image} 
                      alt={s.title} 
                      className="w-full h-auto aspect-video object-cover rounded-[24px] opacity-70 group-hover:opacity-100 transition-all duration-700 scale-100 group-hover:scale-105"
                    />
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="max-w-4xl mx-auto px-6 w-full py-32">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter uppercase font-black tracking-tighter uppercase">Frequently <br /><span className="text-cyan-500">Asked</span></h2>
          <p className="text-gray-400 text-lg font-light">Your questions, addressed with clarity.</p>
        </motion.div>

        <div className="space-y-4">
          {[
            { q: "How does AI builder work?", a: "Simply provide a brief description of your event, and Gemini AI generates the full schedule, description, and marketing plan in seconds." },
            { q: "Is ticketing secure?", a: "Yes. Every ticket uses an encrypted QR code system that we validate on-site using our specialized attendee portal." },
            { q: "Can I host global events?", a: "Absolutely. Our infrastructure is built for scale, supporting high-traffic event pages and international payment processing." },
            { q: "How much does it cost?", a: "Start for free with basic features. Pro plans offer advanced AI credits and custom branding options." },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="glass p-6 rounded-3xl border-white/5 hover:bg-white/[0.03] transition-colors cursor-pointer group"
            >
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors tracking-tight">{item.q}</h4>
                <ChevronDown className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
              </div>
              <div className="max-h-0 overflow-hidden group-hover:max-h-40 transition-all duration-500">
                <p className="text-gray-400 font-light mt-4 pt-4 border-t border-white/5 leading-relaxed">
                  {item.a}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-6 w-full py-24">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative px-12 py-24 rounded-[60px] glass-dark text-white overflow-hidden text-center border-white/5"
        >
          <div className="absolute inset-0 bg-grid-white opacity-20" />
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px]" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]" />
          
          <h2 className="relative z-10 text-5xl md:text-7xl font-black tracking-tighter uppercase mb-12">
            Build Your <br />Next <span className="text-cyan-400">Era</span>
          </h2>
          <Link href="/create-event" className="relative z-10">
            <Button size="xl" className="rounded-full px-16 py-8 bg-white text-black hover:bg-cyan-50 font-bold text-2xl uppercase transition-transform hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.15)]">
              Launch Eventra <ArrowRight className="ml-4 w-10 h-10" />
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}

