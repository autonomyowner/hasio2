"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { AuthGuard } from "@/components/ui/AuthGuard";

const TYPES = [
  { value: "hotel", label: "Hotel" },
  { value: "apartment", label: "Apartment" },
  { value: "camp", label: "Camp" },
  { value: "homestay", label: "Homestay" },
];

function PostLodgingContent() {
  const router = useRouter();
  const create = useMutation(api.lodgings.create);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "", nameAr: "", type: "hotel",
    city: "", cityAr: "",
    neighborhood: "", neighborhoodAr: "",
    priceRange: "", description: "", descriptionAr: "",
    amenities: "", amenitiesAr: "", images: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await create({
        name: form.name,
        nameAr: form.nameAr,
        type: form.type as any,
        city: form.city,
        cityAr: form.cityAr,
        neighborhood: form.neighborhood || undefined,
        neighborhoodAr: form.neighborhoodAr || undefined,
        priceRange: form.priceRange || undefined,
        description: form.description || undefined,
        descriptionAr: form.descriptionAr || undefined,
        amenities: form.amenities ? form.amenities.split(",").map((s) => s.trim()) : [],
        amenitiesAr: form.amenitiesAr ? form.amenitiesAr.split(",").map((s) => s.trim()) : [],
        images: form.images ? form.images.split(",").map((s) => s.trim()) : [],
      });
      router.push("/business/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to create lodging.");
    } finally {
      setSubmitting(false);
    }
  };

  const field = (label: string, key: keyof typeof form, opts?: { type?: string; required?: boolean; placeholder?: string }) => (
    <div>
      <label className="block text-sm font-medium text-on-surface mb-1">{label}</label>
      <input
        type={opts?.type || "text"}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className="input"
        required={opts?.required}
        placeholder={opts?.placeholder}
      />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-heading font-bold text-on-surface mb-8">Post Lodging</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {field("Name (English)", "name", { required: true })}
          {field("Name (Arabic)", "nameAr", { required: true })}
        </div>

        <div>
          <label className="block text-sm font-medium text-on-surface mb-1">Type</label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="input"
          >
            {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {field("City (English)", "city", { required: true })}
          {field("City (Arabic)", "cityAr", { required: true })}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {field("Neighborhood (English)", "neighborhood")}
          {field("Neighborhood (Arabic)", "neighborhoodAr")}
        </div>

        {field("Price Range", "priceRange", { placeholder: "e.g. 200-500 SAR" })}

        <div className="grid grid-cols-2 gap-4">
          {field("Description (English)", "description")}
          {field("Description (Arabic)", "descriptionAr")}
        </div>

        {field("Amenities (English, comma-separated)", "amenities", { placeholder: "WiFi, Pool, Parking" })}
        {field("Amenities (Arabic, comma-separated)", "amenitiesAr", { placeholder: "واي فاي, مسبح, موقف سيارات" })}
        {field("Image URLs (comma-separated)", "images", { placeholder: "https://..." })}

        {error && <p className="text-sm text-error bg-error/10 rounded-lg px-3 py-2">{error}</p>}

        <div className="flex gap-3">
          <button type="button" onClick={() => router.back()} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? "Posting..." : "Post Lodging"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function PostLodgingPage() {
  return (
    <AuthGuard requiredRole="business">
      <PostLodgingContent />
    </AuthGuard>
  );
}
