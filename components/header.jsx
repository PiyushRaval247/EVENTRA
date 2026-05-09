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
            ? "border-b border-purple-500/10 bg-white/70 backdrop-blur-2xl py-3 shadow-lg shadow-purple-500/5" 
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center group shrink-0">
            <span className="text-xl sm:text-2xl md:text-3xl font-[900] tracking-tighter uppercase group-hover:text-purple-600 transition-colors">
              <span className="text-gray-900">Eventra</span><span className="text-purple-600 font-normal animate-pulse">.</span>
            </span>
            {hasPro && (
              <Badge className="bg-linear-to-r from-purple-600 to-pink-500 gap-1 text-white ml-2 md:ml-3 border-0 shadow-lg shadow-purple-500/25 px-1.5 py-0 md:px-2.5 md:py-0.5 text-[10px] md:text-xs">
                <Crown className="w-3 h-3" />
                <span className="hidden sm:inline">Pro</span>
              </Badge>
            )}
          </Link>

          {/* Search & Location - Desktop Only */}
          <div className="hidden lg:flex flex-1 justify-center max-w-xl mx-4 md:mx-12">
            <div className="w-full bg-white/60 backdrop-blur-xl rounded-full border border-purple-500/10 hover:border-purple-500/25 transition-all duration-500 overflow-hidden shadow-lg shadow-purple-500/5">
               <SearchLocationBar />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-4 shrink-0">
            {!hasPro && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUpgradeModal(true)}
                className="hidden sm:flex text-gray-500 hover:text-purple-600 font-bold uppercase tracking-widest text-[10px] px-2"
              >
                Pricing
              </Button>
            )}

            <Button variant="ghost" size="sm" asChild className="text-gray-500 hover:text-purple-600 font-bold uppercase tracking-widest text-[10px] px-2 md:px-3">
              <Link href="/explore">Explore</Link>
            </Button>

            <Authenticated>
              {/* Create Event Button */}
              <div className="magnetic-wrap">
                <Button size="sm" asChild className="flex gap-1 md:gap-2 mr-1 sm:mr-2 md:mr-4 bg-purple-600 text-white hover:bg-purple-700 font-bold transition-all hover:scale-105 shadow-lg shadow-purple-500/25 rounded-full px-2.5 md:px-4">
                  <Link href="/create-event">
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Create Event</span>
                  </Link>
                </Button>
              </div>

              {/* User Button */}
              <div className="magnetic-wrap ml-1 md:ml-2">
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8 md:w-10 md:h-10 border-2 border-purple-500/20 shadow-lg shadow-purple-500/10",
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
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg shadow-purple-500/25">Sign In</Button>
              </SignInButton>
            </Unauthenticated>
          </div>
        </div>

        {/* Mobile Search & Location - Below Header */}
        <div className="md:hidden border-t border-purple-500/10 px-3 py-3">
          <SearchLocationBar />
        </div>

        {isLoading && (
          <div className="absolute bottom-0 left-0 w-full">
            <BarLoader width={"100%"} color="#9A3DF1" />
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
