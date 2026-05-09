"use client";

import { useRouter } from "next/navigation";
import { Plus, Loader2, Download, BarChart3 } from "lucide-react";
import Link from "next/link";
import { useConvexQuery, useConvexMutation } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import {
  downloadOrganizerOverallReportCsv,
  downloadOrganizerOverallReportPdf,
} from "@/lib/report-downloads";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import EventCard from "@/components/event-card";
import { AnimatedList, AnimatedItem } from "@/components/animated-list";

export default function MyEventsPage() {
  const router = useRouter();

  const { data: events, isLoading } = useConvexQuery(api.events.getMyEvents);
  const { data: overallReport, isLoading: loadingOverall } = useConvexQuery(api.reports.getOrganizerOverallReport);
  const { mutate: deleteEvent } = useConvexMutation(api.events.deleteEvent);

  const handleDelete = async (eventId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event? This action cannot be undone and will permanently delete the event and all associated registrations."
    );

    if (!confirmed) return;

    try {
      await deleteEvent({ eventId });
      toast.success("Event deleted successfully");
    } catch (error) {
      toast.error(error.message || "Failed to delete event");
    }
  };

  // Navigate to event dashboard instead of event detail
  const handleEventClick = (eventId) => {
    router.push(`/my-events/${eventId}`);
  };

  const handleDownloadOverallCsv = () => {
    if (!overallReport || overallReport.eventStats.length === 0) {
      toast.error("No data available to export");
      return;
    }
    downloadOrganizerOverallReportCsv(overallReport);
    toast.success("Global CSV report downloaded");
  };

  const handleDownloadOverallPdf = () => {
    if (!overallReport || overallReport.eventStats.length === 0) {
      toast.error("No data available to export");
      return;
    }
    downloadOrganizerOverallReportPdf(overallReport);
    toast.success("Global PDF report downloaded");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Events</h1>
            <p className="text-muted-foreground">Manage your created events</p>
          </div>
          
          <div className="flex gap-2 items-center">
            <span className="text-sm font-medium text-muted-foreground hidden sm:inline-block mr-2 flex items-center gap-1">
              <BarChart3 className="w-4 h-4" /> Reports:
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadOverallCsv}
              disabled={loadingOverall || !events?.length}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadOverallPdf}
              disabled={loadingOverall || !events?.length}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              PDF
            </Button>
          </div>
        </div>

        {events?.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto space-y-4">
              <div className="text-6xl mb-4">📅</div>
              <h2 className="text-2xl font-bold">No events yet</h2>
              <p className="text-muted-foreground">
                Create your first event or get invited as staff to start managing
              </p>
              <Button asChild className="gap-2">
                <Link href="/create-event">
                  <Plus className="w-4 h-4" />
                  Create Your First Event
                </Link>
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-12">
            {/* Organized Events */}
            {events.some(e => e.isOwner) && (
              <section>
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  Organized by Me
                  <Badge variant="secondary">{events.filter(e => e.isOwner).length}</Badge>
                </h2>
                <AnimatedList className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.filter(e => e.isOwner).map((event) => (
                    <AnimatedItem key={event._id}>
                      <EventCard
                        event={event}
                        action="event"
                        onClick={() => handleEventClick(event._id)}
                        onDelete={handleDelete}
                      />
                    </AnimatedItem>
                  ))}
                </AnimatedList>
              </section>
            )}

            {/* Assigned Events (Staff) */}
            {events.some(e => !e.isOwner) && (
              <section>
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  Assigned to Me as Staff
                  <Badge variant="secondary">{events.filter(e => !e.isOwner).length}</Badge>
                </h2>
                <AnimatedList className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.filter(e => !e.isOwner).map((event) => (
                    <AnimatedItem key={event._id}>
                      <EventCard
                        event={event}
                        action="event"
                        onClick={() => handleEventClick(event._id)}
                      />
                    </AnimatedItem>
                  ))}
                </AnimatedList>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
