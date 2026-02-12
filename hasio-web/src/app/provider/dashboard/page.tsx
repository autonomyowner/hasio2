"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { useLanguage } from "@/hooks/useLanguage";
import { AuthGuard } from "@/components/ui/AuthGuard";
import { CardGridSkeleton } from "@/components/ui/LoadingSkeleton";

function ProviderDashboardContent() {
  const { language } = useLanguage();
  const services = useQuery(api.services.byOwner);

  const pending = services?.filter((s) => s.status === "pending").length ?? 0;
  const approved = services?.filter((s) => s.status === "approved").length ?? 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-heading font-bold text-on-surface mb-8">
        Provider Dashboard
      </h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-on-surface">{services?.length ?? 0}</p>
          <p className="text-sm text-on-surface-variant">Total Services</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-warning">{pending}</p>
          <p className="text-sm text-on-surface-variant">Pending</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-success">{approved}</p>
          <p className="text-sm text-on-surface-variant">Approved</p>
        </div>
      </div>

      <div className="mb-8">
        <Link href="/provider/post-service" className="btn-primary no-underline">
          Post Service
        </Link>
      </div>

      <h2 className="text-lg font-heading font-bold text-on-surface mb-4">Your Services</h2>
      {services === undefined ? (
        <CardGridSkeleton count={3} />
      ) : services.length === 0 ? (
        <p className="text-on-surface-variant">No services posted yet.</p>
      ) : (
        <div className="space-y-3">
          {services.map((service) => (
            <div key={service._id} className="card p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-on-surface">
                  {language === "ar" ? service.titleAr : service.title}
                </p>
                <p className="text-sm text-on-surface-variant">{service.serviceType}</p>
              </div>
              <span className={`status-${service.status}`}>{service.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProviderDashboardPage() {
  return (
    <AuthGuard requiredRole="provider">
      <ProviderDashboardContent />
    </AuthGuard>
  );
}
