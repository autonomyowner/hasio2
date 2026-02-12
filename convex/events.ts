import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedAppUser } from "./auth";

const eventCategory = v.union(
  v.literal("festival"),
  v.literal("conference"),
  v.literal("outdoor"),
  v.literal("indoor"),
  v.literal("seasonal")
);

const approvalStatus = v.union(
  v.literal("pending"),
  v.literal("approved"),
  v.literal("rejected")
);

// List all approved events
export const list = query({
  args: {
    category: v.optional(eventCategory),
  },
  handler: async (ctx, args) => {
    const events = await ctx.db
      .query("events")
      .withIndex("by_status", (q) => q.eq("status", "approved"))
      .collect();

    if (args.category) {
      return events.filter((e) => e.category === args.category);
    }

    return events;
  },
});

// List upcoming events
export const listUpcoming = query({
  args: {},
  handler: async (ctx) => {
    const today = new Date().toISOString().split("T")[0];
    const events = await ctx.db
      .query("events")
      .withIndex("by_status", (q) => q.eq("status", "approved"))
      .collect();

    // Filter future events and sort by date
    return events
      .filter((e) => e.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date));
  },
});

// List all events (including pending, for admin)
export const listAll = query({
  args: {
    status: v.optional(approvalStatus),
  },
  handler: async (ctx, args) => {
    if (args.status) {
      return await ctx.db
        .query("events")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .collect();
    }
    return await ctx.db.query("events").collect();
  },
});

// Get events by owner (business dashboard)
export const byOwner = query({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthenticatedAppUser(ctx);
    if (!user) return [];

    return await ctx.db
      .query("events")
      .withIndex("by_owner", (q) => q.eq("ownerId", user._id))
      .collect();
  },
});

// Get single event by ID
export const get = query({
  args: { id: v.id("events") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create event
export const create = mutation({
  args: {
    title: v.string(),
    titleAr: v.string(),
    category: eventCategory,
    date: v.string(),
    time: v.optional(v.string()),
    location: v.optional(v.string()),
    locationAr: v.optional(v.string()),
    images: v.array(v.string()),
    description: v.optional(v.string()),
    descriptionAr: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedAppUser(ctx);
    if (!user) throw new Error("Not authenticated");
    if (user.userType !== "business") {
      throw new Error("Only business owners can create events");
    }

    return await ctx.db.insert("events", {
      ...args,
      ownerId: user._id,
      status: "pending",
    });
  },
});

// Update event
export const update = mutation({
  args: {
    id: v.id("events"),
    title: v.optional(v.string()),
    titleAr: v.optional(v.string()),
    category: v.optional(eventCategory),
    date: v.optional(v.string()),
    time: v.optional(v.string()),
    location: v.optional(v.string()),
    locationAr: v.optional(v.string()),
    images: v.optional(v.array(v.string())),
    description: v.optional(v.string()),
    descriptionAr: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedAppUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const event = await ctx.db.get(args.id);
    if (!event) throw new Error("Event not found");

    if (event.ownerId !== user._id) {
      throw new Error("Not authorized to update this event");
    }

    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    return id;
  },
});

// Delete event
export const remove = mutation({
  args: { id: v.id("events") },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedAppUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const event = await ctx.db.get(args.id);
    if (!event) throw new Error("Event not found");

    if (event.ownerId !== user._id) {
      throw new Error("Not authorized to delete this event");
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
});

// Update event status (admin only)
export const updateStatus = mutation({
  args: {
    id: v.id("events"),
    status: approvalStatus,
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedAppUser(ctx);
    if (!user) throw new Error("Not authenticated");
    if (user.userType !== "admin") {
      throw new Error("Only admins can update event status");
    }

    await ctx.db.patch(args.id, { status: args.status });
    return args.id;
  },
});
