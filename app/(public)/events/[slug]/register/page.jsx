"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Loader2, Ticket, CheckCircle, ArrowLeft, Tag, Shield,
  Calendar, Clock, MapPin, Users, Sparkles
} from "lucide-react";
import { useConvexMutation, useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import Image from "next/image";
import { getCategoryIcon, getCategoryLabel } from "@/lib/data";

export default function RegisterPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();

  const [name, setName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.primaryEmailAddress?.emailAddress || "");
  const [selectedTier, setSelectedTier] = useState(null);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const { data: event, isLoading } = useConvexQuery(api.events.getEventBySlug, {
    slug: params.slug,
  });

  const { mutate: registerForEvent, isLoading: isRegistering } = useConvexMutation(
    api.registrations.registerForEvent
  );

  if (event && selectedTier === null && event.ticketTiers?.length > 0) {
    setSelectedTier(event.ticketTiers[0].name);
  }

  const currentTier = event?.ticketTiers?.find((t) => t.name === selectedTier);
  const basePrice = currentTier ? currentTier.price : event?.ticketPrice || 0;

  let finalPrice = basePrice;
  if (appliedPromo) {
    if (appliedPromo.discountType === "percentage") {
      finalPrice = basePrice * (1 - appliedPromo.discountValue / 100);
    } else {
      finalPrice = Math.max(0, basePrice - appliedPromo.discountValue);
    }
  }

  const handleApplyPromo = () => {
    if (!promoCode.trim()) return;
    const promo = event?.promoCodes?.find(
      (p) =>
        p.code.toUpperCase() === promoCode.toUpperCase() &&
        (!p.expiresAt || p.expiresAt > Date.now())
    );
    if (promo) {
      setAppliedPromo(promo);
      toast.success("Promo code applied!");
    } else {
      toast.error("Invalid or expired promo code");
      setAppliedPromo(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      await registerForEvent({
        eventId: event._id,
        attendeeName: name,
        attendeeEmail: email,
        tierName: selectedTier || undefined,
        promoCode: appliedPromo?.code || undefined,
      });
      setIsSuccess(true);
      toast.success("Registration successful! 🎉");
    } catch (error) {
      toast.error(error.message || "Registration failed");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Event not found.</p>
      </div>
    );
  }

  // ── Success screen ──────────────────────────────────────────────────────
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white px-4">
        <div className="w-full max-w-md text-center space-y-6 py-16">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">You&apos;re Registered!</h1>
            <p className="text-muted-foreground">
              Your spot for <strong>{event.title}</strong> is confirmed.
              {selectedTier && <span className="text-purple-600 font-medium"> ({selectedTier})</span>}
            </p>
          </div>
          <div className="flex flex-col gap-3 pt-2">
            <Button
              className="w-full gap-2 bg-purple-600 hover:bg-purple-700 text-white h-12"
              onClick={() => router.push("/my-tickets")}
            >
              <Ticket className="w-4 h-4" />
              View My Ticket
            </Button>
            <Button
              variant="outline"
              className="w-full h-12"
              onClick={() => router.push(`/events/${params.slug}`)}
            >
              Back to Event
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const hasPaidTiers =
    event.ticketType === "paid" || event.ticketTiers?.some((t) => t.price > 0);

  // ── Main registration page ──────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Top back bar */}
      <div className="w-full border-b bg-white dark:bg-zinc-900/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <span className="text-muted-foreground/40">|</span>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
            {event.title}
          </span>
        </div>
      </div>

      {/* Page body */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="grid lg:grid-cols-[1fr_480px] gap-10 items-start">

          {/* ── LEFT: Event info panel ── */}
          <div className="space-y-6">
            {/* Hero image */}
            {event.coverImage ? (
              <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-md">
                <Image
                  src={event.coverImage}
                  alt={event.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            ) : (
              <div
                className="w-full h-64 md:h-80 rounded-2xl flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${event.themeColor || "#8b5cf6"}20, ${event.themeColor || "#8b5cf6"}05)`,
                  border: `1px solid ${event.themeColor || "#8b5cf6"}30`,
                }}
              >
                <Calendar className="w-16 h-16 opacity-20" style={{ color: event.themeColor || "#8b5cf6" }} />
              </div>
            )}

            {/* Event details card */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border p-6 shadow-sm space-y-5">
              <div>
                <p className="text-xs font-semibold text-purple-600 uppercase tracking-widest mb-1">
                  {getCategoryLabel(event.category)}
                </p>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white leading-snug">
                  {event.title}
                </h1>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-zinc-800 rounded-xl">
                  <Calendar className="w-5 h-5 text-purple-500 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p className="text-sm font-semibold">{format(event.startDate, "EEE, MMM dd, yyyy")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-zinc-800 rounded-xl">
                  <Clock className="w-5 h-5 text-purple-500 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Time</p>
                    <p className="text-sm font-semibold">{format(event.startDate, "h:mm a")} – {format(event.endDate, "h:mm a")}</p>
                  </div>
                </div>
                {event.city && (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-zinc-800 rounded-xl">
                    <MapPin className="w-5 h-5 text-purple-500 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="text-sm font-semibold">{event.city}{event.state ? `, ${event.state}` : ""}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-zinc-800 rounded-xl">
                  <Users className="w-5 h-5 text-purple-500 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Spots Left</p>
                    <p className="text-sm font-semibold">{event.capacity - event.registrationCount} / {event.capacity}</p>
                  </div>
                </div>
              </div>

              {event.description && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">About</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-5">
                    {event.description}
                  </p>
                </div>
              )}
            </div>

            {/* Organizer */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border p-5 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center font-bold text-purple-600 shrink-0 text-lg">
                {event.organizerName?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Organized by</p>
                <p className="font-semibold text-sm">{event.organizerName}</p>
              </div>
              <div className="ml-auto">
                <Sparkles className="w-4 h-4 text-purple-400" />
              </div>
            </div>
          </div>

          {/* ── RIGHT: Registration form ── */}
          <div className="lg:sticky lg:top-24">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border shadow-sm p-6 md:p-8">
              <h2 className="text-xl font-bold mb-1 text-slate-900 dark:text-white">
                Complete Registration
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Fill in your details to secure your spot.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Ticket Tier */}
                {event.ticketTiers && event.ticketTiers.length > 0 && (
                  <div className="space-y-2">
                    <Label className="font-semibold">Select Ticket Tier</Label>
                    <div className="grid gap-2">
                      {event.ticketTiers.map((tier) => {
                        const isSoldOut = tier.registrationCount >= tier.capacity;
                        return (
                          <label
                            key={tier.name}
                            className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all ${
                              selectedTier === tier.name
                                ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                                : "border-border hover:border-purple-300"
                            } ${isSoldOut ? "opacity-50 cursor-not-allowed" : ""}`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="radio"
                                name="tier"
                                value={tier.name}
                                checked={selectedTier === tier.name}
                                onChange={(e) => setSelectedTier(e.target.value)}
                                disabled={isSoldOut}
                                className="w-4 h-4 accent-purple-600"
                              />
                              <div>
                                <p className="font-semibold text-sm">{tier.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {isSoldOut ? "Sold out" : `${tier.capacity - tier.registrationCount} spots left`}
                                </p>
                              </div>
                            </div>
                            <span className="text-base font-bold text-slate-900 dark:text-white">
                              {tier.price === 0 ? "Free" : `₹${tier.price}`}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Promo Code */}
                {hasPaidTiers && (
                  <div className="space-y-2">
                    <Label htmlFor="promo" className="flex items-center gap-2 font-semibold">
                      <Tag className="w-3.5 h-3.5" /> Promo Code
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="promo"
                        placeholder="Enter code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        disabled={!!appliedPromo}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={
                          appliedPromo
                            ? () => { setAppliedPromo(null); setPromoCode(""); }
                            : handleApplyPromo
                        }
                      >
                        {appliedPromo ? "Remove" : "Apply"}
                      </Button>
                    </div>
                    {appliedPromo && (
                      <p className="text-xs text-green-600 font-medium">
                        ✓ &quot;{appliedPromo.code}&quot; applied
                      </p>
                    )}
                  </div>
                )}

                {/* Price Summary */}
                <div className="bg-slate-50 dark:bg-zinc-800 rounded-xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Base price</span>
                    <span>{basePrice === 0 ? "Free" : `₹${basePrice}`}</span>
                  </div>
                  {appliedPromo && (
                    <div className="flex justify-between text-green-600 font-medium">
                      <span>Discount</span>
                      <span>
                        −{appliedPromo.discountType === "percentage"
                          ? `${appliedPromo.discountValue}%`
                          : `₹${appliedPromo.discountValue}`}
                      </span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span className="text-purple-600">
                      {finalPrice === 0 ? "Free" : `₹${finalPrice}`}
                    </span>
                  </div>
                  {finalPrice > 0 && (
                    <p className="text-xs text-muted-foreground text-center pt-1">
                      Payment collected offline at the venue.
                    </p>
                  )}
                </div>

                <Separator />

                {/* Personal Details */}
                <div className="space-y-4">
                  <p className="font-semibold text-sm">Your Details</p>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>

                {/* Trust note */}
                <div className="flex items-start gap-2 text-xs text-muted-foreground bg-slate-50 dark:bg-zinc-800 rounded-lg p-3">
                  <Shield className="w-4 h-4 mt-0.5 shrink-0 text-green-500" />
                  <span>Your details are only shared with the event organizer for your ticket.</span>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full gap-2 bg-purple-600 hover:bg-purple-700 text-white h-12 text-base font-semibold"
                  disabled={isRegistering}
                >
                  {isRegistering ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    <>
                      <Ticket className="w-5 h-5" />
                      Confirm Registration
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
