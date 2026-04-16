import { query } from "./_generated/server";
import { v } from "convex/values";

// Helper: resolve current user from auth context
async function resolveCurrentUser(ctx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;
  return await ctx.db
    .query("users")
    .withIndex("by_token", (q) =>
      q.eq("tokenIdentifier", identity.tokenIdentifier)
    )
    .unique();
}

function formatLocation(event) {
  if (event.locationType === "online") return "Online";
  return `${event.city}, ${event.state || event.country}`;
}

function baseEventSummary(event) {
  return {
    eventId: event._id,
    title: event.title,
    category: event.category,
    startDate: event.startDate,
    endDate: event.endDate,
    timezone: event.timezone,
    locationType: event.locationType,
    location: formatLocation(event),
    ticketType: event.ticketType,
    ticketPrice: event.ticketPrice || 0,
    capacity: event.capacity,
  };
}

export const getOrganizerEventReport = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const user = await resolveCurrentUser(ctx);
    if (!user) throw new Error("User not authenticated");

    const event = await ctx.db.get(args.eventId);
    if (!event) throw new Error("Event not found");
    if (event.organizerId !== user._id) {
      throw new Error("Not authorized to download this report");
    }

    const registrations = await ctx.db
      .query("registrations")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();

    const confirmed = registrations.filter((r) => r.status === "confirmed");
    const checkedInCount = confirmed.filter((r) => r.checkedIn).length;
    const totalRegistrations = confirmed.length;
    const pendingCount = totalRegistrations - checkedInCount;
    const checkInRate =
      totalRegistrations > 0
        ? Math.round((checkedInCount / totalRegistrations) * 100)
        : 0;
    const totalRevenue =
      event.ticketType === "paid" && event.ticketPrice
        ? checkedInCount * event.ticketPrice
        : 0;

    return {
      event: baseEventSummary(event),
      metrics: {
        totalRegistrations,
        checkedInCount,
        pendingCount,
        checkInRate,
        totalRevenue,
      },
      attendees: registrations.map((reg) => ({
        attendeeName: reg.attendeeName,
        attendeeEmail: reg.attendeeEmail,
        status: reg.status,
        checkedIn: reg.checkedIn,
        registeredAt: reg.registeredAt,
        checkedInAt: reg.checkedInAt || null,
        qrCode: reg.qrCode,
      })),
    };
  },
});

export const getMyTicketReport = query({
  args: { registrationId: v.id("registrations") },
  handler: async (ctx, args) => {
    const user = await resolveCurrentUser(ctx);
    if (!user) throw new Error("User not authenticated");

    const registration = await ctx.db.get(args.registrationId);
    if (!registration) throw new Error("Registration not found");
    if (registration.userId !== user._id) {
      throw new Error("Not authorized to download this ticket report");
    }

    const event = await ctx.db.get(registration.eventId);
    if (!event) throw new Error("Event not found");

    return {
      registrationId: registration._id,
      attendeeName: registration.attendeeName,
      attendeeEmail: registration.attendeeEmail,
      status: registration.status,
      checkedIn: registration.checkedIn,
      checkedInAt: registration.checkedInAt || null,
      registeredAt: registration.registeredAt,
      qrCode: registration.qrCode,
      event: baseEventSummary(event),
    };
  },
});

export const getMyHistoryReport = query({
  handler: async (ctx) => {
    const user = await resolveCurrentUser(ctx);
    if (!user) {
      return {
        summary: {
          totalRegistrations: 0,
          upcomingCount: 0,
          pastCount: 0,
          cancelledCount: 0,
        },
        rows: [],
      };
    }

    const registrations = await ctx.db
      .query("registrations")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();

    const rows = await Promise.all(
      registrations.map(async (reg) => {
        const event = await ctx.db.get(reg.eventId);
        if (!event) return null;
        return {
          eventTitle: event.title,
          startDate: event.startDate,
          location: formatLocation(event),
          ticketType: event.ticketType,
          status: reg.status,
          checkedIn: reg.checkedIn,
          registeredAt: reg.registeredAt,
          checkedInAt: reg.checkedInAt || null,
          qrCode: reg.qrCode,
        };
      })
    );

    const validRows = rows.filter(Boolean);
    const now = Date.now();
    const totalRegistrations = validRows.length;
    const upcomingCount = validRows.filter((r) => r.startDate >= now).length;
    const pastCount = validRows.filter((r) => r.startDate < now).length;
    const cancelledCount = validRows.filter((r) => r.status === "cancelled").length;

    return {
      summary: {
        totalRegistrations,
        upcomingCount,
        pastCount,
        cancelledCount,
      },
      rows: validRows,
    };
  },
});
