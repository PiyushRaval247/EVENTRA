/* eslint-disable react-hooks/purity */
"use client";

import { useParams, useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Share2,
  Ticket,
  ExternalLink,
  Loader2,
  CheckCircle,
  Handshake,
} from "lucide-react";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getCategoryIcon, getCategoryLabel } from "@/lib/data";
import ImageCarousel from "./_components/image-carousel";
import FeedbackSection from "./_components/feedback-section";
import ShareCard from "./_components/share-card";
import SwagBagSection from "./_components/swag-bag-section";

// Removed darkenColor as we are moving to glassmorphic ambient designs

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();


  // Fetch event details
  const { data: event, isLoading } = useConvexQuery(api.events.getEventBySlug, {
    slug: params.slug,
  });

  // Check if user is already registered
  const { data: registration } = useConvexQuery(
    api.registrations.checkRegistration,
    event?._id ? { eventId: event._id } : "skip"
  );

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description.slice(0, 100) + "...",
          url: url,
        });
      } catch (error) {
        // User cancelled or error occurred
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleRegister = () => {
    if (!user) {
      toast.error("Please sign in to register");
      return;
    }
    router.push(`/events/${params.slug}/register`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (!event) {
    notFound();
  }

  const isEventFull = event.registrationCount >= event.capacity;
  const isEventPast = event.endDate < Date.now();
  const isOrganizer = user?.id === event.organizerId;

  return (
    <div className="min-h-screen pb-12 pt-6 relative bg-slate-50 dark:bg-slate-950 selection:bg-purple-500/30">
      {/* Ambient Background Glows */}
      <div 
        className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-[120px] opacity-20 pointer-events-none mix-blend-screen"
        style={{ backgroundColor: event.themeColor || "#8b5cf6" }}
      />
      <div 
        className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-[100px] opacity-10 pointer-events-none mix-blend-screen"
        style={{ backgroundColor: event.themeColor || "#6366f1" }}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        {/* Event Title & Info */}
        <div className="mb-8">
          <Badge variant="secondary" className="mb-3 bg-white/50 dark:bg-black/50 backdrop-blur-md border-white/50 dark:border-white/10 shadow-sm">
            {getCategoryIcon(event.category)} {getCategoryLabel(event.category)}
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight text-slate-900 dark:text-white drop-shadow-sm">{event.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{format(event.startDate, "EEEE, MMMM dd, yyyy")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>
                {format(event.startDate, "h:mm a")} -{" "}
                {format(event.endDate, "h:mm a")}
              </span>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative pt-8 px-4">
          <div className="max-w-7xl mx-auto">
            {event.images && event.images.length > 0 ? (
              <ImageCarousel images={event.images} title={event.title} />
            ) : event.coverImage ? (
              <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src={event.coverImage}
                  alt={event.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            ) : (
              <div
                className="h-[300px] md:h-[400px] rounded-3xl flex items-center justify-center relative overflow-hidden shadow-2xl border"
                style={{
                  background: `linear-gradient(135deg, ${event.themeColor || "#8b5cf6"}15, ${event.themeColor || "#8b5cf6"}05)`,
                  borderColor: `${event.themeColor || "#8b5cf6"}30`
                }}
              >
                <div className="absolute inset-0 backdrop-blur-3xl" />
                <div className="relative z-10 p-8 text-center opacity-60 flex flex-col items-center">
                  <Calendar className="w-16 h-16 mb-4" style={{ color: event.themeColor || "#8b5cf6" }} />
                  <p className="text-xl font-bold tracking-widest uppercase" style={{ color: event.themeColor || "#8b5cf6" }}>{event.title}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8 mt-12">
          {/* Main Content */}
          <div className="space-y-8">
            {/* Description */}
            <Card className="pt-0 bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-xl rounded-3xl overflow-hidden transition-all hover:shadow-2xl">
              <CardContent className="pt-8 px-6 md:px-8">
                <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white bg-clip-text">About This Event</h2>
                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {event.description}
                </p>
              </CardContent>
            </Card>

            {/* Location Details */}
            <Card className="pt-0 bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-xl rounded-3xl overflow-hidden transition-all hover:shadow-2xl">
              <CardContent className="pt-8 px-6 md:px-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
                  <MapPin className="w-6 h-6" style={{ color: event.themeColor || "#8b5cf6" }} />
                  Location
                </h2>

                <div className="space-y-3">
                  <p className="font-medium">
                    {event.city}, {event.state || event.country}
                  </p>
                  {event.address && (
                    <p className="text-sm text-muted-foreground">
                      {event.address}
                    </p>
                  )}
                  {(event.venue || event.address || event.city) && (
                    <Button variant="outline" asChild className="gap-2 mt-2">
                      <a
                        href={
                          event.venue?.startsWith("http")
                            ? event.venue
                            : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                [event.venue, event.address, event.city, event.state, event.country]
                                  .filter(Boolean)
                                  .join(" ")
                              )}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View on Map
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Organizer Info */}
            <Card className="pt-0 bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-xl rounded-3xl overflow-hidden transition-all hover:shadow-2xl">
              <CardContent className="pt-8 px-6 md:px-8">
                <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Organizer</h2>
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src="" />
                    <AvatarFallback>
                      {event.organizerName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{event.organizerName}</p>
                    <p className="text-sm text-muted-foreground">
                      Event Organizer
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sponsors Section */}
            {event.sponsors && event.sponsors.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                  <Handshake className="w-8 h-8 text-purple-500" />
                  Our Sponsors
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {event.sponsors.map((sponsor, idx) => (
                    <Card key={idx} className="bg-white/50 dark:bg-white/5 border-0 hover:scale-105 transition-transform">
                      <CardContent className="p-6 flex flex-col items-center justify-center gap-3">
                        <div className="relative w-24 h-12 grayscale hover:grayscale-0 transition-all">
                          <Image src={sponsor.logo} alt={sponsor.name} fill className="object-contain" />
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-sm">{sponsor.name}</p>
                          <Badge variant="secondary" className="text-[10px] uppercase">{sponsor.tier}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Swag Bag Section */}
            <SwagBagSection 
              swagBag={event.swagBag} 
              isRegistered={!!registration || isOrganizer} 
              onRegister={handleRegister}
            />

            {/* Feedback Section */}
            <FeedbackSection 
              eventId={event._id} 
              canLeaveFeedback={isEventPast && registration?.checkedIn && !isOrganizer}
            />
          </div>

          {/* Sidebar - Registration Card */}
          <div className="lg:sticky lg:top-24 h-fit">
            <Card className="overflow-hidden py-0 bg-white/70 dark:bg-black/50 backdrop-blur-2xl border-white/60 dark:border-white/10 shadow-2xl rounded-[2rem]">
              <CardContent className="p-8 space-y-6">
                {/* Price */}
                <div>
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Price</p>
                  <p className="text-4xl font-extrabold text-slate-900 dark:text-white drop-shadow-sm">
                    {event.ticketTiers && event.ticketTiers.length > 0 ? (
                      event.ticketTiers.every((t) => t.price === 0) ? (
                        "Free"
                      ) : (
                        `₹${Math.min(...event.ticketTiers.map((t) => t.price))} - ₹${Math.max(...event.ticketTiers.map((t) => t.price))}`
                      )
                    ) : event.ticketType === "free" ? (
                      "Free"
                    ) : (
                      `₹${event.ticketPrice}`
                    )}
                  </p>
                  {(event.ticketType === "paid" || (event.ticketTiers && event.ticketTiers.some(t => t.price > 0))) && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Pay at event offline
                    </p>
                  )}
                </div>

                <Separator />

                {/* Stats */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">Attendees</span>
                    </div>
                    <p className="font-semibold">
                      {event.registrationCount} / {event.capacity}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">Date</span>
                    </div>
                    <p className="font-semibold text-sm">
                      {format(event.startDate, "MMM dd")}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">Time</span>
                    </div>
                    <p className="font-semibold text-sm">
                      {format(event.startDate, "h:mm a")}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Registration Button */}
                {registration ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">
                        You&apos;re registered!
                      </span>
                    </div>
                    <Button
                      className="w-full gap-2"
                      onClick={() => router.push("/my-tickets")}
                    >
                      <Ticket className="w-4 h-4" />
                      View Ticket
                    </Button>
                  </div>
                ) : isEventPast ? (
                  <Button className="w-full" disabled>
                    Event Ended
                  </Button>
                ) : isEventFull ? (
                  <Button className="w-full" disabled>
                    Event Full
                  </Button>
                ) : isOrganizer ? (
                  <Button
                    className="w-full"
                    onClick={() => router.push(`/events/${event.slug}/manage`)}
                  >
                    Manage Event
                  </Button>
                ) : (
                  <Button className="w-full gap-2" onClick={handleRegister}>
                    <Ticket className="w-4 h-4" />
                    Register for Event
                  </Button>
                )}

                {/* Share Button */}
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={handleShare}
                >
                  <Share2 className="w-4 h-4" />
                  Share Event
                </Button>

                {registration && !isOrganizer && (
                  <div className="pt-4">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-3 tracking-widest text-center">
                      Tell your friends
                    </p>
                    <ShareCard event={event} />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>


    </div>
  );
}
