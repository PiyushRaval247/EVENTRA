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
  Users,
  Ticket,
  Calendar,
  Megaphone,
  Video,
  PenTool,
  MessageSquare,
  Lightbulb,
  Upload,
  Target,
  Palette,
  Rocket,
  Star,
  ChevronRight
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function LandingPage() {
  return (
    <div className="flex flex-col w-full overflow-x-hidden min-h-screen -mt-32" style={{ background: "#f8f9fe" }}>
      
      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SECTION 1: HERO — "AI Made Accessible for Professional Events" */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center px-6 pt-40 pb-16 overflow-hidden text-center">
        {/* Subtle background gradients */}
        <div className="absolute top-[-15%] left-[-10%] w-[45%] h-[45%] bg-purple-400/8 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-400/6 rounded-full blur-[120px]" />

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-4xl mx-auto z-10 flex flex-col items-center"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-7xl lg:text-[80px] font-[800] leading-[1.05] tracking-[-0.03em] text-gray-900 mb-6"
          >
            AI Made Accessible<br />
            <span className="text-gradient-premium">for Professional Events</span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="max-w-2xl text-gray-500 text-lg md:text-xl font-normal mb-10 leading-relaxed"
          >
            Eventra uses Gemini AI to help you design, manage, and scale events effortlessly. 
            From automated descriptions to real-time attendee tracking, we handle the complexity so you can focus on creating unforgettable experiences.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 justify-center mb-12">
            <Link href="/create-event">
              <Button size="lg" className="rounded-full px-8 py-6 bg-purple-600 text-white hover:bg-purple-700 font-semibold text-base transition-all hover:scale-[1.02] shadow-lg shadow-purple-500/25">
                Get Started Free <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/explore">
              <Button size="lg" variant="outline" className="rounded-full px-8 py-6 border-gray-200 text-gray-700 hover:bg-purple-50 hover:border-purple-200 font-semibold text-base">
                See How It Works
              </Button>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col items-center gap-3">
            <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Trusted by event professionals at</p>
            <div className="flex items-center gap-8 opacity-40">
              <span className="text-xl font-bold text-gray-400 tracking-tight">Google</span>
              <span className="text-xl font-bold text-gray-400 tracking-tight">Microsoft</span>
              <span className="text-xl font-bold text-gray-400 tracking-tight">Stripe</span>
              <span className="text-xl font-bold text-gray-400 tracking-tight hidden sm:block">Vercel</span>
              <span className="text-xl font-bold text-gray-400 tracking-tight hidden md:block">Figma</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SECTION 2: "Eventra is built for you" — Role Cards */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-6 w-full pt-16 pb-4">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={containerVariants}
          className="flex flex-col items-center gap-16"
        >
          <motion.div variants={itemVariants} className="text-center">
            <h2 className="text-4xl md:text-5xl font-[800] text-gray-900 tracking-[-0.03em] mb-4">
              Eventra is built for <span className="text-gradient-premium">you</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">Tailored AI tools for every role in the event ecosystem.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {[
              {
                icon: Calendar,
                title: "Event Planner",
                desc: "Automate logistics, venue scouting summaries, and run-of-show drafting with AI-powered assistance.",
                color: "purple",
              },
              {
                icon: Megaphone,
                title: "Marketing Manager",
                desc: "Generate multichannel campaigns and speaker announcements instantly with brand-aligned copy.",
                color: "pink",
              },
              {
                icon: Video,
                title: "Content Producer",
                desc: "Transcribe sessions and repurpose long-form video into social clips, blog posts, and highlights.",
                color: "violet",
              },
            ].map((role, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="bg-white rounded-2xl p-8 border border-purple-500/5 shadow-sm hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-500 group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${
                  role.color === "purple" ? "bg-purple-100 text-purple-600" :
                  role.color === "pink" ? "bg-pink-100 text-pink-600" :
                  "bg-violet-100 text-violet-600"
                }`}>
                  <role.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">{role.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{role.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SECTION 4: "Built for every stage of your event" */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-6 w-full py-12">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={containerVariants}
          className="flex flex-col gap-16"
        >
          <motion.div variants={itemVariants}>
            <h2 className="text-4xl md:text-5xl font-[800] text-gray-900 tracking-[-0.03em] mb-4">
              Built for every stage of your event
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: PenTool,
                title: "Content Creation",
                desc: "Draft bios, session titles, and abstract descriptions in seconds using Gemini AI.",
              },
              {
                icon: Zap,
                title: "Repurpose",
                desc: "Turn one 60-minute session into 20 LinkedIn posts and 5 blog entries automatically.",
              },
              {
                icon: Lightbulb,
                title: "Brainstorm",
                desc: "Ideate themes, giveaway items, and networking icebreakers with AI-powered creativity.",
              },
              {
                icon: MessageSquare,
                title: "Engagement",
                desc: "Custom chatbots that handle attendee FAQs 24/7 on your event site.",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="bg-white rounded-2xl p-8 border border-purple-500/5 shadow-sm hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-500 group flex flex-col"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-5">
                  <feature.icon className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2 tracking-tight">{feature.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1">{feature.desc}</p>
                <Link href="/explore" className="inline-flex items-center gap-2 text-purple-600 font-semibold text-sm group-hover:gap-3 transition-all">
                  Explore <ChevronRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SECTION 5: "Build custom AI agents for your specific workflows" */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="w-full py-24" style={{ background: "linear-gradient(180deg, #f8f9fe 0%, #f0ecfe 100%)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={containerVariants}
            className="flex flex-col lg:flex-row gap-16 items-center"
          >
            {/* Left: Steps */}
            <div className="lg:w-1/2 flex flex-col gap-4">
              <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-[800] text-gray-900 tracking-[-0.03em] mb-8">
                Build custom AI agents for your specific workflows
              </motion.h2>

              {[
                {
                  icon: Upload,
                  step: "01",
                  title: "Connect Data",
                  desc: "Upload transcripts, brand guidelines, or event agendas safely.",
                },
                {
                  icon: Target,
                  step: "02",
                  title: "Define Goals",
                  desc: "Tell your agent what to output: emails, summaries, or tweets.",
                },
                {
                  icon: Palette,
                  step: "03",
                  title: "Set Tone",
                  desc: "Apply your brand's unique voice and style protocols.",
                },
                {
                  icon: Rocket,
                  step: "04",
                  title: "Launch & Automate",
                  desc: "Deploy your agent across your team or event dashboard.",
                },
              ].map((step, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="flex items-start gap-5 p-5 rounded-xl hover:bg-white/80 transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-purple-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold shadow-md shadow-purple-500/20">
                    {step.step}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-gray-900 mb-1">{step.title}</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}

              <motion.div variants={itemVariants} className="mt-4">
                <Link href="/create-event">
                  <Button className="rounded-full px-8 py-6 bg-purple-600 text-white hover:bg-purple-700 font-semibold shadow-lg shadow-purple-500/25">
                    Start Building <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* Right: Mockup */}
            <motion.div 
              variants={itemVariants}
              className="lg:w-1/2 relative group"
            >
              <div className="absolute -inset-3 bg-linear-to-tr from-purple-500/10 to-pink-500/10 rounded-[36px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative bg-white rounded-[24px] overflow-hidden border border-purple-500/10 shadow-2xl shadow-purple-500/10 p-3">
                <img 
                  src="/hero.png" 
                  alt="AI Workflow Builder" 
                  className="w-full h-auto rounded-[18px] object-cover"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SECTION 6: "Voices of the Community" — Testimonials */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-6 w-full py-24">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={containerVariants}
          className="flex flex-col items-center gap-16"
        >
          <motion.div variants={itemVariants} className="text-center">
            <h2 className="text-4xl md:text-5xl font-[800] text-gray-900 tracking-[-0.03em] mb-4">
              Voices of the <span className="text-gradient-premium">Community</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {[
              {
                name: "Sarah Chen",
                role: "Director of Events, GlobalTech",
                avatar: "SC",
                quote: "Eventra has reduced our content drafting time by 80%. It's like having five senior copywriters on the team.",
                stars: 5,
              },
              {
                name: "James Wilson",
                role: "VP Marketing, ScaleUp",
                avatar: "JW",
                quote: "The ROI was immediate. Our post-event engagement metrics tripled since we started using Eventra's AI tools.",
                stars: 5,
              },
              {
                name: "Elena Rodriguez",
                role: "Lead Content Strategist, Nexus",
                avatar: "ER",
                quote: "The accuracy and brand alignment are world-class. It's the first AI tool that actually 'gets' our voice.",
                stars: 5,
              },
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="bg-white rounded-2xl p-8 border border-purple-500/5 shadow-sm hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-500"
              >
                <div className="flex items-center gap-1 mb-5">
                  {[...Array(testimonial.stars)].map((_, s) => (
                    <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xs">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-gray-900">{testimonial.name}</h5>
                    <p className="text-xs text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SECTION 7: CTA Banner */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-6 w-full py-12 pb-24">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative px-12 py-20 rounded-[32px] bg-linear-to-br from-purple-600 via-violet-600 to-fuchsia-600 text-white overflow-hidden text-center"
        >
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-[80px]" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-pink-400/15 rounded-full blur-[80px]" />
          
          <p className="relative z-10 text-white/70 text-sm font-medium mb-4">Join 10,000+ event professionals</p>
          <h2 className="relative z-10 text-4xl md:text-5xl font-[800] tracking-[-0.03em] mb-8">
            Revolutionize your events<br />with Eventra AI
          </h2>
          <Link href="/create-event" className="relative z-10">
            <Button size="lg" className="rounded-full px-10 py-7 bg-white text-purple-700 hover:bg-purple-50 font-semibold text-lg transition-transform hover:scale-105 shadow-2xl shadow-black/20">
              Get Started Free <ArrowRight className="ml-3 w-6 h-6" />
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
