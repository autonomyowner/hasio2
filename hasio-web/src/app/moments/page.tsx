"use client";

import { useState } from "react";
import Image from "next/image";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { AuthGuard } from "@/components/ui/AuthGuard";
import { EmptyState } from "@/components/ui/EmptyState";
import { CardGridSkeleton } from "@/components/ui/LoadingSkeleton";

function MomentsContent() {
  const moments = useQuery(api.moments.list);
  const createMoment = useMutation(api.moments.create);
  const removeMoment = useMutation(api.moments.remove);

  const [showAddModal, setShowAddModal] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [note, setNote] = useState("");
  const [location, setLocation] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) return;
    setSubmitting(true);
    try {
      await createMoment({ image: imageUrl, note: note || undefined, location: location || undefined });
      setShowAddModal(false);
      setImageUrl("");
      setNote("");
      setLocation("");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: any) => {
    if (confirm("Delete this moment?")) {
      await removeMoment({ id });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-heading font-bold text-on-surface">Moments</h1>
        <button onClick={() => setShowAddModal(true)} className="btn-primary">
          Add Moment
        </button>
      </div>

      {moments === undefined ? (
        <CardGridSkeleton count={4} />
      ) : moments.length === 0 ? (
        <EmptyState
          message="No moments yet. Capture your Al-Ahsa memories."
          actionLabel="Add Moment"
          onAction={() => setShowAddModal(true)}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {moments.map((moment) => (
            <div key={moment._id} className="card group relative">
              <div className="relative aspect-square">
                <Image
                  src={moment.image}
                  alt={moment.note || "Moment"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>
              <div className="p-2">
                {moment.note && (
                  <p className="text-sm text-on-surface truncate">{moment.note}</p>
                )}
                {moment.location && (
                  <p className="text-xs text-on-surface-muted truncate">{moment.location}</p>
                )}
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-on-surface-muted">
                    {new Date(moment.timestamp).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => handleDelete(moment._id)}
                    className="text-xs text-error bg-transparent border-none cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-xl w-full max-w-md p-6">
            <h2 className="text-xl font-heading font-bold text-on-surface mb-4">
              Add Moment
            </h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="input"
                  placeholder="https://..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">
                  Note (optional)
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="input"
                  placeholder="A brief description..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">
                  Location (optional)
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="input"
                  placeholder="Where was this taken?"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !imageUrl}
                  className="btn-primary"
                >
                  {submitting ? "Adding..." : "Add Moment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MomentsPage() {
  return (
    <AuthGuard>
      <MomentsContent />
    </AuthGuard>
  );
}
