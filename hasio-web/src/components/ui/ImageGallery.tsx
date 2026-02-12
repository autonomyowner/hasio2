"use client";

import { useState } from "react";
import Image from "next/image";

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

export function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!images.length) {
    return (
      <div className="aspect-[16/9] bg-surface-variant rounded-xl flex items-center justify-center text-on-surface-muted">
        No images available
      </div>
    );
  }

  return (
    <>
      <div
        className="relative aspect-[16/9] rounded-xl overflow-hidden cursor-pointer"
        onClick={() => setLightboxOpen(true)}
      >
        <Image
          src={images[selectedIndex]}
          alt={`${alt} - ${selectedIndex + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 800px"
          priority
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={`relative w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                i === selectedIndex
                  ? "border-primary"
                  : "border-transparent hover:border-border"
              }`}
            >
              <Image
                src={img}
                alt={`${alt} thumbnail ${i + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full mx-4">
            <Image
              src={images[selectedIndex]}
              alt={alt}
              width={1200}
              height={800}
              className="object-contain w-full h-full max-h-[90vh]"
            />
            <button
              className="absolute top-4 right-4 text-white text-lg bg-black/50 px-3 py-1 rounded-lg border-none cursor-pointer"
              onClick={() => setLightboxOpen(false)}
            >
              Close
            </button>
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {selectedIndex > 0 && (
                  <button
                    className="text-white bg-black/50 px-4 py-2 rounded-lg border-none cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedIndex(selectedIndex - 1);
                    }}
                  >
                    Previous
                  </button>
                )}
                <span className="text-white bg-black/50 px-4 py-2 rounded-lg">
                  {selectedIndex + 1} / {images.length}
                </span>
                {selectedIndex < images.length - 1 && (
                  <button
                    className="text-white bg-black/50 px-4 py-2 rounded-lg border-none cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedIndex(selectedIndex + 1);
                    }}
                  >
                    Next
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
