"use client";

import { use } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { useLanguage } from "@/hooks/useLanguage";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { ImageGallery } from "@/components/ui/ImageGallery";
import { DetailSkeleton } from "@/components/ui/LoadingSkeleton";

export default function FoodDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { language, t } = useLanguage();
  const { isSignedIn } = useCurrentUser();
  const food = useQuery(api.foods.get, { id: id as Id<"foods"> });
  const isFavorited = useQuery(
    api.favorites.isFavorited,
    isSignedIn ? { itemId: id } : "skip"
  );
  const toggleFavorite = useMutation(api.favorites.toggle);

  if (food === undefined) return <div className="max-w-4xl mx-auto px-4 py-8"><DetailSkeleton /></div>;
  if (!food) return <div className="max-w-4xl mx-auto px-4 py-8 text-center text-on-surface-variant">Food listing not found</div>;

  const name = language === "ar" ? food.nameAr : food.name;
  const description = language === "ar" ? food.descriptionAr : food.description;
  const cuisine = language === "ar" ? food.cuisineAr : food.cuisine;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ImageGallery images={food.images} alt={name} />

      <div className="mt-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold text-on-surface">{name}</h1>
            {cuisine && <p className="text-on-surface-variant mt-1">{cuisine}</p>}
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            {food.rating > 0 && (
              <span className="text-lg font-bold text-gold">{food.rating.toFixed(1)}/5</span>
            )}
            {isSignedIn && (
              <button
                onClick={() => toggleFavorite({ itemId: id, itemType: "food" })}
                className="btn-secondary text-sm"
              >
                {isFavorited ? t("removeFromFavorites") : t("addToFavorites")}
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <span className="bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full">
            {food.category}
          </span>
          {food.avgPrice && (
            <span className="bg-surface-variant text-on-surface-variant text-sm font-medium px-3 py-1 rounded-full">
              {food.avgPrice}
            </span>
          )}
          {food.hours && (
            <span className="bg-surface-variant text-on-surface-variant text-sm font-medium px-3 py-1 rounded-full">
              {food.hours}
            </span>
          )}
        </div>

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
