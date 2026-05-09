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

// Create a new event
export const createEvent = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    category: v.string(),
    tags: v.array(v.string()),
    startDate: v.number(),
    endDate: v.number(),
    timezone: v.string(),
    locationType: v.union(v.literal("physical"), v.literal("online")),
    venue: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.string(),
    state: v.optional(v.string()),
    country: v.string(),
    capacity: v.number(),
    ticketType: v.union(v.literal("free"), v.literal("paid")),
    ticketPrice: v.optional(v.number()),
    coverImage: v.optional(v.string()),
    images: v.optional(v.array(v.string())),
    sponsors: v.optional(
      v.array(
        v.object({
          name: v.string(),
          logo: v.string(),
          link: v.optional(v.string()),
          tier: v.string(),
        })
      )
    ),
    swagBag: v.optional(
      v.array(
        v.object({
          title: v.string(),
          url: v.string(),
          type: v.union(v.literal("link"), v.literal("file"), v.literal("code")),
          description: v.optional(v.string()),
        })
      )
    ),
    themeColor: v.optional(v.string()),
    hasPro: v.optional(v.boolean()),

    // New fields
    ticketTiers: v.optional(
      v.array(
        v.object({
          name: v.string(),
          price: v.number(),
          capacity: v.number(),
        })
      )
    ),
    promoCodes: v.optional(
      v.array(
        v.object({
          code: v.string(),
          discountType: v.union(v.literal("percentage"), v.literal("fixed")),
          discountValue: v.number(),
          expiresAt: v.optional(v.number()),
        })
      )
    ),
  },
  handler: async (ctx, args) => {
    // VERSION: 1.1.0 - Multi-tier Support
    const hasPro = args.hasPro === true;
    
    try {
      const user = await resolveCurrentUser(ctx);
      if (!user) {
        throw new Error("User not authenticated");
      }

      // SERVER-SIDE CHECK: Verify event limit for Free users
      if (!hasPro && user.freeEventsCreated >= 1) {
        throw new Error(
          "Free event limit reached. Please upgrade to Pro to create more events."
        );
      }

      const defaultColor = "#1e3a8a";
      const themeColor = hasPro ? (args.themeColor || defaultColor) : defaultColor;

      const slug = args.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      // Process ticket tiers to add initial registrationCount
      const ticketTiers = args.ticketTiers?.map(tier => ({
        ...tier,
        registrationCount: 0
      }));

      const eventData = {
        title: args.title,
        description: args.description,
        slug: `${slug}-${Date.now()}`,
        organizerId: user._id,
        organizerName: user.name,
        category: args.category,
        tags: args.tags || [],
        startDate: args.startDate,
        endDate: args.endDate,
        timezone: args.timezone,
        locationType: args.locationType,
        venue: args.venue,
        address: args.address,
        city: args.city,
        state: args.state,
        country: args.country,
        capacity: args.capacity,
        ticketType: args.ticketType,
        ticketPrice: args.ticketPrice,
        coverImage: args.coverImage,
        images: args.images || [],
        sponsors: args.sponsors || [],
        swagBag: args.swagBag || [],
        registrationCount: 0,
        themeColor: themeColor,
        ticketTiers: ticketTiers,
        promoCodes: args.promoCodes,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const eventId = await ctx.db.insert("events", eventData);

      // Update user's free event count if not Pro
      if (!hasPro) {
        await ctx.db.patch(user._id, {
          freeEventsCreated: user.freeEventsCreated + 1,
        });
      }

      return eventId;
    } catch (error) {
      console.error("Convex creation error:", error);
      throw new Error(`Failed to create event: ${error.message}`);
    }
  },
});

// Get event by slug
export const getEventBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const event = await ctx.db
      .query("events")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    return event;
  },
});

// Get events by organizer OR where user is staff
export const getMyEvents = query({
  handler: async (ctx) => {
    const user = await resolveCurrentUser(ctx);
    if (!user) return [];

    // Events organized by me
    const organizedEvents = await ctx.db
      .query("events")
      .withIndex("by_organizer", (q) => q.eq("organizerId", user._id))
      .order("desc")
      .collect();

    // Events where I am staff
    const staffAssignments = await ctx.db
      .query("staff")
      .withIndex("by_email", (q) => q.eq("email", user.email))
      .collect();

    const staffEvents = await Promise.all(
      staffAssignments.map((s) => ctx.db.get(s.eventId))
    );

    // Combine and remove nulls (in case event was deleted)
    const allEvents = [
      ...organizedEvents.map((e) => ({ ...e, isOwner: true })),
      ...staffEvents
        .filter((e) => e !== null && e.organizerId !== user._id)
        .map((e) => ({ ...e, isOwner: false })),
    ];

    return allEvents;
  },
});

