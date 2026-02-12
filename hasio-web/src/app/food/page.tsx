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
  { key: "restaurant", label: "Restaurants" },
  { key: "home_kitchen", label: "Productive Families" },
  { key: "fastfood", label: "Fast Food" },
  { key: "drinks", label: "Drinks" },
];

export default function FoodPage() {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const foods = useQuery(
    api.foods.list,
    activeTab === "all" ? {} : { category: activeTab as any }
  );

  const filtered = useMemo(() => {
    if (!foods) return undefined;
    if (!search) return foods;
    const q = search.toLowerCase();
    return foods.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.nameAr.includes(q) ||
        (f.cuisine && f.cuisine.toLowerCase().includes(q))
    );
  }, [foods, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-heading font-bold text-on-surface mb-6">
        {t("exploreFoodDrinks")}
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
        <EmptyState message="No food listings found." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((food) => (
            <ContentCard
              key={food._id}
              href={`/food/${food._id}`}
              image={food.images[0]}
              title={food.name}
              titleAr={food.nameAr}
              subtitle={language === "ar" ? food.cuisineAr : food.cuisine}
              rating={food.rating}
              price={food.avgPrice}
              badge={food.category}
            />
          ))}
        </div>
      )}
    </div>
  );
}
