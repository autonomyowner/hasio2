import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedAppUser } from "./auth";

const itemType = v.union(
  v.literal("lodging"),
  v.literal("food"),
  v.literal("event"),
  v.literal("destination"),
  v.literal("service")
);

// List user's favorites
export const list = query({
  args: {
    itemType: v.optional(itemType),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedAppUser(ctx);
    if (!user) return [];

    const favorites = await ctx.db
      .query("favorites")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    if (args.itemType) {
      return favorites.filter((f) => f.itemType === args.itemType);
    }

    return favorites;
  },
});

// Check if item is favorited
export const isFavorited = query({
  args: {
    itemId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedAppUser(ctx);
    if (!user) return false;

    const favorite = await ctx.db
      .query("favorites")
      .withIndex("by_user_item", (q) =>
        q.eq("userId", user._id).eq("itemId", args.itemId)
      )
      .first();

    return !!favorite;
  },
});

// Add to favorites
export const add = mutation({
  args: {
    itemId: v.string(),
    itemType: itemType,
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedAppUser(ctx);
    if (!user) throw new Error("Not authenticated");

    // Check if already favorited
    const existing = await ctx.db
      .query("favorites")
      .withIndex("by_user_item", (q) =>
        q.eq("userId", user._id).eq("itemId", args.itemId)
      )
      .first();

    if (existing) {
      return existing._id;
    }

    return await ctx.db.insert("favorites", {
      userId: user._id,
      itemId: args.itemId,
      itemType: args.itemType,
    });
  },
});

// Remove from favorites
export const remove = mutation({
  args: {
    itemId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedAppUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const favorite = await ctx.db
      .query("favorites")
      .withIndex("by_user_item", (q) =>
        q.eq("userId", user._id).eq("itemId", args.itemId)
      )
      .first();

    if (favorite) {
      await ctx.db.delete(favorite._id);
    }

    return { success: true };
  },
});

// Toggle favorite
export const toggle = mutation({
  args: {
    itemId: v.string(),
    itemType: itemType,
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedAppUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("favorites")
      .withIndex("by_user_item", (q) =>
        q.eq("userId", user._id).eq("itemId", args.itemId)
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
      return { isFavorited: false };
    }

    await ctx.db.insert("favorites", {
      userId: user._id,
      itemId: args.itemId,
      itemType: args.itemType,
    });

    return { isFavorited: true };
  },
});
