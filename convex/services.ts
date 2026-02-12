import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedAppUser } from "./auth";

const serviceType = v.union(
  v.literal("tour_guide"),
  v.literal("photographer"),
  v.literal("driver"),
  v.literal("translator"),
  v.literal("event_planner"),
  v.literal("catering"),
  v.literal("equipment_rental"),
  v.literal("other")
);

const priceUnit = v.union(
  v.literal("per_hour"),
  v.literal("per_day"),
  v.literal("per_event"),
  v.literal("fixed")
);

const approvalStatus = v.union(
  v.literal("pending"),
  v.literal("approved"),
  v.literal("rejected")
);

// List all approved services
export const list = query({
  args: {
    serviceType: v.optional(serviceType),
  },
  handler: async (ctx, args) => {
    const services = await ctx.db
      .query("services")
      .withIndex("by_status", (q) => q.eq("status", "approved"))
      .collect();

    if (args.serviceType) {
      return services.filter((s) => s.serviceType === args.serviceType);
    }

    return services;
  },
});

// List all services (including pending, for admin)
export const listAll = query({
  args: {
    status: v.optional(approvalStatus),
  },
  handler: async (ctx, args) => {
    if (args.status) {
      return await ctx.db
        .query("services")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .collect();
    }
    return await ctx.db.query("services").collect();
  },
});

// Get services by owner (provider dashboard)
export const byOwner = query({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthenticatedAppUser(ctx);
    if (!user) return [];

    return await ctx.db
      .query("services")
      .withIndex("by_owner", (q) => q.eq("ownerId", user._id))
      .collect();
  },
});

// Get single service by ID
export const get = query({
  args: { id: v.id("services") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create service
export const create = mutation({
  args: {
    title: v.string(),
    titleAr: v.string(),
    serviceType: serviceType,
    description: v.string(),
    descriptionAr: v.string(),
    priceRange: v.optional(v.string()),
    priceUnit: priceUnit,
    availability: v.optional(v.string()),
    availabilityAr: v.optional(v.string()),
    contactPhone: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
    images: v.array(v.string()),
    languages: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedAppUser(ctx);
    if (!user) throw new Error("Not authenticated");
    if (user.userType !== "provider") {
      throw new Error("Only service providers can create services");
    }

    return await ctx.db.insert("services", {
      ...args,
      ownerId: user._id,
      rating: 0,
      status: "pending",
    });
  },
});

// Update service
export const update = mutation({
  args: {
    id: v.id("services"),
    title: v.optional(v.string()),
    titleAr: v.optional(v.string()),
    serviceType: v.optional(serviceType),
    description: v.optional(v.string()),
    descriptionAr: v.optional(v.string()),
    priceRange: v.optional(v.string()),
    priceUnit: v.optional(priceUnit),
    availability: v.optional(v.string()),
    availabilityAr: v.optional(v.string()),
    contactPhone: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
    images: v.optional(v.array(v.string())),
    languages: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedAppUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const service = await ctx.db.get(args.id);
    if (!service) throw new Error("Service not found");

    if (service.ownerId !== user._id) {
      throw new Error("Not authorized to update this service");
    }

    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    return id;
  },
});

// Delete service
export const remove = mutation({
  args: { id: v.id("services") },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedAppUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const service = await ctx.db.get(args.id);
    if (!service) throw new Error("Service not found");

    if (service.ownerId !== user._id) {
      throw new Error("Not authorized to delete this service");
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
});

// Update service status (admin only)
export const updateStatus = mutation({
  args: {
    id: v.id("services"),
    status: approvalStatus,
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedAppUser(ctx);
    if (!user) throw new Error("Not authenticated");
    if (user.userType !== "admin") {
      throw new Error("Only admins can update service status");
    }

    await ctx.db.patch(args.id, { status: args.status });
    return args.id;
  },
});
