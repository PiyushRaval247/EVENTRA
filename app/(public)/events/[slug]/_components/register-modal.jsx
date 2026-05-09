"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Loader2, Ticket, CheckCircle, X } from "lucide-react";
import { useConvexMutation } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function RegisterModal({ event, isOpen, onClose }) {
  const router = useRouter();
  const { user } = useUser();
  const [name, setName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(
    user?.primaryEmailAddress?.emailAddress || ""
  );
  const [selectedTier, setSelectedTier] = useState(
    event.ticketTiers?.[0]?.name || ""
  );
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { mutate: registerForEvent, isLoading } = useConvexMutation(
    api.registrations.registerForEvent
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll + stop Lenis smooth scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Stop Lenis from hijacking scroll events
      if (window.__lenis) {
        window.__lenis.stop();
      }
      // Lock background scroll
      const scrollY = window.scrollY;
      document.body.dataset.scrollY = scrollY;
      document.body.style.overflow = "hidden";
    } else {
      // Resume Lenis
      if (window.__lenis) {
        window.__lenis.start();
      }
      // Restore scroll position
      document.body.style.overflow = "";
      const scrollY = parseInt(document.body.dataset.scrollY || "0");
      window.scrollTo(0, scrollY);
    }
    return () => {
      if (window.__lenis) {
        window.__lenis.start();
      }
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const currentTier = event.ticketTiers?.find((t) => t.name === selectedTier);
  const basePrice = currentTier ? currentTier.price : event.ticketPrice || 0;

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
    const promo = event.promoCodes?.find(
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

  const handleViewTicket = () => {
    router.push("/my-tickets");
    onClose();
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center"
      style={{ isolation: "isolate" }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal panel — this is the ONLY scrollable container */}
      <div
        className="relative w-full sm:max-w-md bg-white dark:bg-zinc-900 sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col"
        style={{
          maxHeight: "90dvh",
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
          overscrollBehavior: "contain",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="p-6">
          {isSuccess ? (
            <div className="flex flex-col items-center text-center space-y-4 py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">You&apos;re All Set!</h2>
                <p className="text-muted-foreground">
                  Your registration for{" "}
                  <strong>{selectedTier || "this event"}</strong> is confirmed.
                </p>
              </div>
              <Separator />
              <div className="w-full space-y-2">
                <Button className="w-full gap-2" onClick={handleViewTicket}>
                  <Ticket className="w-4 h-4" />
                  View My Ticket
                </Button>
                <Button variant="outline" className="w-full" onClick={onClose}>
                  Close
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="mb-5 pr-8">
                <h2 className="text-xl font-bold">Register for Event</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Fill in your details to register for{" "}
                  <span className="font-medium">{event.title}</span>
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Tier Selection */}
                {event.ticketTiers && event.ticketTiers.length > 0 && (
                  <div className="space-y-2">
                    <Label>Select Ticket Tier</Label>
                    <div className="grid gap-2">
                      {event.ticketTiers.map((tier) => (
                        <label
                          key={tier.name}
                          className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-colors ${
                            selectedTier === tier.name
                              ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                              : "hover:bg-muted"
                          } ${
                            tier.registrationCount >= tier.capacity
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="tier"
                              value={tier.name}
                              checked={selectedTier === tier.name}
                              onChange={(e) => setSelectedTier(e.target.value)}
                              disabled={tier.registrationCount >= tier.capacity}
                              className="w-4 h-4 accent-purple-600"
                            />
                            <div className="flex flex-col">
                              <span className="font-medium">{tier.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {tier.capacity - tier.registrationCount} left
                              </span>
                            </div>
                          </div>
                          <span className="font-bold">
                            {tier.price === 0 ? "Free" : `₹${tier.price}`}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Promo Code */}
                {(event.ticketType === "paid" ||
                  event.ticketTiers?.some((t) => t.price > 0)) && (
                  <div className="space-y-2">
                    <Label htmlFor="promo">Promo Code</Label>
                    <div className="flex gap-2">
                      <Input
                        id="promo"
                        placeholder="Enter code"
                        value={promoCode}
                        onChange={(e) =>
                          setPromoCode(e.target.value.toUpperCase())
                        }
                        disabled={!!appliedPromo}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={
                          appliedPromo
                            ? () => {
                                setAppliedPromo(null);
                                setPromoCode("");
                              }
                            : handleApplyPromo
                        }
                      >
                        {appliedPromo ? "Remove" : "Apply"}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Pricing Summary */}
                <div className="bg-muted p-4 rounded-xl space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Base Price</span>
                    <span>{basePrice === 0 ? "Free" : `₹${basePrice}`}</span>
                  </div>
                  {appliedPromo && (
                    <div className="flex justify-between text-sm text-green-600 font-medium">
                      <span>Discount ({appliedPromo.code})</span>
                      <span>
                        -
                        {appliedPromo.discountType === "percentage"
                          ? `${appliedPromo.discountValue}%`
                          : `₹${appliedPromo.discountValue}`}
                      </span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total to Pay</span>
                    <span>{finalPrice === 0 ? "Free" : `₹${finalPrice}`}</span>
                  </div>
                  {finalPrice > 0 && (
                    <p className="text-[10px] text-muted-foreground text-center">
                      Payment will be collected offline at the venue.
                    </p>
                  )}
                </div>

                {/* Name */}
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

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    required
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2 pb-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 gap-2 bg-purple-600 hover:bg-purple-700 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Registering...
                      </>
                    ) : (
                      <>
                        <Ticket className="w-4 h-4" />
                        Register
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
