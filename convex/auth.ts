import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { components } from "./_generated/api";
import { DataModel } from "./_generated/dataModel";
import { QueryCtx, MutationCtx } from "./_generated/server";
import { betterAuth } from "better-auth";
import authConfig from "./auth.config";

const siteUrl = process.env.SITE_URL || "http://localhost:8081";

export const authComponent = createClient<DataModel>(components.betterAuth);

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth({
    baseURL: siteUrl,
    database: authComponent.adapter(ctx),
    trustedOrigins: [siteUrl, "http://localhost:8081", "http://localhost:3000", "https://hasio.xyz", "hasio://"],
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
      minPasswordLength: 6,
    },
    plugins: [convex({ authConfig })],
  });
};

/**
 * Get the authenticated app user from the Convex users table.
 * Returns null if not authenticated or user not found.
 * Uses email-based lookup from better-auth identity.
 */
export async function getAuthenticatedAppUser(ctx: QueryCtx | MutationCtx) {
  try {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser || !authUser.email) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", authUser.email))
      .first();

    return user;
  } catch {
    return null;
  }
}
