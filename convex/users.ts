import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedAppUser } from "./auth";
import { authComponent } from "./auth";

// Get current user from Convex (by email from better-auth)
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return await getAuthenticatedAppUser(ctx);
  },
});

// Get user by ID
export const getUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

// Sync user from better-auth (create or update) - uses auth context
export const syncUser = mutation({
  args: {
    userType: v.optional(v.union(v.literal("user"), v.literal("business"), v.literal("provider"), v.literal("admin"))),
  },
  handler: async (ctx, args) => {
    let authUser;
    try {
      authUser = await authComponent.getAuthUser(ctx);
    } catch {
      throw new Error("Not authenticated");
    }
    if (!authUser || !authUser.email) {
      throw new Error("Not authenticated");
    }

    const email = authUser.email;
    const fullName = authUser.name;

    // Check if user already exists by email
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (existingUser) {
      // Update existing user (don't override userType if already set)
      await ctx.db.patch(existingUser._id, {
        email: email,
        fullName: fullName || existingUser.fullName,
      });
      return existingUser._id;
    }

    // Create new user with the specified userType
    const userId = await ctx.db.insert("users", {
      email: email,
      fullName: fullName,
      userType: args.userType ?? "user",
      isVerified: false,
    });

    return userId;
  },
});

// Update user profile
export const updateProfile = mutation({
  args: {
    fullName: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    language: v.optional(v.string()),
    phone: v.optional(v.string()),
    bio: v.optional(v.string()),
    bioAr: v.optional(v.string()),
    businessName: v.optional(v.string()),
    businessNameAr: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedAppUser(ctx);
    if (!user) throw new Error("Not authenticated");

    await ctx.db.patch(user._id, args);
    return user._id;
  },
});

// Upgrade user type to business or provider (admin can only be set by another admin)
export const upgradeUserType = mutation({
  args: {
    userType: v.union(v.literal("business"), v.literal("provider")),
    businessName: v.optional(v.string()),
    businessNameAr: v.optional(v.string()),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedAppUser(ctx);
    if (!user) throw new Error("Not authenticated");

    await ctx.db.patch(user._id, {
      userType: args.userType,
      businessName: args.businessName,
      businessNameAr: args.businessNameAr,
      phone: args.phone,
    });

    return user._id;
  },
});

// Get users by type (for admin)
export const getUsersByType = query({
  args: {
    userType: v.union(v.literal("user"), v.literal("business"), v.literal("provider"), v.literal("admin")),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_user_type", (q) => q.eq("userType", args.userType))
      .collect();
  },
});

// Delete user (for account deletion)
export const deleteUser = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthenticatedAppUser(ctx);
    if (!user) throw new Error("Not authenticated");

    // Delete all user's personal data
    const moments = await ctx.db
      .query("moments")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
    for (const moment of moments) {
      await ctx.db.delete(moment._id);
    }

    const favorites = await ctx.db
      .query("favorites")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
    for (const favorite of favorites) {
      await ctx.db.delete(favorite._id);
    }

    const dayPlans = await ctx.db
      .query("dayPlans")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
    for (const plan of dayPlans) {
      await ctx.db.delete(plan._id);
    }

    const chatMessages = await ctx.db
      .query("chatMessages")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
    for (const message of chatMessages) {
      await ctx.db.delete(message._id);
    }

    const reportedMessages = await ctx.db
      .query("reportedMessages")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
    for (const report of reportedMessages) {
      await ctx.db.delete(report._id);
    }

    // Delete owned business content (for business users)
    const lodgings = await ctx.db
      .query("lodgings")
      .withIndex("by_owner", (q) => q.eq("ownerId", user._id))
      .collect();
    for (const lodging of lodgings) {
      await ctx.db.delete(lodging._id);
    }

    const foods = await ctx.db
      .query("foods")
      .withIndex("by_owner", (q) => q.eq("ownerId", user._id))
      .collect();
    for (const food of foods) {
      await ctx.db.delete(food._id);
    }

    const events = await ctx.db
      .query("events")
      .withIndex("by_owner", (q) => q.eq("ownerId", user._id))
      .collect();
    for (const event of events) {
      await ctx.db.delete(event._id);
    }

    const destinations = await ctx.db
      .query("destinations")
      .withIndex("by_owner", (q) => q.eq("ownerId", user._id))
      .collect();
    for (const destination of destinations) {
      await ctx.db.delete(destination._id);
    }

    // Delete owned services (for provider users)
    const services = await ctx.db
      .query("services")
      .withIndex("by_owner", (q) => q.eq("ownerId", user._id))
      .collect();
    for (const service of services) {
      await ctx.db.delete(service._id);
    }

    // Finally delete the user
    await ctx.db.delete(user._id);

    return { success: true };
  },
});
