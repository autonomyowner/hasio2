"use client";

import { use } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { useLanguage } from "@/hooks/useLanguage";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { ImageGallery } from "@/components/ui/ImageGallery";
import { DetailSkeleton } from "@/components/ui/LoadingSkeleton";

export default function LodgingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { language, t } = useLanguage();
  const { isSignedIn } = useCurrentUser();
  const lodging = useQuery(api.lodgings.get, {
    id: id as Id<"lodgings">,
  });
  const isFavorited = useQuery(
    api.favorites.isFavorited,
    isSignedIn ? { itemId: id } : "skip"
  );
  const toggleFavorite = useMutation(api.favorites.toggle);

  if (lodging === undefined) return <div className="max-w-4xl mx-auto px-4 py-8"><DetailSkeleton /></div>;
  if (!lodging) return <div className="max-w-4xl mx-auto px-4 py-8 text-center text-on-surface-variant">Lodging not found</div>;

  const name = language === "ar" ? lodging.nameAr : lodging.name;
  const city = language === "ar" ? lodging.cityAr : lodging.city;
  const description = language === "ar" ? lodging.descriptionAr : lodging.description;
  const amenities = language === "ar" ? lodging.amenitiesAr : lodging.amenities;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ImageGallery images={lodging.images} alt={name} />

      <div className="mt-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold text-on-surface">
              {name}
            </h1>
            <p className="text-on-surface-variant mt-1">{city}</p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            {lodging.rating > 0 && (
              <span className="text-lg font-bold text-gold">
                {lodging.rating.toFixed(1)}/5
              </span>
            )}
            {isSignedIn && (
              <button
                onClick={() =>
                  toggleFavorite({ itemId: id, itemType: "lodging" })
                }
                className="btn-secondary text-sm"
              >
                {isFavorited ? t("removeFromFavorites") : t("addToFavorites")}
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <span className="bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full">
            {lodging.type}
          </span>
          {lodging.priceRange && (
            <span className="bg-surface-variant text-on-surface-variant text-sm font-medium px-3 py-1 rounded-full">
              {lodging.priceRange} {t("perNight")}
            </span>
          )}
        </div>

        {description && (
          <div>
            <h2 className="text-lg font-heading font-bold text-on-surface mb-2">
              Description
            </h2>
            <p className="text-on-surface-variant leading-relaxed">
              {description}
            </p>
          </div>
        )}

        {amenities.length > 0 && (
          <div>
            <h2 className="text-lg font-heading font-bold text-on-surface mb-2">
              {t("amenities")}
            </h2>
            <div className="flex flex-wrap gap-2">
              {amenities.map((amenity, i) => (
                <span
                  key={i}
                  className="bg-surface-variant text-on-surface-variant text-sm px-3 py-1 rounded-full"
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
