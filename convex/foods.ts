import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedAppUser } from "./auth";

const foodCategory = v.union(
  v.literal("restaurant"),
  v.literal("home_kitchen"),
  v.literal("fastfood"),
  v.literal("drinks")
);

const approvalStatus = v.union(
  v.literal("pending"),
  v.literal("approved"),
  v.literal("rejected")
);

// List all approved foods
export const list = query({
  args: {
    category: v.optional(foodCategory),
  },
  handler: async (ctx, args) => {
    const foods = await ctx.db
      .query("foods")
      .withIndex("by_status", (q) => q.eq("status", "approved"))
      .collect();

    if (args.category) {
      return foods.filter((f) => f.category === args.category);
    }

    return foods;
  },
});

// List all foods (including pending, for admin)
export const listAll = query({
  args: {
    status: v.optional(approvalStatus),
  },
  handler: async (ctx, args) => {
    if (args.status) {
      return await ctx.db
        .query("foods")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .collect();
    }
    return await ctx.db.query("foods").collect();
  },
});

// Get foods by owner (business dashboard)
export const byOwner = query({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthenticatedAppUser(ctx);
    if (!user) return [];

    return await ctx.db
      .query("foods")
      .withIndex("by_owner", (q) => q.eq("ownerId", user._id))
      .collect();
  },
});

// Get single food by ID
export const get = query({
  args: { id: v.id("foods") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create food
export const create = mutation({
  args: {
    name: v.string(),
    nameAr: v.string(),
    category: foodCategory,
    cuisine: v.optional(v.string()),
    cuisineAr: v.optional(v.string()),
    avgPrice: v.optional(v.string()),
    hours: v.optional(v.string()),
    images: v.array(v.string()),
    description: v.optional(v.string()),
    descriptionAr: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedAppUser(ctx);
    if (!user) throw new Error("Not authenticated");
    if (user.userType !== "business") {
      throw new Error("Only business owners can create food listings");
    }

    return await ctx.db.insert("foods", {
      ...args,
      ownerId: user._id,
      rating: 0,
      status: "pending",
    });
  },
});

// Update food
export const update = mutation({
  args: {
    id: v.id("foods"),
    name: v.optional(v.string()),
    nameAr: v.optional(v.string()),
    category: v.optional(foodCategory),
    cuisine: v.optional(v.string()),
    cuisineAr: v.optional(v.string()),
    avgPrice: v.optional(v.string()),
    hours: v.optional(v.string()),
    images: v.optional(v.array(v.string())),
    description: v.optional(v.string()),
    descriptionAr: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedAppUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const food = await ctx.db.get(args.id);
    if (!food) throw new Error("Food listing not found");

    if (food.ownerId !== user._id) {
      throw new Error("Not authorized to update this listing");
    }

    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    return id;
  },
});

// Delete food
export const remove = mutation({
  args: { id: v.id("foods") },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedAppUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const food = await ctx.db.get(args.id);
    if (!food) throw new Error("Food listing not found");

    if (food.ownerId !== user._id) {
      throw new Error("Not authorized to delete this listing");
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
});

// Update food status (admin only)
export const updateStatus = mutation({
  args: {
    id: v.id("foods"),
    status: approvalStatus,
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedAppUser(ctx);
    if (!user) throw new Error("Not authenticated");
    if (user.userType !== "admin") {
      throw new Error("Only admins can update food listing status");
    }

    await ctx.db.patch(args.id, { status: args.status });
    return args.id;
  },
});
