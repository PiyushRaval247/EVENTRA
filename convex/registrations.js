import { internal } from "./_generated/api";
import { mutation, query } from "./_generated/server";
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

// Generate unique QR code ID
function generateQRCode() {
  return `EVT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}

// Register for an events
export const registerForEvent = mutation({
  args: {
    eventId: v.id("events"),
    attendeeName: v.string(),
    attendeeEmail: v.string(),
    tierName: v.optional(v.string()),
    promoCode: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await resolveCurrentUser(ctx);
    if (!user) throw new Error("User not authenticated");

    const event = await ctx.db.get(args.eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    // Determine price and tier capacity
    let finalPrice = event.ticketType === "free" ? 0 : (event.ticketPrice || 0);
    let tierToUpdate = null;

    if (args.tierName && event.ticketTiers) {
      const tier = event.ticketTiers.find((t) => t.name === args.tierName);
      if (!tier) throw new Error("Invalid ticket tier");
      if (tier.registrationCount >= tier.capacity) {
        throw new Error(`The ${args.tierName} tier is sold out`);
      }
      finalPrice = tier.price;
      tierToUpdate = args.tierName;
    } else {
      // Global capacity check for single-tier events
      if (event.registrationCount >= event.capacity) {
        throw new Error("Event is full");
      }
    }

    // Apply Promo Code
    if (args.promoCode && event.promoCodes) {
      const promo = event.promoCodes.find(
        (p) =>
          p.code.toUpperCase() === args.promoCode.toUpperCase() &&
          (!p.expiresAt || p.expiresAt > Date.now())
      );
      if (promo) {
        if (promo.discountType === "percentage") {
          finalPrice = finalPrice * (1 - promo.discountValue / 100);
        } else if (promo.discountType === "fixed") {
          finalPrice = Math.max(0, finalPrice - promo.discountValue);
        }
      }
    }

    // Check if user already registered
    const existingRegistration = await ctx.db
      .query("registrations")
      .withIndex("by_event_user", (q) =>
        q.eq("eventId", args.eventId).eq("userId", user._id)
      )
      .unique();

    if (existingRegistration) {
      throw new Error("You are already registered for this event");
    }

    // Generate unique QR code ID
    const qrCode = generateQRCode();
    const registrationId = await ctx.db.insert("registrations", {
      eventId: args.eventId,
      userId: user._id,
      attendeeName: args.attendeeName,
      attendeeEmail: args.attendeeEmail,
      tierName: args.tierName,
      pricePaid: finalPrice,
      promoCodeUsed: args.promoCode,
      qrCode: qrCode,
      checkedIn: false,
      status: "confirmed",
      registeredAt: Date.now(),
    });

    // Update registration counts
    const updateData = {
      registrationCount: event.registrationCount + 1,
    };

    if (tierToUpdate) {
      updateData.ticketTiers = event.ticketTiers.map((t) =>
        t.name === tierToUpdate
          ? { ...t, registrationCount: t.registrationCount + 1 }
          : t
      );
    }

    await ctx.db.patch(args.eventId, updateData);

    // Trigger email sending (asynchronously)
    await ctx.scheduler.runAfter(0, internal.emails.sendTicketEmail, {
      attendeeEmail: args.attendeeEmail,
      attendeeName: args.attendeeName,
      eventTitle: event.title,
      eventDate: new Date(event.startDate).toLocaleString(),
      eventLocation: `${event.city}, ${event.country}`,
      qrCode: qrCode,
    });

    return registrationId;
  },
});

// Check if user is registered for an event
export const checkRegistration = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const user = await resolveCurrentUser(ctx);

    if (!user) return null;

    const registration = await ctx.db
      .query("registrations")
      .withIndex("by_event_user", (q) =>
        q.eq("eventId", args.eventId).eq("userId", user._id)
      )
      .unique();

    return registration;
  },
});

// Get user's registrations (tickets)
export const getMyRegistrations = query({
  handler: async (ctx) => {
    const user = await resolveCurrentUser(ctx);
    if (!user) return [];

    const registrations = await ctx.db
      .query("registrations")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();

    // Fetch event details for each registration
    const registrationsWithEvents = await Promise.all(
      registrations.map(async (reg) => {
        const event = await ctx.db.get(reg.eventId);
        return {
          ...reg,
          event,
        };
      })
    );

    return registrationsWithEvents;
  },
});

// Cancel registration
export const cancelRegistration = mutation({
  args: { registrationId: v.id("registrations") },
  handler: async (ctx, args) => {
    const user = await resolveCurrentUser(ctx);
    if (!user) throw new Error("User not authenticated");

    const registration = await ctx.db.get(args.registrationId);
    if (!registration) {
      throw new Error("Registration not found");
    }

    // Check if user owns this registration
    if (registration.userId !== user._id) {
      throw new Error("You are not authorized to cancel this registration");
    }

    const event = await ctx.db.get(registration.eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    // Update registration status
    await ctx.db.patch(args.registrationId, {
      status: "cancelled",
    });

    // Decrement event registration count
    const updateData = {
      registrationCount: Math.max(0, event.registrationCount - 1),
    };

    // If it was a multi-tier registration, decrement the tier count too
    if (registration.tierName && event.ticketTiers) {
      updateData.ticketTiers = event.ticketTiers.map((t) =>
        t.name === registration.tierName
          ? { ...t, registrationCount: Math.max(0, t.registrationCount - 1) }
          : t
      );
    }

    await ctx.db.patch(registration.eventId, updateData);

    return { success: true };
  },
});

// Get registrations for an event (for organizers)
export const getEventRegistrations = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const user = await resolveCurrentUser(ctx);
    if (!user) throw new Error("User not authenticated");

    const event = await ctx.db.get(args.eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    // Check if user is the organizer or staff
    const isStaff = await ctx.db
      .query("staff")
      .withIndex("by_event_email", (q) =>
        q.eq("eventId", args.eventId).eq("email", user.email)
      )
      .unique();

    if (event.organizerId !== user._id && !isStaff) {
      throw new Error("You are not authorized to view registrations");
    }

    const registrations = await ctx.db
      .query("registrations")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();

    return registrations;
  },
});

// Check-in attendee with QR code
export const checkInAttendee = mutation({
  args: { qrCode: v.string() },
  handler: async (ctx, args) => {
    const user = await resolveCurrentUser(ctx);
    if (!user) throw new Error("User not authenticated");

    const registration = await ctx.db
      .query("registrations")
      .withIndex("by_qr_code", (q) => q.eq("qrCode", args.qrCode))
      .unique();

    if (!registration) {
      return {
        success: false,
        message: "Invalid QR code. Please scan a valid ticket.",
      };
    }

    const event = await ctx.db.get(registration.eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    // Check if user is the organizer or staff with scanner role
    const staffMember = await ctx.db
      .query("staff")
      .withIndex("by_event_email", (q) =>
        q.eq("eventId", registration.eventId).eq("email", user.email)
      )
      .unique();

    const canScan = event.organizerId === user._id || (staffMember && (staffMember.role === "scanner" || staffMember.role === "admin"));

    if (!canScan) {
      throw new Error("You are not authorized to check in attendees");
    }

    // Check if already checked in
    if (registration.checkedIn) {
      return {
        success: false,
        message: "Already checked in",
        registration,
      };
    }

    // Check in
    await ctx.db.patch(registration._id, {
      checkedIn: true,
      checkedInAt: Date.now(),
    });

    return {
      success: true,
      message: "Check-in successful",
      registration: {
        ...registration,
        checkedIn: true,
        checkedInAt: Date.now(),
      },
    };
  },
});
