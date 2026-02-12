"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { useLanguage } from "@/hooks/useLanguage";
import { AuthGuard } from "@/components/ui/AuthGuard";
import { FilterTabs } from "@/components/ui/FilterTabs";
import { EmptyState } from "@/components/ui/EmptyState";
import { CardGridSkeleton } from "@/components/ui/LoadingSkeleton";
import Link from "next/link";

const TABS = [
  { key: "all", label: "All" },
  { key: "lodging", label: "Lodging" },
  { key: "food", label: "Food" },
  { key: "event", label: "Events" },
  { key: "destination", label: "Destinations" },
  { key: "service", label: "Services" },
];

function FavoritesContent() {
  const [activeTab, setActiveTab] = useState("all");
  const favorites = useQuery(
    api.favorites.list,
    activeTab === "all" ? {} : { itemType: activeTab as any }
  );

  const typeToRoute: Record<string, string> = {
    lodging: "/lodging",
    food: "/food",
    event: "/events",
    destination: "/destinations",
    service: "/services",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-heading font-bold text-on-surface mb-6">
        Favorites
      </h1>

      <FilterTabs tabs={TABS} activeKey={activeTab} onChange={setActiveTab} />

      <div className="mt-6">
        {favorites === undefined ? (
          <CardGridSkeleton count={3} />
        ) : favorites.length === 0 ? (
          <EmptyState message="No favorites yet. Browse content and save items you like." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map((fav) => (
              <Link
                key={fav._id}
                href={`${typeToRoute[fav.itemType] || ""}/${fav.itemId}`}
                className="card p-4 no-underline"
              >
                <p className="text-sm font-medium text-on-surface mb-1">
                  {fav.itemType.charAt(0).toUpperCase() + fav.itemType.slice(1)}
                </p>
                <p className="text-xs text-on-surface-muted truncate">
                  ID: {fav.itemId}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function FavoritesPage() {
  return (
    <AuthGuard>
      <FavoritesContent />
    </AuthGuard>
  );
}
