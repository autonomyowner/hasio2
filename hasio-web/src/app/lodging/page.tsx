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
  { key: "hotel", label: "Hotels" },
  { key: "apartment", label: "Apartments" },
  { key: "camp", label: "Camps" },
  { key: "homestay", label: "Homestays" },
];

export default function LodgingPage() {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const lodgings = useQuery(
    api.lodgings.list,
    activeTab === "all" ? {} : { type: activeTab as any }
  );

  const filtered = useMemo(() => {
    if (!lodgings) return undefined;
    if (!search) return lodgings;
    const q = search.toLowerCase();
    return lodgings.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.nameAr.includes(q) ||
        l.city.toLowerCase().includes(q)
    );
  }, [lodgings, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-heading font-bold text-on-surface mb-6">
        {t("discoverLodging")}
      </h1>

      <div className="space-y-4 mb-8">
        <FilterTabs tabs={TABS} activeKey={activeTab} onChange={setActiveTab} />
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder={t("searchPlaceholder")}
        />
      </div>

      {filtered === undefined ? (
        <CardGridSkeleton />
      ) : filtered.length === 0 ? (
        <EmptyState message="No lodgings found matching your search." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((lodging) => (
            <ContentCard
              key={lodging._id}
              href={`/lodging/${lodging._id}`}
              image={lodging.images[0]}
              title={lodging.name}
              titleAr={lodging.nameAr}
              subtitle={language === "ar" ? lodging.cityAr : lodging.city}
              rating={lodging.rating}
              price={lodging.priceRange}
              badge={lodging.type}
            />
          ))}
        </div>
      )}
    </div>
  );
}
