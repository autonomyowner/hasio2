"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";

interface ContentCardProps {
  href: string;
  image?: string;
  title: string;
  titleAr?: string;
  subtitle?: string;
  subtitleAr?: string;
  rating?: number;
  price?: string;
  badge?: string;
}

export function ContentCard({
  href,
  image,
  title,
  titleAr,
  subtitle,
  subtitleAr,
  rating,
  price,
  badge,
}: ContentCardProps) {
  const { language } = useLanguage();
  const displayTitle = language === "ar" && titleAr ? titleAr : title;
  const displaySubtitle = language === "ar" && subtitleAr ? subtitleAr : subtitle;

  return (
    <Link href={href} className="card block no-underline group">
      <div className="relative aspect-[4/3] bg-surface-variant">
        {image ? (
          <Image
            src={image}
            alt={displayTitle}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-on-surface-muted text-sm">
            No image
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        {badge && (
          <span className="absolute top-3 left-3 rtl:left-auto rtl:right-3 bg-primary text-white text-xs font-semibold px-2 py-1 rounded-md">
            {badge}
          </span>
        )}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white font-heading font-bold text-lg leading-tight mb-0.5">
            {displayTitle}
          </h3>
          {displaySubtitle && (
            <p className="text-white/80 text-xs">{displaySubtitle}</p>
          )}
        </div>
      </div>
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {rating !== undefined && rating > 0 && (
            <span className="text-sm font-semibold text-gold">
              {rating.toFixed(1)}/5
            </span>
          )}
        </div>
        {price && (
          <span className="text-sm font-semibold text-primary">{price}</span>
        )}
      </div>
    </Link>
  );
}
