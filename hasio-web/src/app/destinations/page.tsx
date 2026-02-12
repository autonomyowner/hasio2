"use client";

import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { useLanguage } from "@/hooks/useLanguage";
import { ContentCard } from "@/components/ui/ContentCard";
import { FilterTabs } from "@/components/ui/FilterTabs";
import { SearchBar } from "@/components/ui/SearchBar";
import { CardGridSkeleton } from "@/components/ui/LoadingSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";

const TABS = [
  { key: "all", label: "All" },
  { key: "historical", label: "Historical" },
  { key: "natural", label: "Natural" },
  { key: "cultural", label: "Cultural" },
  { key: "recreational", label: "Recreational" },
  { key: "religious", label: "Religious" },
];

export default function DestinationsPage() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const destinations = useQuery(
    api.destinations.list,
    activeTab === "all" ? {} : { category: activeTab as any }
  );

  const filtered = useMemo(() => {
    if (!destinations) return undefined;
    if (!search) return destinations;
    const q = search.toLowerCase();
    return destinations.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.nameAr.includes(q)
    );
  }, [destinations, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-heading font-bold text-on-surface mb-6">
        Destinations
      </h1>

      <div className="space-y-4 mb-8">
        <FilterTabs tabs={TABS} activeKey={activeTab} onChange={setActiveTab} />
        <SearchBar value={search} onChange={setSearch} placeholder="Search destinations..." />
      </div>

      {filtered === undefined ? (
        <CardGridSkeleton />
      ) : filtered.length === 0 ? (
        <EmptyState message="No destinations found." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((dest) => (
            <ContentCard
              key={dest._id}
              href={`/destinations/${dest._id}`}
              image={dest.images[0]}
              title={dest.name}
              titleAr={dest.nameAr}
              subtitle={dest.subtitle}
              subtitleAr={dest.subtitleAr}
              rating={dest.rating}
              badge={dest.category}
            />
          ))}
        </div>
      )}
    </div>
  );
}
