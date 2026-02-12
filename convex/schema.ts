import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// User types
const userType = v.union(
  v.literal("user"),
  v.literal("business"),
  v.literal("provider"),
  v.literal("admin")
);
const approvalStatus = v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected"));

// Lodging types
const lodgingType = v.union(
  v.literal("hotel"),
  v.literal("apartment"),
  v.literal("camp"),
  v.literal("homestay")
);

// Food categories
const foodCategory = v.union(
  v.literal("restaurant"),
  v.literal("home_kitchen"),
  v.literal("fastfood"),
  v.literal("drinks")
);

// Event categories
const eventCategory = v.union(
  v.literal("festival"),
  v.literal("conference"),
  v.literal("outdoor"),
  v.literal("indoor"),
  v.literal("seasonal")
);

// Destination categories
const destinationCategory = v.union(
  v.literal("historical"),
  v.literal("natural"),
  v.literal("cultural"),
  v.literal("recreational"),
  v.literal("religious")
);

// Service types
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

// Price units
const priceUnit = v.union(
  v.literal("per_hour"),
  v.literal("per_day"),
  v.literal("per_event"),
  v.literal("fixed")
);

export default defineSchema({
  // Users table - synced from better-auth
  users: defineTable({
    clerkId: v.optional(v.string()),
    email: v.optional(v.string()),
    fullName: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    language: v.optional(v.string()),
    userType: userType,
    isVerified: v.boolean(),
    businessName: v.optional(v.string()),
    businessNameAr: v.optional(v.string()),
    phone: v.optional(v.string()),
    bio: v.optional(v.string()),
    bioAr: v.optional(v.string()),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"])
    .index("by_user_type", ["userType"]),

  // Lodgings table
  lodgings: defineTable({
    ownerId: v.optional(v.id("users")),
    name: v.string(),
    nameAr: v.string(),
    type: lodgingType,
    city: v.string(),
    cityAr: v.string(),
    neighborhood: v.optional(v.string()),
    neighborhoodAr: v.optional(v.string()),
    priceRange: v.optional(v.string()),
    rating: v.number(),
    images: v.array(v.string()),
    amenities: v.array(v.string()),
    amenitiesAr: v.array(v.string()),
    description: v.optional(v.string()),
    descriptionAr: v.optional(v.string()),
    status: approvalStatus,
  })
    .index("by_owner", ["ownerId"])
    .index("by_status", ["status"])
    .index("by_type", ["type"]),

  // Foods table
  foods: defineTable({
    ownerId: v.optional(v.id("users")),
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
    rating: v.number(),
    status: approvalStatus,
  })
    .index("by_owner", ["ownerId"])
    .index("by_status", ["status"])
    .index("by_category", ["category"]),

  // Events table
  events: defineTable({
    ownerId: v.optional(v.id("users")),
    title: v.string(),
    titleAr: v.string(),
    category: eventCategory,
    date: v.string(),
    time: v.optional(v.string()),
    location: v.optional(v.string()),
    locationAr: v.optional(v.string()),
    images: v.array(v.string()),
    description: v.optional(v.string()),
    descriptionAr: v.optional(v.string()),
    status: approvalStatus,
  })
    .index("by_owner", ["ownerId"])
    .index("by_status", ["status"])
    .index("by_date", ["date"]),

  // Destinations table
  destinations: defineTable({
    ownerId: v.optional(v.id("users")),
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
    rating: v.number(),
    status: approvalStatus,
    subtitle: v.optional(v.string()),
    subtitleAr: v.optional(v.string()),
    featured: v.optional(v.boolean()),
  })
    .index("by_owner", ["ownerId"])
    .index("by_status", ["status"])
    .index("by_category", ["category"]),

  // Services table
  services: defineTable({
    ownerId: v.id("users"),
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
    rating: v.number(),
    status: approvalStatus,
  })
    .index("by_owner", ["ownerId"])
    .index("by_status", ["status"])
    .index("by_service_type", ["serviceType"]),

  // Moments table - user photo gallery
  moments: defineTable({
    userId: v.id("users"),
    image: v.string(),
    note: v.optional(v.string()),
    location: v.optional(v.string()),
    timestamp: v.string(),
  }).index("by_user", ["userId"]),

  // Favorites table
  favorites: defineTable({
    userId: v.id("users"),
    itemId: v.string(),
    itemType: v.union(
      v.literal("lodging"),
      v.literal("food"),
      v.literal("event"),
      v.literal("destination"),
      v.literal("service")
    ),
  })
    .index("by_user", ["userId"])
    .index("by_user_item", ["userId", "itemId"]),

  // Day plans table - trip itineraries
  dayPlans: defineTable({
    userId: v.id("users"),
    date: v.string(),
    items: v.array(
      v.object({
        id: v.string(),
        time: v.string(),
        type: v.union(v.literal("lodging"), v.literal("food"), v.literal("event")),
        refId: v.string(),
        note: v.optional(v.string()),
      })
    ),
  })
    .index("by_user", ["userId"])
    .index("by_user_date", ["userId", "date"]),

  // Chat messages for AI planner
  chatMessages: defineTable({
    userId: v.id("users"),
    text: v.string(),
    isUser: v.boolean(),
    timestamp: v.string(),
  }).index("by_user", ["userId"]),

  // Reported AI messages - for Google Play compliance
  reportedMessages: defineTable({
    userId: v.id("users"),
    messageId: v.string(),
    messageText: v.string(),
    reportReason: v.optional(v.string()),
    timestamp: v.string(),
    reviewed: v.boolean(),
  })
    .index("by_user", ["userId"])
    .index("by_reviewed", ["reviewed"]),
});
