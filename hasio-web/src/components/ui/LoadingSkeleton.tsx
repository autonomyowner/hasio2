"use client";

export function CardSkeleton() {
  return (
    <div className="card">
      <div className="aspect-[4/3] skeleton" />
      <div className="p-3 space-y-2">
        <div className="h-4 w-3/4 skeleton" />
        <div className="h-3 w-1/2 skeleton" />
      </div>
    </div>
  );
}

export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="aspect-[16/9] skeleton" />
      <div className="space-y-3">
        <div className="h-8 w-2/3 skeleton" />
        <div className="h-4 w-1/3 skeleton" />
        <div className="h-4 w-full skeleton" />
        <div className="h-4 w-full skeleton" />
        <div className="h-4 w-2/3 skeleton" />
      </div>
    </div>
  );
}