// Staff Management
export const addStaff = mutation({
  args: {
    eventId: v.id("events"),
    email: v.string(),
    role: v.union(v.literal("admin"), v.literal("scanner")),
  },
  handler: async (ctx, args) => {
    const user = await resolveCurrentUser(ctx);
    if (!user) throw new Error("User not authenticated");

    const event = await ctx.db.get(args.eventId);
    if (!event) throw new Error("Event not found");

    // Only owner can add staff
    if (event.organizerId !== user._id) {
      throw new Error("Only the event owner can add staff");
    }

    // Check if already staff
    const existing = await ctx.db
      .query("staff")
      .withIndex("by_event_email", (q) =>
        q.eq("eventId", args.eventId).eq("email", args.email)
      )
      .unique();

    if (existing) throw new Error("This user is already a staff member");

    return await ctx.db.insert("staff", {
      eventId: args.eventId,
      email: args.email,
      role: args.role,
      addedAt: Date.now(),
    });
  },
});

export const removeStaff = mutation({
  args: { staffId: v.id("staff") },
  handler: async (ctx, args) => {
    const user = await resolveCurrentUser(ctx);
    if (!user) throw new Error("User not authenticated");

    const staffMember = await ctx.db.get(args.staffId);
    if (!staffMember) throw new Error("Staff member not found");

    const event = await ctx.db.get(staffMember.eventId);
    if (event.organizerId !== user._id) {
      throw new Error("Only the event owner can remove staff");
    }

    await ctx.db.delete(args.staffId);
    return { success: true };
  },
});

export const getEventStaff = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const user = await resolveCurrentUser(ctx);
    if (!user) return [];

    const event = await ctx.db.get(args.eventId);
    if (!event) return [];

    // Check if user is owner or staff to see staff list
    const isStaff = await ctx.db
      .query("staff")
      .withIndex("by_event_email", (q) =>
        q.eq("eventId", args.eventId).eq("email", user.email)
      )
      .unique();

    if (event.organizerId !== user._id && !isStaff) {
      throw new Error("Unauthorized");
    }

    return await ctx.db
      .query("staff")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();
  },
});

// Delete event
export const deleteEvent = mutation({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const user = await resolveCurrentUser(ctx);
    if (!user) throw new Error("User not authenticated");

    const event = await ctx.db.get(args.eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    // Check if user is the organizer
    if (event.organizerId !== user._id) {
      throw new Error("You are not authorized to delete this event");
    }

    // Delete all registrations for this event
    const registrations = await ctx.db
      .query("registrations")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();

    for (const registration of registrations) {
      await ctx.db.delete(registration._id);
    }

    // Delete the event
    await ctx.db.delete(args.eventId);

    // Update free event count if it was a free event
    if (event.ticketType === "free" && user.freeEventsCreated > 0) {
      await ctx.db.patch(user._id, {
        freeEventsCreated: user.freeEventsCreated - 1,
      });
    }

    return { success: true };
  },
});
export const cloneEvent = mutation({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const user = await resolveCurrentUser(ctx);
    if (!user) throw new Error("User not authenticated");

    const original = await ctx.db.get(args.eventId);
    if (!original) throw new Error("Event not found");

    if (original.organizerId !== user._id) {
      throw new Error("Only the organizer can clone this event");
    }

    const {
      _id,
      _creationTime,
      slug,
      registrationCount,
      createdAt,
      updatedAt,
      ticketTiers,
      ...rest
    } = original;

    // Reset registration counts in tiers if they exist
    const clonedTiers = ticketTiers?.map((t) => ({
      ...t,
      registrationCount: 0,
    }));

    const newSlug = `${slug}-copy-${Math.floor(Math.random() * 1000)}`;

    return await ctx.db.insert("events", {
      ...rest,
      title: `${original.title} (Copy)`,
      slug: newSlug,
      registrationCount: 0,
      ticketTiers: clonedTiers,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Feedback
export const addFeedback = mutation({
  args: {
    eventId: v.id("events"),
    rating: v.number(),
    comment: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await resolveCurrentUser(ctx);
    if (!user) throw new Error("User not authenticated");

    // Check if user attended (checked in)
    const registration = await ctx.db
      .query("registrations")
      .withIndex("by_event_user", (q) =>
        q.eq("eventId", args.eventId).eq("userId", user._id)
      )
      .unique();

    if (!registration || !registration.checkedIn) {
      throw new Error("Only attendees who checked in can leave feedback");
    }

    // Check if already left feedback
    const existing = await ctx.db
      .query("feedback")
      .withIndex("by_event_user", (q) =>
        q.eq("eventId", args.eventId).eq("userId", user._id)
      )
      .unique();

    if (existing) throw new Error("You have already left feedback for this event");

    return await ctx.db.insert("feedback", {
      eventId: args.eventId,
      userId: user._id,
      userName: user.name,
      userImage: user.imageUrl,
      rating: args.rating,
      comment: args.comment,
      createdAt: Date.now(),
    });
  },
});

export const getEventFeedback = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("feedback")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .order("desc")
      .collect();
  },
});
