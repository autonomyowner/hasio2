"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { useLanguage } from "@/hooks/useLanguage";
import { ContentCard } from "@/components/ui/ContentCard";
import { CardGridSkeleton } from "@/components/ui/LoadingSkeleton";

export default function HomePage() {
  const { t, language } = useLanguage();
  const destinations = useQuery(api.destinations.listFeatured);
  const lodgings = useQuery(api.lodgings.list, {});
  const foods = useQuery(api.foods.list, {});
  const events = useQuery(api.events.listUpcoming);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-primary/5 py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-on-surface mb-4">
            {t("welcome")}
          </h1>
          <p className="text-lg sm:text-xl text-on-surface-variant max-w-2xl mx-auto mb-8">
            {t("heroSubtext")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/destinations" className="btn-primary text-base px-8 py-3 no-underline">
              {t("exploreOasis")}
            </Link>
            <Link href="/planner" className="btn-secondary text-base px-8 py-3 no-underline">
              Plan Your Trip with AI
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-on-surface">
            {t("featuredDestinations")}
          </h2>
          <Link href="/destinations" className="text-sm font-medium text-primary hover:underline no-underline">
            View All
          </Link>
        </div>
        {destinations === undefined ? (
          <CardGridSkeleton count={3} />
        ) : destinations.length === 0 ? (
          <p className="text-on-surface-variant">No featured destinations yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.slice(0, 6).map((dest) => (
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
      </section>

      {/* Lodging Preview */}
      <section className="bg-surface-variant/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-on-surface">
              {t("discoverLodging")}
            </h2>
            <Link href="/lodging" className="text-sm font-medium text-primary hover:underline no-underline">
              View All
            </Link>
          </div>
          {lodgings === undefined ? (
            <CardGridSkeleton count={3} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {lodgings.slice(0, 3).map((lodging) => (
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
      </section>

      {/* Food Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-on-surface">
            {t("exploreFoodDrinks")}
          </h2>
          <Link href="/food" className="text-sm font-medium text-primary hover:underline no-underline">
            View All
          </Link>
        </div>
        {foods === undefined ? (
          <CardGridSkeleton count={3} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {foods.slice(0, 3).map((food) => (
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
      </section>

      {/* Events Preview */}
      <section className="bg-surface-variant/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-on-surface">
              {t("findEvents")}
            </h2>
            <Link href="/events" className="text-sm font-medium text-primary hover:underline no-underline">
              View All
            </Link>
          </div>
          {events === undefined ? (
            <CardGridSkeleton count={3} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.slice(0, 3).map((event) => (
                <ContentCard
                  key={event._id}
                  href={`/events/${event._id}`}
                  image={event.images[0]}
                  title={event.title}
                  titleAr={event.titleAr}
                  subtitle={event.date}
                  rating={0}
                  badge={event.category}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* AI Planner CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl sm:text-3xl font-heading font-bold text-on-surface mb-4">
          Plan Your Perfect Al-Ahsa Trip
        </h2>
        <p className="text-on-surface-variant max-w-xl mx-auto mb-8">
          Our AI assistant knows everything about Al-Ahsa Oasis. Ask about
          attractions, food, culture, or let it plan your entire itinerary.
        </p>
        <Link href="/planner" className="btn-primary text-base px-8 py-3 no-underline">
          Start Planning
        </Link>
      </section>
    </div>
  );
}
