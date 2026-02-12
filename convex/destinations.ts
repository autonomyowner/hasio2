import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedAppUser } from "./auth";

const destinationCategory = v.union(
  v.literal("historical"),
  v.literal("natural"),
  v.literal("cultural"),
  v.literal("recreational"),
  v.literal("religious")
);

const approvalStatus = v.union(
  v.literal("pending"),
  v.literal("approved"),
  v.literal("rejected")
);

// List all approved destinations
export const list = query({
  args: {
    category: v.optional(destinationCategory),
    featured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const destinations = await ctx.db
      .query("destinations")
      .withIndex("by_status", (q) => q.eq("status", "approved"))
      .collect();

    let filtered = destinations;

    if (args.category) {
      filtered = filtered.filter((d) => d.category === args.category);
    }

    if (args.featured !== undefined) {
      filtered = filtered.filter((d) => d.featured === args.featured);
    }

    return filtered;
  },
});

// List featured destinations (for home screen)
export const listFeatured = query({
  args: {},
  handler: async (ctx) => {
    const destinations = await ctx.db
      .query("destinations")
      .withIndex("by_status", (q) => q.eq("status", "approved"))
      .collect();

    return destinations.filter((d) => d.featured === true);
  },
});

// List all destinations (including pending, for admin)
export const listAll = query({
  args: {
    status: v.optional(approvalStatus),
  },
  handler: async (ctx, args) => {
    if (args.status) {
      return await ctx.db
        .query("destinations")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .collect();
    }
    return await ctx.db.query("destinations").collect();
  },
});

// Get destinations by owner (business dashboard)
export const byOwner = query({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthenticatedAppUser(ctx);
    if (!user) return [];

    return await ctx.db
      .query("destinations")
      .withIndex("by_owner", (q) => q.eq("ownerId", user._id))
      .collect();
  },
});

// Get single destination by ID
export const get = query({
  args: { id: v.id("destinations") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create destination
export const create = mutation({
  args: {
    name: v.string(),
    nameAr: v.string(),
    category: destinationCategory,
    city: v.optional(v.string()),
    cityAr: v.optional(v.string()),
    address: v.optional(v.string()),
    addressAr: v.optional(v.string()),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
    images: v.array(v.string()),
    description: v.optional(v.string()),
    descriptionAr: v.optional(v.string()),
    subtitle: v.optional(v.string()),
    subtitleAr: v.optional(v.string()),
    featured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedAppUser(ctx);
    if (!user) throw new Error("Not authenticated");
    if (user.userType !== "business") {
      throw new Error("Only business owners can create destinations");
    }

    return await ctx.db.insert("destinations", {
      ...args,
      ownerId: user._id,
      rating: 0,
      status: "pending",
    });
  },
});

// Update destination
export const update = mutation({
  args: {
    id: v.id("destinations"),
    name: v.optional(v.string()),
    nameAr: v.optional(v.string()),
    category: v.optional(destinationCategory),
    city: v.optional(v.string()),
    cityAr: v.optional(v.string()),
    address: v.optional(v.string()),
    addressAr: v.optional(v.string()),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
    images: v.optional(v.array(v.string())),
    description: v.optional(v.string()),
    descriptionAr: v.optional(v.string()),
    subtitle: v.optional(v.string()),
    subtitleAr: v.optional(v.string()),
    featured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedAppUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const destination = await ctx.db.get(args.id);
    if (!destination) throw new Error("Destination not found");

    if (destination.ownerId !== user._id) {
      throw new Error("Not authorized to update this destination");
    }

    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    return id;
  },
});

// Delete destination
export const remove = mutation({
  args: { id: v.id("destinations") },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedAppUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const destination = await ctx.db.get(args.id);
    if (!destination) throw new Error("Destination not found");

    if (destination.ownerId !== user._id) {
      throw new Error("Not authorized to delete this destination");
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
});

// Update destination status (admin only)
export const updateStatus = mutation({
  args: {
    id: v.id("destinations"),
    status: approvalStatus,
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedAppUser(ctx);
    if (!user) throw new Error("Not authenticated");
    if (user.userType !== "admin") {
      throw new Error("Only admins can update destination status");
    }

    await ctx.db.patch(args.id, { status: args.status });
    return args.id;
  },
});
