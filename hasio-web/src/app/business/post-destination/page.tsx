"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { AuthGuard } from "@/components/ui/AuthGuard";

const CATEGORIES = [
  { value: "historical", label: "Historical" },
  { value: "natural", label: "Natural" },
  { value: "cultural", label: "Cultural" },
  { value: "recreational", label: "Recreational" },
  { value: "religious", label: "Religious" },
];

function PostDestinationContent() {
  const router = useRouter();
  const create = useMutation(api.destinations.create);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "", nameAr: "", category: "historical",
    city: "", cityAr: "", address: "", addressAr: "",
    latitude: "", longitude: "",
    description: "", descriptionAr: "",
    subtitle: "", subtitleAr: "", images: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await create({
        name: form.name, nameAr: form.nameAr,
        category: form.category as any,
        city: form.city || undefined, cityAr: form.cityAr || undefined,
        address: form.address || undefined, addressAr: form.addressAr || undefined,
        latitude: form.latitude ? parseFloat(form.latitude) : undefined,
        longitude: form.longitude ? parseFloat(form.longitude) : undefined,
        description: form.description || undefined, descriptionAr: form.descriptionAr || undefined,
        subtitle: form.subtitle || undefined, subtitleAr: form.subtitleAr || undefined,
        images: form.images ? form.images.split(",").map((s) => s.trim()) : [],
      });
      router.push("/business/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to create destination.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-heading font-bold text-on-surface mb-8">Post Destination</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-on-surface mb-1">Name (English)</label>
            <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="input" required /></div>
          <div><label className="block text-sm font-medium text-on-surface mb-1">Name (Arabic)</label>
            <input value={form.nameAr} onChange={(e) => setForm({...form, nameAr: e.target.value})} className="input" required /></div>
        </div>
        <div><label className="block text-sm font-medium text-on-surface mb-1">Category</label>
          <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} className="input">
            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-on-surface mb-1">City (English)</label>
            <input value={form.city} onChange={(e) => setForm({...form, city: e.target.value})} className="input" /></div>
          <div><label className="block text-sm font-medium text-on-surface mb-1">City (Arabic)</label>
            <input value={form.cityAr} onChange={(e) => setForm({...form, cityAr: e.target.value})} className="input" /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-on-surface mb-1">Subtitle (English)</label>
            <input value={form.subtitle} onChange={(e) => setForm({...form, subtitle: e.target.value})} className="input" /></div>
          <div><label className="block text-sm font-medium text-on-surface mb-1">Subtitle (Arabic)</label>
            <input value={form.subtitleAr} onChange={(e) => setForm({...form, subtitleAr: e.target.value})} className="input" /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-on-surface mb-1">Latitude</label>
            <input type="number" step="any" value={form.latitude} onChange={(e) => setForm({...form, latitude: e.target.value})} className="input" /></div>
          <div><label className="block text-sm font-medium text-on-surface mb-1">Longitude</label>
            <input type="number" step="any" value={form.longitude} onChange={(e) => setForm({...form, longitude: e.target.value})} className="input" /></div>
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
          <button type="submit" disabled={submitting} className="btn-primary">{submitting ? "Posting..." : "Post Destination"}</button>
        </div>
      </form>
    </div>
  );
}

export default function PostDestinationPage() {
  return <AuthGuard requiredRole="business"><PostDestinationContent /></AuthGuard>;
}
