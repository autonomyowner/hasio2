import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedAppUser } from "./auth";

const planItemType = v.union(
  v.literal("lodging"),
  v.literal("food"),
  v.literal("event")
);

const planItem = v.object({
  id: v.string(),
  time: v.string(),
  type: planItemType,
  refId: v.string(),
  note: v.optional(v.string()),
});

// List user's day plans
export const list = query({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthenticatedAppUser(ctx);
    if (!user) return [];

    return await ctx.db
      .query("dayPlans")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
  },
});

// Get plan for a specific date
export const getByDate = query({
  args: {
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedAppUser(ctx);
    if (!user) return null;

    return await ctx.db
      .query("dayPlans")
      .withIndex("by_user_date", (q) =>
        q.eq("userId", user._id).eq("date", args.date)
      )
      .first();
  },
});

// Get single plan by ID
export const get = query({
  args: { id: v.id("dayPlans") },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedAppUser(ctx);
    if (!user) return null;

    const plan = await ctx.db.get(args.id);
    if (!plan) return null;

    // Verify ownership
    if (plan.userId !== user._id) return null;

    return plan;
  },
});

// Create or update day plan
export const upsert = mutation({
  args: {
    date: v.string(),
    items: v.array(planItem),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedAppUser(ctx);
    if (!user) throw new Error("Not authenticated");

    // Check if plan for this date exists
    const existing = await ctx.db
      .query("dayPlans")
      .withIndex("by_user_date", (q) =>
        q.eq("userId", user._id).eq("date", args.date)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { items: args.items });
      return existing._id;
    }

    return await ctx.db.insert("dayPlans", {
      userId: user._id,
      date: args.date,
      items: args.items,
    });
  },
});

// Add item to plan
export const addItem = mutation({
  args: {
    date: v.string(),
    item: planItem,
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedAppUser(ctx);
    if (!user) throw new Error("Not authenticated");

    // Check if plan for this date exists
    const existing = await ctx.db
      .query("dayPlans")
      .withIndex("by_user_date", (q) =>
        q.eq("userId", user._id).eq("date", args.date)
      )
      .first();

    if (existing) {
      const updatedItems = [...existing.items, args.item];
      await ctx.db.patch(existing._id, { items: updatedItems });
      return existing._id;
    }

    return await ctx.db.insert("dayPlans", {
      userId: user._id,
      date: args.date,
      items: [args.item],
    });
  },
});

// Remove item from plan
export const removeItem = mutation({
  args: {
    planId: v.id("dayPlans"),
    itemId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedAppUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const plan = await ctx.db.get(args.planId);
    if (!plan) throw new Error("Plan not found");

    if (plan.userId !== user._id) {
      throw new Error("Not authorized to modify this plan");
    }

    const updatedItems = plan.items.filter((item) => item.id !== args.itemId);
    await ctx.db.patch(args.planId, { items: updatedItems });

    return args.planId;
  },
});

// Delete plan
export const remove = mutation({
  args: { id: v.id("dayPlans") },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedAppUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const plan = await ctx.db.get(args.id);
    if (!plan) throw new Error("Plan not found");

    if (plan.userId !== user._id) {
      throw new Error("Not authorized to delete this plan");
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
});
