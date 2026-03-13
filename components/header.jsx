"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Building, Crown, Plus, Sparkles, Ticket } from "lucide-react";
import { SignInButton, useAuth, UserButton, useUser } from "@clerk/nextjs";
import { Authenticated, Unauthenticated } from "convex/react";
import { BarLoader } from "react-spinners";
import { useStoreUser } from "@/hooks/use-store-user";
import { useOnboarding } from "@/hooks/use-onboarding";
import OnboardingModal from "./onboarding-modal";
import SearchLocationBar from "./search-location-bar";
import { Button } from "@/components/ui/button";
import UpgradeModal from "./upgrade-modal";
import { Badge } from "./ui/badge";

export default function Header() {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { isLoading } = useStoreUser();
  const { showOnboarding, handleOnboardingComplete, handleOnboardingSkip } =
    useOnboarding();

  const { has } = useAuth();
  const hasPro = has?.({ plan: "pro" });

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? "border-b border-white/10 bg-black/40 backdrop-blur-3xl py-3" 
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <span className="text-white text-3xl font-[900] tracking-tighter uppercase group-hover:text-cyan-400 transition-colors">
              Eventra<span className="text-cyan-400 font-normal animate-pulse">.</span>
            </span>
            {hasPro && (
              <Badge className="bg-linear-to-r from-cyan-500 to-purple-500 gap-1 text-white ml-3 border-0 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                <Crown className="w-3 h-3" />
                Pro
              </Badge>
            )}
          </Link>

          {/* Search & Location - Desktop Only */}
          <div className="hidden md:flex flex-1 justify-center max-w-xl mx-12">
            <div className="w-full glass rounded-full border-white/5 hover:border-cyan-500/30 transition-all duration-500 overflow-hidden group shadow-2xl">
               <SearchLocationBar />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {!hasPro && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUpgradeModal(true)}
                className="text-gray-400 hover:text-white font-black uppercase tracking-widest text-[10px]"
              >
                Pricing
              </Button>
            )}

            <Button variant="ghost" size="sm" asChild className="text-gray-400 hover:text-white font-black uppercase tracking-widest text-[10px]">
              <Link href="/explore">Explore</Link>
            </Button>

            <Authenticated>
              {/* Create Event Button */}
              <div className="magnetic-wrap">
                <Button size="sm" asChild className="flex gap-2 mr-4 bg-white text-black hover:bg-cyan-50 font-bold transition-transform hover:scale-105">
                  <Link href="/create-event">
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Create Event</span>
                  </Link>
                </Button>
              </div>

              {/* User Button */}
              <div className="magnetic-wrap ml-4">
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10 border-2 border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.2)]",
                    },
                  }}
                >
                  <UserButton.MenuItems>
                    <UserButton.Link
                      label="My Tickets"
                      labelIcon={<Ticket size={16} />}
                      href="/my-tickets"
                    />
                    <UserButton.Link
                      label="My Events"
                      labelIcon={<Building size={16} />}
                      href="/my-events"
                    />
                    <UserButton.Action label="manageAccount" />
                  </UserButton.MenuItems>
                </UserButton>
              </div>
            </Authenticated>

            <Unauthenticated>
              <SignInButton mode="modal">
                <Button size="sm">Sign In</Button>
              </SignInButton>
            </Unauthenticated>
          </div>
        </div>

        {/* Mobile Search & Location - Below Header */}
        <div className="md:hidden border-t px-3 py-3">
          <SearchLocationBar />
        </div>

        {isLoading && (
          <div className="absolute bottom-0 left-0 w-full">
            <BarLoader width={"100%"} color="#a855f7" />
          </div>
        )}
      </nav>

      {/* Onboarding Modal */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={handleOnboardingSkip}
        onComplete={handleOnboardingComplete}
      />

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        trigger="header"
      />
    </>
  );
}
