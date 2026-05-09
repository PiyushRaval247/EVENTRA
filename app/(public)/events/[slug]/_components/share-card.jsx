"use client";

import { useUser } from "@clerk/nextjs";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Share2, Download } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ShareCard({ event }) {
  const { user } = useUser();

  const handleShare = async () => {
    const shareText = `I'm going to ${event.title}! Join me at Eventra! 🚀 #Eventra #${event.category}`;
    const url = `${window.location.origin}/events/${event.slug}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join me at " + event.title,
          text: shareText,
          url: url,
        });
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(`${shareText} ${url}`);
      toast.success("Share link copied!");
    }
  };

  return (
    <Card className="overflow-hidden border border-purple-100 dark:border-purple-900 shadow-lg bg-gradient-to-br from-purple-50/50 via-white to-pink-50/50 dark:from-purple-950/20 dark:via-zinc-950 dark:to-pink-950/20 relative group transition-all hover:shadow-xl">
      <CardContent className="p-6">
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 border border-purple-100 dark:border-purple-800 shadow-sm">
                <AvatarImage src={user?.imageUrl} />
                <AvatarFallback>{user?.fullName?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Attending</span>
                <span className="font-semibold text-sm leading-tight text-slate-800 dark:text-slate-200 line-clamp-1">{user?.fullName || "Guest"}</span>
              </div>
            </div>
            <Badge variant="outline" className="bg-white/60 dark:bg-black/60 backdrop-blur text-[10px] uppercase border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-400 shrink-0">
              {event.category}
            </Badge>
          </div>

          {/* Event Details */}
          <div className="space-y-3 pt-1">
            <h3 className="text-xl font-bold leading-tight line-clamp-3 text-slate-900 dark:text-white">
              {event.title}
            </h3>
            
            <div className="flex items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-400 bg-white/60 dark:bg-black/40 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5 shrink-0">
                <Calendar className="w-3.5 h-3.5 text-purple-500" />
                <span>{format(event.startDate, "MMM dd, yyyy")}</span>
              </div>
              <div className="w-px h-3 bg-border" />
              <div className="flex items-center gap-1.5 min-w-0">
                <MapPin className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                <span className="line-clamp-1">{event.city}</span>
              </div>
            </div>
          </div>

          {/* Bottom Call to Action */}
          <div className="flex items-center justify-between pt-3 border-t border-border/60">
            <p className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 italic tracking-tighter">
              EVENTRA
            </p>
            <Button size="sm" className="rounded-full gap-2 shadow-sm" onClick={handleShare}>
              <Share2 className="w-3.5 h-3.5" />
              Share
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
