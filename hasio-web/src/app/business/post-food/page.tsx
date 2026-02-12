"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { AuthGuard } from "@/components/ui/AuthGuard";

const CATEGORIES = [
  { value: "restaurant", label: "Restaurant" },
  { value: "home_kitchen", label: "Productive Family" },
  { value: "fastfood", label: "Fast Food" },
  { value: "drinks", label: "Drinks" },
];

function PostFoodContent() {
  const router = useRouter();
  const create = useMutation(api.foods.create);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "", nameAr: "", category: "restaurant",
    cuisine: "", cuisineAr: "", avgPrice: "", hours: "",
    description: "", descriptionAr: "", images: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await create({
        name: form.name, nameAr: form.nameAr,
        category: form.category as any,
        cuisine: form.cuisine || undefined, cuisineAr: form.cuisineAr || undefined,
        avgPrice: form.avgPrice || undefined, hours: form.hours || undefined,
        description: form.description || undefined, descriptionAr: form.descriptionAr || undefined,
        images: form.images ? form.images.split(",").map((s) => s.trim()) : [],
      });
      router.push("/business/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to create food listing.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-heading font-bold text-on-surface mb-8">Post Food</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Name (English)</label>
            <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="input" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Name (Arabic)</label>
            <input value={form.nameAr} onChange={(e) => setForm({...form, nameAr: e.target.value})} className="input" required />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-on-surface mb-1">Category</label>
          <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} className="input">
            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Cuisine (English)</label>
            <input value={form.cuisine} onChange={(e) => setForm({...form, cuisine: e.target.value})} className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Cuisine (Arabic)</label>
            <input value={form.cuisineAr} onChange={(e) => setForm({...form, cuisineAr: e.target.value})} className="input" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Avg Price</label>
            <input value={form.avgPrice} onChange={(e) => setForm({...form, avgPrice: e.target.value})} className="input" placeholder="e.g. 30-80 SAR" />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Hours</label>
            <input value={form.hours} onChange={(e) => setForm({...form, hours: e.target.value})} className="input" placeholder="e.g. 10am-11pm" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Description (English)</label>
            <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="input" rows={3} />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Description (Arabic)</label>
            <textarea value={form.descriptionAr} onChange={(e) => setForm({...form, descriptionAr: e.target.value})} className="input" rows={3} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-on-surface mb-1">Image URLs (comma-separated)</label>
          <input value={form.images} onChange={(e) => setForm({...form, images: e.target.value})} className="input" />
        </div>
        {error && <p className="text-sm text-error bg-error/10 rounded-lg px-3 py-2">{error}</p>}
        <div className="flex gap-3">
          <button type="button" onClick={() => router.back()} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={submitting} className="btn-primary">{submitting ? "Posting..." : "Post Food"}</button>
        </div>
      </form>
    </div>
  );
}

export default function PostFoodPage() {
  return <AuthGuard requiredRole="business"><PostFoodContent /></AuthGuard>;
}
