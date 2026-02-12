import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthenticatedAppUser } from "./auth";

// Helper to check if user is admin
async function requireAdmin(ctx: any) {
  const user = await getAuthenticatedAppUser(ctx);
  if (!user) throw new Error("Not authenticated");
  if (user.userType !== "admin") {
    throw new Error("Admin access required");
  }
  return user;
}

// Get dashboard stats
export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);

    // Count users by type
    const allUsers = await ctx.db.query("users").collect();
    const userCounts = {
      total: allUsers.length,
      users: allUsers.filter((u) => u.userType === "user").length,
      business: allUsers.filter((u) => u.userType === "business").length,
      providers: allUsers.filter((u) => u.userType === "provider").length,
      admins: allUsers.filter((u) => u.userType === "admin").length,
    };

    // Count pending content
    const pendingLodgings = await ctx.db
      .query("lodgings")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();

    const pendingFoods = await ctx.db
      .query("foods")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();

    const pendingEvents = await ctx.db
      .query("events")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();

    const pendingDestinations = await ctx.db
      .query("destinations")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();

    const pendingServices = await ctx.db
      .query("services")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();

    // Count unreviewed reports
    const unreviewedReports = await ctx.db
      .query("reportedMessages")
      .withIndex("by_reviewed", (q) => q.eq("reviewed", false))
      .collect();

    return {
      users: userCounts,
      pending: {
        lodgings: pendingLodgings.length,
        foods: pendingFoods.length,
        events: pendingEvents.length,
        destinations: pendingDestinations.length,
        services: pendingServices.length,
        total:
          pendingLodgings.length +
          pendingFoods.length +
          pendingEvents.length +
          pendingDestinations.length +
          pendingServices.length,
      },
      reports: {
        unreviewed: unreviewedReports.length,
      },
    };
  },
});

// Get pending lodgings
export const getPendingLodgings = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.db
      .query("lodgings")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();
  },
});

// Get pending foods
export const getPendingFoods = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.db
      .query("foods")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();
  },
});

// Get pending events
export const getPendingEvents = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.db
      .query("events")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();
  },
});

// Get pending destinations
export const getPendingDestinations = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.db
      .query("destinations")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();
  },
});

// Get pending services
export const getPendingServices = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.db
      .query("services")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();
  },
});

// Get unreviewed reported messages
export const getUnreviewedReports = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.db
      .query("reportedMessages")
      .withIndex("by_reviewed", (q) => q.eq("reviewed", false))
      .order("desc")
      .collect();
  },
});

// Mark reported message as reviewed
export const markReportReviewed = mutation({
  args: {
    reportId: v.id("reportedMessages"),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.reportId, { reviewed: true });
    return { success: true };
  },
});

// Get all users (for admin user management)
export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.db.query("users").order("desc").collect();
  },
});

// Set user as admin (only admins can do this)
export const setUserAsAdmin = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.userId, { userType: "admin" });
    return { success: true };
  },
});

// Remove admin status from user
export const removeAdminStatus = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const currentAdmin = await requireAdmin(ctx);

    // Prevent removing own admin status
    if (currentAdmin._id === args.userId) {
      throw new Error("Cannot remove your own admin status");
    }

    await ctx.db.patch(args.userId, { userType: "user" });
    return { success: true };
  },
});
