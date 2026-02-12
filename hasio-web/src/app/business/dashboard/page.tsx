"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { useLanguage } from "@/hooks/useLanguage";
import { AuthGuard } from "@/components/ui/AuthGuard";
import { CardGridSkeleton } from "@/components/ui/LoadingSkeleton";

function BusinessDashboardContent() {
  const { language } = useLanguage();
  const lodgings = useQuery(api.lodgings.byOwner);
  const foods = useQuery(api.foods.byOwner);
  const events = useQuery(api.events.byOwner);
  const destinations = useQuery(api.destinations.byOwner);

  const allItems = [
    ...(lodgings || []).map((l) => ({ ...l, _type: "lodging" as const, name: language === "ar" ? l.nameAr : l.name })),
    ...(foods || []).map((f) => ({ ...f, _type: "food" as const, name: language === "ar" ? f.nameAr : f.name })),
    ...(events || []).map((e) => ({ ...e, _type: "event" as const, name: language === "ar" ? e.titleAr : e.title })),
    ...(destinations || []).map((d) => ({ ...d, _type: "destination" as const, name: language === "ar" ? d.nameAr : d.name })),
  ];

  const pending = allItems.filter((i) => i.status === "pending").length;
  const approved = allItems.filter((i) => i.status === "approved").length;
  const rejected = allItems.filter((i) => i.status === "rejected").length;

  const isLoading = lodgings === undefined || foods === undefined || events === undefined || destinations === undefined;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-heading font-bold text-on-surface mb-8">
        Business Dashboard
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-on-surface">{allItems.length}</p>
          <p className="text-sm text-on-surface-variant">Total Listings</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-warning">{pending}</p>
          <p className="text-sm text-on-surface-variant">Pending</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-success">{approved}</p>
          <p className="text-sm text-on-surface-variant">Approved</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-error">{rejected}</p>
          <p className="text-sm text-on-surface-variant">Rejected</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-heading font-bold text-on-surface mb-4">Post New</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/business/post-lodging" className="btn-primary no-underline">Post Lodging</Link>
          <Link href="/business/post-food" className="btn-primary no-underline">Post Food</Link>
          <Link href="/business/post-event" className="btn-primary no-underline">Post Event</Link>
          <Link href="/business/post-destination" className="btn-primary no-underline">Post Destination</Link>
        </div>
      </div>

      {/* Listings */}
      <h2 className="text-lg font-heading font-bold text-on-surface mb-4">Your Listings</h2>
      {isLoading ? (
        <CardGridSkeleton count={3} />
      ) : allItems.length === 0 ? (
        <p className="text-on-surface-variant">No listings yet. Start posting content above.</p>
      ) : (
        <div className="space-y-3">
          {allItems.map((item) => (
            <div key={item._id} className="card p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-on-surface">{item.name}</p>
                <p className="text-sm text-on-surface-variant capitalize">{item._type}</p>
              </div>
              <span className={`status-${item.status}`}>{item.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function BusinessDashboardPage() {
  return (
    <AuthGuard requiredRole="business">
      <BusinessDashboardContent />
    </AuthGuard>
  );
}
