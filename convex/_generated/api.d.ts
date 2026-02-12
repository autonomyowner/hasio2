/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin from "../admin.js";
import type * as destinations from "../destinations.js";
import type * as events from "../events.js";
import type * as favorites from "../favorites.js";
import type * as foods from "../foods.js";
import type * as http from "../http.js";
import type * as lodgings from "../lodgings.js";
import type * as moments from "../moments.js";
import type * as plans from "../plans.js";
import type * as reportedMessages from "../reportedMessages.js";
import type * as seed from "../seed.js";
import type * as services from "../services.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  destinations: typeof destinations;
  events: typeof events;
  favorites: typeof favorites;
  foods: typeof foods;
  http: typeof http;
  lodgings: typeof lodgings;
  moments: typeof moments;
  plans: typeof plans;
  reportedMessages: typeof reportedMessages;
  seed: typeof seed;
  services: typeof services;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
