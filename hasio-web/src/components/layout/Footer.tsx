"use client";

import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-surface border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <p className="text-2xl font-heading font-bold text-primary mb-2">
              Hasio
            </p>
            <p className="text-sm text-on-surface-variant">
              AI-powered travel guide for Al-Ahsa Oasis, a UNESCO World Heritage
              site.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-sm font-semibold text-on-surface mb-3">
              Explore
            </p>
            <div className="space-y-2">
              <Link
                href="/lodging"
                className="block text-sm text-on-surface-variant hover:text-primary no-underline"
              >
                {t("lodging")}
              </Link>
              <Link
                href="/food"
                className="block text-sm text-on-surface-variant hover:text-primary no-underline"
              >
                {t("food")}
              </Link>
              <Link
                href="/events"
                className="block text-sm text-on-surface-variant hover:text-primary no-underline"
              >
                {t("events")}
              </Link>
              <Link
                href="/destinations"
                className="block text-sm text-on-surface-variant hover:text-primary no-underline"
              >
                Destinations
              </Link>
              <Link
                href="/planner"
                className="block text-sm text-on-surface-variant hover:text-primary no-underline"
              >
                {t("planner")}
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <p className="text-sm font-semibold text-on-surface mb-3">Legal</p>
            <div className="space-y-2">
              <Link
                href="/privacy-policy"
                className="block text-sm text-on-surface-variant hover:text-primary no-underline"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-on-surface-muted">
            &copy; {new Date().getFullYear()} Hasio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
