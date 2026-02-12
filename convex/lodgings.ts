import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedAppUser } from "./auth";

const lodgingType = v.union(
  v.literal("hotel"),
  v.literal("apartment"),
  v.literal("camp"),
  v.literal("homestay")
);

const approvalStatus = v.union(
  v.literal("pending"),
  v.literal("approved"),
  v.literal("rejected")
);

// List all approved lodgings
export const list = query({
  args: {
    type: v.optional(lodgingType),
  },
  handler: async (ctx, args) => {
    let q = ctx.db.query("lodgings").withIndex("by_status", (q) => q.eq("status", "approved"));

    const lodgings = await q.collect();

    // Filter by type if provided
    if (args.type) {
      return lodgings.filter((l) => l.type === args.type);
    }

    return lodgings;
  },
});

// List all lodgings (including pending, for admin)
export const listAll = query({
  args: {
    status: v.optional(approvalStatus),
  },
  handler: async (ctx, args) => {
    if (args.status) {
      return await ctx.db
        .query("lodgings")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .collect();
    }
    return await ctx.db.query("lodgings").collect();
  },
});

// Get lodgings by owner (business dashboard)
export const byOwner = query({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthenticatedAppUser(ctx);
    if (!user) return [];

    return await ctx.db
      .query("lodgings")
      .withIndex("by_owner", (q) => q.eq("ownerId", user._id))
      .collect();
  },
});

// Get single lodging by ID
export const get = query({
  args: { id: v.id("lodgings") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create lodging
export const create = mutation({
  args: {
    name: v.string(),
    nameAr: v.string(),
    type: lodgingType,
    city: v.string(),
    cityAr: v.string(),
    neighborhood: v.optional(v.string()),
    neighborhoodAr: v.optional(v.string()),
    priceRange: v.optional(v.string()),
    images: v.array(v.string()),
    amenities: v.array(v.string()),
    amenitiesAr: v.array(v.string()),
    description: v.optional(v.string()),
    descriptionAr: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedAppUser(ctx);
    if (!user) throw new Error("Not authenticated");
    if (user.userType !== "business") {
      throw new Error("Only business owners can create lodgings");
    }

    return await ctx.db.insert("lodgings", {
      ...args,
      ownerId: user._id,
      rating: 0,
      status: "pending",
    });
  },
});

// Update lodging
export const update = mutation({
  args: {
    id: v.id("lodgings"),
    name: v.optional(v.string()),
    nameAr: v.optional(v.string()),
    type: v.optional(lodgingType),
    city: v.optional(v.string()),
    cityAr: v.optional(v.string()),
    neighborhood: v.optional(v.string()),
    neighborhoodAr: v.optional(v.string()),
    priceRange: v.optional(v.string()),
    images: v.optional(v.array(v.string())),
    amenities: v.optional(v.array(v.string())),
    amenitiesAr: v.optional(v.array(v.string())),
    description: v.optional(v.string()),
    descriptionAr: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedAppUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const lodging = await ctx.db.get(args.id);
    if (!lodging) throw new Error("Lodging not found");

    // Check ownership
    if (lodging.ownerId !== user._id) {
      throw new Error("Not authorized to update this lodging");
    }

    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    return id;
  },
});

// Delete lodging
export const remove = mutation({
  args: { id: v.id("lodgings") },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedAppUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const lodging = await ctx.db.get(args.id);
    if (!lodging) throw new Error("Lodging not found");

    // Check ownership
    if (lodging.ownerId !== user._id) {
      throw new Error("Not authorized to delete this lodging");
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
});

// Update lodging status (admin only)
export const updateStatus = mutation({
  args: {
    id: v.id("lodgings"),
    status: approvalStatus,
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedAppUser(ctx);
    if (!user) throw new Error("Not authenticated");
    if (user.userType !== "admin") {
      throw new Error("Only admins can update listing status");
    }

    await ctx.db.patch(args.id, { status: args.status });
    return args.id;
  },
});
