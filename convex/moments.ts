import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedAppUser } from "./auth";

// List user's moments
export const list = query({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthenticatedAppUser(ctx);
    if (!user) return [];

    return await ctx.db
      .query("moments")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
  },
});

// Get single moment
export const get = query({
  args: { id: v.id("moments") },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedAppUser(ctx);
    if (!user) return null;

    const moment = await ctx.db.get(args.id);
    if (!moment) return null;

    // Verify ownership
    if (moment.userId !== user._id) return null;

    return moment;
  },
});

// Create moment
export const create = mutation({
  args: {
    image: v.string(),
    note: v.optional(v.string()),
    location: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedAppUser(ctx);
    if (!user) throw new Error("Not authenticated");

    return await ctx.db.insert("moments", {
      ...args,
      userId: user._id,
      timestamp: new Date().toISOString(),
    });
  },
});

// Update moment
export const update = mutation({
  args: {
    id: v.id("moments"),
    note: v.optional(v.string()),
    location: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedAppUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const moment = await ctx.db.get(args.id);
    if (!moment) throw new Error("Moment not found");

    if (moment.userId !== user._id) {
      throw new Error("Not authorized to update this moment");
    }

    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    return id;
  },
});

// Delete moment
export const remove = mutation({
  args: { id: v.id("moments") },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedAppUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const moment = await ctx.db.get(args.id);
    if (!moment) throw new Error("Moment not found");

    if (moment.userId !== user._id) {
      throw new Error("Not authorized to delete this moment");
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
});
