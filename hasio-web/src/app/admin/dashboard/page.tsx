"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { useLanguage } from "@/hooks/useLanguage";
import { AuthGuard } from "@/components/ui/AuthGuard";

type Tab = "overview" | "pending" | "reports" | "users";

function AdminContent() {
  const { language } = useLanguage();
  const [tab, setTab] = useState<Tab>("overview");
  const [pendingSub, setPendingSub] = useState<string>("lodgings");

  const stats = useQuery(api.admin.getDashboardStats);
  const pendingLodgings = useQuery(api.admin.getPendingLodgings);
  const pendingFoods = useQuery(api.admin.getPendingFoods);
  const pendingEvents = useQuery(api.admin.getPendingEvents);
  const pendingDestinations = useQuery(api.admin.getPendingDestinations);
  const pendingServices = useQuery(api.admin.getPendingServices);
  const reports = useQuery(api.admin.getUnreviewedReports);
  const allUsers = useQuery(api.admin.getAllUsers);

  const updateLodgingStatus = useMutation(api.lodgings.updateStatus);
  const updateFoodStatus = useMutation(api.foods.updateStatus);
  const updateEventStatus = useMutation(api.events.updateStatus);
  const updateDestinationStatus = useMutation(api.destinations.updateStatus);
  const updateServiceStatus = useMutation(api.services.updateStatus);
  const markReviewed = useMutation(api.admin.markReportReviewed);
  const setAdmin = useMutation(api.admin.setUserAsAdmin);
  const removeAdmin = useMutation(api.admin.removeAdminStatus);

  const handleStatus = async (type: string, id: any, status: "approved" | "rejected") => {
    const mutations: Record<string, any> = {
      lodgings: updateLodgingStatus,
      foods: updateFoodStatus,
      events: updateEventStatus,
      destinations: updateDestinationStatus,
      services: updateServiceStatus,
    };
    await mutations[type]({ id, status });
  };

  const pendingData: Record<string, any[] | undefined> = {
    lodgings: pendingLodgings,
    foods: pendingFoods,
    events: pendingEvents,
    destinations: pendingDestinations,
    services: pendingServices,
  };

  const getName = (item: any, type: string) => {
    if (type === "events") return language === "ar" ? item.titleAr : item.title;
    if (type === "services") return language === "ar" ? item.titleAr : item.title;
    return language === "ar" ? item.nameAr : item.name;
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "pending", label: `Pending (${stats?.pending.total ?? 0})` },
    { key: "reports", label: `Reports (${stats?.reports.unreviewed ?? 0})` },
    { key: "users", label: "Users" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-heading font-bold text-on-surface mb-8">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`filter-tab ${tab === t.key ? "filter-tab-active" : "filter-tab-inactive"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === "overview" && stats && (
        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-heading font-bold text-on-surface mb-4">Users</h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {(["total", "users", "business", "providers", "admins"] as const).map((key) => (
                <div key={key} className="card p-4 text-center">
                  <p className="text-2xl font-bold text-on-surface">{stats.users[key]}</p>
                  <p className="text-sm text-on-surface-variant capitalize">{key}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-heading font-bold text-on-surface mb-4">Pending Content</h2>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-4">
              {(["lodgings", "foods", "events", "destinations", "services", "total"] as const).map((key) => (
                <div key={key} className="card p-4 text-center">
                  <p className="text-2xl font-bold text-warning">{stats.pending[key]}</p>
                  <p className="text-sm text-on-surface-variant capitalize">{key}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-heading font-bold text-on-surface mb-4">AI Reports</h2>
            <div className="card p-4 text-center w-fit">
              <p className="text-2xl font-bold text-error">{stats.reports.unreviewed}</p>
              <p className="text-sm text-on-surface-variant">Unreviewed</p>
            </div>
          </div>
        </div>
      )}

      {/* Pending */}
      {tab === "pending" && (
        <div>
          <div className="flex gap-2 mb-6">
            {["lodgings", "foods", "events", "destinations", "services"].map((sub) => (
              <button
                key={sub}
                onClick={() => setPendingSub(sub)}
                className={`filter-tab ${pendingSub === sub ? "filter-tab-active" : "filter-tab-inactive"}`}
              >
                {sub.charAt(0).toUpperCase() + sub.slice(1)}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {(pendingData[pendingSub] || []).map((item: any) => (
              <div key={item._id} className="card p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-on-surface">{getName(item, pendingSub)}</p>
                  <p className="text-sm text-on-surface-variant capitalize">{pendingSub}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStatus(pendingSub, item._id, "approved")}
                    className="text-sm font-semibold text-success bg-success/10 px-3 py-1 rounded-lg border-none cursor-pointer hover:bg-success/20"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatus(pendingSub, item._id, "rejected")}
                    className="text-sm font-semibold text-error bg-error/10 px-3 py-1 rounded-lg border-none cursor-pointer hover:bg-error/20"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
            {pendingData[pendingSub]?.length === 0 && (
              <p className="text-on-surface-variant text-center py-8">No pending {pendingSub}.</p>
            )}
          </div>
        </div>
      )}

      {/* Reports */}
      {tab === "reports" && (
        <div className="space-y-3">
          {reports?.length === 0 && (
            <p className="text-on-surface-variant text-center py-8">No unreviewed reports.</p>
          )}
          {reports?.map((report) => (
            <div key={report._id} className="card p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-on-surface mb-1 break-words">
                    {report.messageText}
                  </p>
                  {report.reportReason && (
                    <p className="text-xs text-on-surface-variant">
                      Reason: {report.reportReason}
                    </p>
                  )}
                  <p className="text-xs text-on-surface-muted mt-1">
                    {new Date(report.timestamp).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => markReviewed({ reportId: report._id })}
                  className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-lg border-none cursor-pointer hover:bg-primary/20 flex-shrink-0"
                >
                  Mark Reviewed
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Users */}
      {tab === "users" && (
        <div className="space-y-3">
          {allUsers?.map((u) => (
            <div key={u._id} className="card p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-on-surface">{u.fullName || u.email || "Unknown"}</p>
                <p className="text-sm text-on-surface-variant">{u.email}</p>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  u.userType === "admin" ? "bg-secondary/10 text-secondary" : "bg-surface-variant text-on-surface-variant"
                }`}>
                  {u.userType}
                </span>
              </div>
              <div>
                {u.userType !== "admin" ? (
                  <button
                    onClick={() => setAdmin({ userId: u._id })}
                    className="text-sm text-primary bg-primary/10 px-3 py-1 rounded-lg border-none cursor-pointer hover:bg-primary/20"
                  >
                    Make Admin
                  </button>
                ) : (
                  <button
                    onClick={() => removeAdmin({ userId: u._id })}
                    className="text-sm text-error bg-error/10 px-3 py-1 rounded-lg border-none cursor-pointer hover:bg-error/20"
                  >
                    Remove Admin
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <AuthGuard requiredRole="admin">
      <AdminContent />
    </AuthGuard>
  );
}
