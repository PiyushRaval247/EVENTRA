"use client";

import { Sparkles, CheckCircle2, Crown, Zap, Palette, BarChart3, Globe } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const PRO_FEATURES = [
  { icon: Zap, text: "Unlimited Event Creation", desc: "No limits on your vision" },
  { icon: Palette, text: "Custom Branding", desc: "Themes, colors & custom logos" },
  { icon: Sparkles, text: "Advanced AI Generation", desc: "Powered by Gemini 2.0 Pro" },
  { icon: Globe, text: "Global Edge Delivery", desc: "Instant loads worldwide" },
  { icon: BarChart3, text: "Pro Analytics", desc: "Detailed reports & insights" },
];

export default function UpgradeModal({ isOpen, onClose, trigger = "limit" }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl p-0 overflow-hidden bg-black border-white/10 shadow-[0_0_50px_rgba(6,182,212,0.15)]">
        {/* Top Banner Gradient */}
        <div className="h-2 bg-linear-to-r from-cyan-500 via-purple-500 to-cyan-500 animate-gradient-x" />
        
        <div className="p-8">
          <DialogHeader className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                <Crown className="w-6 h-6 text-cyan-400" />
              </div>
              <DialogTitle className="text-3xl font-black tracking-tighter uppercase text-white">
                Eventra <span className="text-cyan-400 italic">Pro</span>
              </DialogTitle>
            </div>
            <DialogDescription className="text-gray-400 text-lg font-light leading-relaxed">
              {trigger === "header" && "Unlock the full potential of professional event management."}
              {trigger === "limit" && "You've reached your free event limit. Scale up now."}
              {trigger === "color" && "Custom theme colors are exclusive to our Pro architects."}
            </DialogDescription>
          </DialogHeader>

          {/* Pricing Card */}
          <div className="relative group mb-8">
            <div className="absolute -inset-1 bg-linear-to-r from-cyan-500 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative obsidian-card rounded-3xl p-6 border border-white/10 bg-black/40 backdrop-blur-xl">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="text-gray-500 text-xs font-black uppercase tracking-[0.2em] mb-1">Monthly Plan</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-white">$19</span>
                    <span className="text-gray-500 font-medium">/mo</span>
                  </div>
                </div>
                <div className="px-3 py-1 bg-cyan-500/10 text-cyan-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-cyan-500/20">
                  Best Value
                </div>
              </div>

              <div className="space-y-4">
                {PRO_FEATURES.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-1 p-1 bg-white/5 rounded-md border border-white/10">
                      <feature.icon className="w-3 h-3 text-cyan-400" />
                    </div>
                    <div>
                      <div className="text-white text-sm font-bold tracking-tight">{feature.text}</div>
                      <div className="text-gray-500 text-[11px] font-light">{feature.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col gap-3">
            <Button 
              className="w-full py-7 rounded-2xl bg-white text-black hover:bg-cyan-50 font-black text-lg uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
              onClick={() => {
                // Here you would typically redirect to Stripe checkout
                window.location.href = "https://billing.clerk.dev"; // Fallback to Clerk Billing
              }}
            >
              Upgrade to Pro <Sparkles className="ml-2 w-5 h-5 fill-current" />
            </Button>
            <Button 
              variant="ghost" 
              onClick={onClose} 
              className="text-gray-500 hover:text-white font-black uppercase tracking-widest text-[10px]"
            >
              Maybe Later
            </Button>
          </div>
        </div>

        {/* Subtle Decorative Grid */}
        <div className="absolute inset-0 bg-grid-white opacity-[0.03] pointer-events-none" />
      </DialogContent>
    </Dialog>
  );
}
