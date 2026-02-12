"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { AuthGuard } from "@/components/ui/AuthGuard";

const SERVICE_TYPES = [
  { value: "tour_guide", label: "Tour Guide" },
  { value: "photographer", label: "Photographer" },
  { value: "driver", label: "Driver" },
  { value: "translator", label: "Translator" },
  { value: "event_planner", label: "Event Planner" },
  { value: "catering", label: "Catering" },
  { value: "equipment_rental", label: "Equipment Rental" },
  { value: "other", label: "Other" },
];

const PRICE_UNITS = [
  { value: "per_hour", label: "Per Hour" },
  { value: "per_day", label: "Per Day" },
  { value: "per_event", label: "Per Event" },
  { value: "fixed", label: "Fixed Price" },
];

function PostServiceContent() {
  const router = useRouter();
  const create = useMutation(api.services.create);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "", titleAr: "", serviceType: "tour_guide",
    description: "", descriptionAr: "",
    priceRange: "", priceUnit: "per_hour",
    availability: "", availabilityAr: "",
    contactPhone: "", contactEmail: "",
    languages: "", images: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await create({
        title: form.title, titleAr: form.titleAr,
        serviceType: form.serviceType as any,
        description: form.description, descriptionAr: form.descriptionAr,
        priceRange: form.priceRange || undefined,
        priceUnit: form.priceUnit as any,
        availability: form.availability || undefined,
        availabilityAr: form.availabilityAr || undefined,
        contactPhone: form.contactPhone || undefined,
        contactEmail: form.contactEmail || undefined,
        languages: form.languages ? form.languages.split(",").map((s) => s.trim()) : [],
        images: form.images ? form.images.split(",").map((s) => s.trim()) : [],
      });
      router.push("/provider/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to create service.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-heading font-bold text-on-surface mb-8">Post Service</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-on-surface mb-1">Title (English)</label>
            <input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className="input" required /></div>
          <div><label className="block text-sm font-medium text-on-surface mb-1">Title (Arabic)</label>
            <input value={form.titleAr} onChange={(e) => setForm({...form, titleAr: e.target.value})} className="input" required /></div>
        </div>
        <div><label className="block text-sm font-medium text-on-surface mb-1">Service Type</label>
          <select value={form.serviceType} onChange={(e) => setForm({...form, serviceType: e.target.value})} className="input">
            {SERVICE_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-on-surface mb-1">Description (English)</label>
            <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="input" rows={3} required /></div>
          <div><label className="block text-sm font-medium text-on-surface mb-1">Description (Arabic)</label>
            <textarea value={form.descriptionAr} onChange={(e) => setForm({...form, descriptionAr: e.target.value})} className="input" rows={3} required /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-on-surface mb-1">Price Range</label>
            <input value={form.priceRange} onChange={(e) => setForm({...form, priceRange: e.target.value})} className="input" placeholder="e.g. 100-300 SAR" /></div>
          <div><label className="block text-sm font-medium text-on-surface mb-1">Price Unit</label>
            <select value={form.priceUnit} onChange={(e) => setForm({...form, priceUnit: e.target.value})} className="input">
              {PRICE_UNITS.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
            </select></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-on-surface mb-1">Contact Phone</label>
            <input value={form.contactPhone} onChange={(e) => setForm({...form, contactPhone: e.target.value})} className="input" /></div>
          <div><label className="block text-sm font-medium text-on-surface mb-1">Contact Email</label>
            <input type="email" value={form.contactEmail} onChange={(e) => setForm({...form, contactEmail: e.target.value})} className="input" /></div>
        </div>
        <div><label className="block text-sm font-medium text-on-surface mb-1">Languages (comma-separated)</label>
          <input value={form.languages} onChange={(e) => setForm({...form, languages: e.target.value})} className="input" placeholder="English, Arabic" /></div>
        <div><label className="block text-sm font-medium text-on-surface mb-1">Image URLs (comma-separated)</label>
          <input value={form.images} onChange={(e) => setForm({...form, images: e.target.value})} className="input" /></div>
        {error && <p className="text-sm text-error bg-error/10 rounded-lg px-3 py-2">{error}</p>}
        <div className="flex gap-3">
          <button type="button" onClick={() => router.back()} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={submitting} className="btn-primary">{submitting ? "Posting..." : "Post Service"}</button>
        </div>
      </form>
    </div>
  );
}

export default function PostServicePage() {
  return <AuthGuard requiredRole="provider"><PostServiceContent /></AuthGuard>;
}
