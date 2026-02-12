"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { AuthGuard } from "@/components/ui/AuthGuard";

const CATEGORIES = [
  { value: "festival", label: "Festival" },
  { value: "conference", label: "Conference" },
  { value: "outdoor", label: "Outdoor" },
  { value: "indoor", label: "Indoor" },
  { value: "seasonal", label: "Seasonal" },
];

function PostEventContent() {
  const router = useRouter();
  const create = useMutation(api.events.create);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "", titleAr: "", category: "festival",
    date: "", time: "", location: "", locationAr: "",
    description: "", descriptionAr: "", images: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await create({
        title: form.title, titleAr: form.titleAr,
        category: form.category as any, date: form.date,
        time: form.time || undefined,
        location: form.location || undefined, locationAr: form.locationAr || undefined,
        description: form.description || undefined, descriptionAr: form.descriptionAr || undefined,
        images: form.images ? form.images.split(",").map((s) => s.trim()) : [],
      });
      router.push("/business/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to create event.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-heading font-bold text-on-surface mb-8">Post Event</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-on-surface mb-1">Title (English)</label>
            <input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className="input" required /></div>
          <div><label className="block text-sm font-medium text-on-surface mb-1">Title (Arabic)</label>
            <input value={form.titleAr} onChange={(e) => setForm({...form, titleAr: e.target.value})} className="input" required /></div>
        </div>
        <div><label className="block text-sm font-medium text-on-surface mb-1">Category</label>
          <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} className="input">
            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-on-surface mb-1">Date</label>
            <input type="date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} className="input" required /></div>
          <div><label className="block text-sm font-medium text-on-surface mb-1">Time</label>
            <input type="time" value={form.time} onChange={(e) => setForm({...form, time: e.target.value})} className="input" /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-on-surface mb-1">Location (English)</label>
            <input value={form.location} onChange={(e) => setForm({...form, location: e.target.value})} className="input" /></div>
          <div><label className="block text-sm font-medium text-on-surface mb-1">Location (Arabic)</label>
            <input value={form.locationAr} onChange={(e) => setForm({...form, locationAr: e.target.value})} className="input" /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-on-surface mb-1">Description (English)</label>
            <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="input" rows={3} /></div>
          <div><label className="block text-sm font-medium text-on-surface mb-1">Description (Arabic)</label>
            <textarea value={form.descriptionAr} onChange={(e) => setForm({...form, descriptionAr: e.target.value})} className="input" rows={3} /></div>
        </div>
        <div><label className="block text-sm font-medium text-on-surface mb-1">Image URLs (comma-separated)</label>
          <input value={form.images} onChange={(e) => setForm({...form, images: e.target.value})} className="input" /></div>
        {error && <p className="text-sm text-error bg-error/10 rounded-lg px-3 py-2">{error}</p>}
        <div className="flex gap-3">
          <button type="button" onClick={() => router.back()} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={submitting} className="btn-primary">{submitting ? "Posting..." : "Post Event"}</button>
        </div>
      </form>
    </div>
  );
}

export default function PostEventPage() {
  return <AuthGuard requiredRole="business"><PostEventContent /></AuthGuard>;
}
