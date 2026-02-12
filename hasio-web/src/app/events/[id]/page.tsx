"use client";

import { use } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { useLanguage } from "@/hooks/useLanguage";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { ImageGallery } from "@/components/ui/ImageGallery";
import { DetailSkeleton } from "@/components/ui/LoadingSkeleton";

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { language, t } = useLanguage();
  const { isSignedIn } = useCurrentUser();
  const event = useQuery(api.events.get, { id: id as Id<"events"> });
  const isFavorited = useQuery(
    api.favorites.isFavorited,
    isSignedIn ? { itemId: id } : "skip"
  );
  const toggleFavorite = useMutation(api.favorites.toggle);

  if (event === undefined) return <div className="max-w-4xl mx-auto px-4 py-8"><DetailSkeleton /></div>;
  if (!event) return <div className="max-w-4xl mx-auto px-4 py-8 text-center text-on-surface-variant">Event not found</div>;

  const title = language === "ar" ? event.titleAr : event.title;
  const description = language === "ar" ? event.descriptionAr : event.description;
  const location = language === "ar" ? event.locationAr : event.location;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ImageGallery images={event.images} alt={title} />

      <div className="mt-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-3xl font-heading font-bold text-on-surface">{title}</h1>
          {isSignedIn && (
            <button
              onClick={() => toggleFavorite({ itemId: id, itemType: "event" })}
              className="btn-secondary text-sm flex-shrink-0"
            >
              {isFavorited ? t("removeFromFavorites") : t("addToFavorites")}
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <span className="bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full">
            {event.category}
          </span>
          <span className="bg-surface-variant text-on-surface-variant text-sm font-medium px-3 py-1 rounded-full">
            {event.date}
          </span>
          {event.time && (
            <span className="bg-surface-variant text-on-surface-variant text-sm font-medium px-3 py-1 rounded-full">
              {event.time}
            </span>
          )}
        </div>

        {location && (
          <div>
            <h2 className="text-lg font-heading font-bold text-on-surface mb-1">Location</h2>
            <p className="text-on-surface-variant">{location}</p>
          </div>
        )}

        {description && (
          <div>
            <h2 className="text-lg font-heading font-bold text-on-surface mb-2">Description</h2>
            <p className="text-on-surface-variant leading-relaxed">{description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
