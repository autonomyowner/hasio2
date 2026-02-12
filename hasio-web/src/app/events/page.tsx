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
  { key: "festival", label: "Festivals" },
  { key: "conference", label: "Conferences" },
  { key: "outdoor", label: "Outdoor" },
  { key: "indoor", label: "Indoor" },
  { key: "seasonal", label: "Seasonal" },
];

export default function EventsPage() {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const events = useQuery(
    api.events.list,
    activeTab === "all" ? {} : { category: activeTab as any }
  );

  const filtered = useMemo(() => {
    if (!events) return undefined;
    if (!search) return events;
    const q = search.toLowerCase();
    return events.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.titleAr.includes(q) ||
        (e.location && e.location.toLowerCase().includes(q))
    );
  }, [events, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-heading font-bold text-on-surface mb-6">
        {t("findEvents")}
      </h1>

      <div className="space-y-4 mb-8">
        <FilterTabs tabs={TABS} activeKey={activeTab} onChange={setActiveTab} />
        <SearchBar value={search} onChange={setSearch} placeholder={t("searchPlaceholder")} />
      </div>

      {filtered === undefined ? (
        <CardGridSkeleton />
      ) : filtered.length === 0 ? (
        <EmptyState message="No events found." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((event) => (
            <ContentCard
              key={event._id}
              href={`/events/${event._id}`}
              image={event.images[0]}
              title={event.title}
              titleAr={event.titleAr}
              subtitle={event.date}
              badge={event.category}
            />
          ))}
        </div>
      )}
    </div>
  );
}
