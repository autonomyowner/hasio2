import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthenticatedAppUser } from "./auth";

// Report a message as inappropriate (Google Play AI policy requirement)
export const reportMessage = mutation({
  args: {
    messageId: v.string(),
    messageText: v.string(),
    reportReason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedAppUser(ctx);
    if (!user) throw new Error("Not authenticated");

    // Create reported message record
    const reportId = await ctx.db.insert("reportedMessages", {
      userId: user._id,
      messageId: args.messageId,
      messageText: args.messageText,
      reportReason: args.reportReason,
      timestamp: new Date().toISOString(),
      reviewed: false,
    });

    console.log(`Message reported by user ${user._id}: ${args.messageId}`);
    return reportId;
  },
});

// Get all reported messages (for admin review)
export const getAllReported = query({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthenticatedAppUser(ctx);
    if (!user) throw new Error("Not authenticated");

    // Get all reported messages (ordered by newest first)
    const reports = await ctx.db
      .query("reportedMessages")
      .order("desc")
      .collect();

    return reports;
  },
});

// Get unreviewed reported messages
export const getUnreviewed = query({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthenticatedAppUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const unreviewed = await ctx.db
      .query("reportedMessages")
      .withIndex("by_reviewed", (q) => q.eq("reviewed", false))
      .collect();

    return unreviewed;
  },
});

// Mark a reported message as reviewed
export const markAsReviewed = mutation({
  args: {
    reportId: v.id("reportedMessages"),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedAppUser(ctx);
    if (!user) throw new Error("Not authenticated");

    await ctx.db.patch(args.reportId, {
      reviewed: true,
    });

    return { success: true };
  },
});
