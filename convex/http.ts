import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { authComponent, createAuth } from "./auth";

const http = httpRouter();

// Register better-auth routes
authComponent.registerRoutes(http, createAuth);

// Health check endpoint
http.route({
  path: "/health",
  method: "GET",
  handler: httpAction(async () => {
    return new Response(JSON.stringify({ status: "ok" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),
});

// Generate presigned URL for R2 upload
http.route({
  path: "/upload-url",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    // Verify authentication
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    try {
      const body = await request.json();
      const { filename, contentType } = body as {
        filename: string;
        contentType: string;
      };

      if (!filename || !contentType) {
        return new Response(
          JSON.stringify({ error: "filename and contentType are required" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      // Generate a unique key for the file
      const timestamp = Date.now();
      const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
      const key = `uploads/${identity.subject}/${timestamp}-${sanitizedFilename}`;

      const publicUrl = process.env.R2_PUBLIC_URL;

      return new Response(
        JSON.stringify({
          key,
          publicUrl: publicUrl ? `${publicUrl}/${key}` : null,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Failed to generate upload URL" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }),
});

export default http;
