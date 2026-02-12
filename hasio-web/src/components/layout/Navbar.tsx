"use client";

import { useState } from "react";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useLanguage } from "@/hooks/useLanguage";
import { authClient } from "@/lib/auth-client";

export function Navbar() {
  const { isSignedIn, user, isLoaded, isBusinessOwner, isServiceProvider, isAdmin } =
    useCurrentUser();
  const { language, toggleLanguage, t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await authClient.signOut();
    window.location.href = "/";
  };

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/lodging", label: t("lodging") },
    { href: "/food", label: t("food") },
    { href: "/events", label: t("events") },
    { href: "/destinations", label: "Destinations" },
    { href: "/planner", label: t("planner") },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-surface/95 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-heading font-bold text-primary no-underline">
            Hasio
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors no-underline"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Language toggle */}
            <button
              onClick={toggleLanguage}
              className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors bg-transparent border-none cursor-pointer px-2 py-1"
            >
              {language === "en" ? "AR" : "EN"}
            </button>

            {/* Auth */}
            {!isLoaded ? (
              <div className="w-16 h-8 skeleton" />
            ) : isSignedIn ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="text-sm font-medium text-on-surface hover:text-primary transition-colors bg-transparent border-none cursor-pointer"
                >
                  {user?.fullName || "Account"}
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 rtl:right-auto rtl:left-0 top-full mt-2 w-48 bg-surface rounded-lg border border-border shadow-lg py-1 z-50">
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm text-on-surface hover:bg-surface-variant no-underline"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      {t("settings")}
                    </Link>
                    <Link
                      href="/favorites"
                      className="block px-4 py-2 text-sm text-on-surface hover:bg-surface-variant no-underline"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Favorites
                    </Link>
                    <Link
                      href="/moments"
                      className="block px-4 py-2 text-sm text-on-surface hover:bg-surface-variant no-underline"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      {t("moments")}
                    </Link>
                    {isBusinessOwner && (
                      <Link
                        href="/business/dashboard"
                        className="block px-4 py-2 text-sm text-on-surface hover:bg-surface-variant no-underline"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Business Dashboard
                      </Link>
                    )}
                    {isServiceProvider && (
                      <Link
                        href="/provider/dashboard"
                        className="block px-4 py-2 text-sm text-on-surface hover:bg-surface-variant no-underline"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Provider Dashboard
                      </Link>
                    )}
                    {isAdmin && (
                      <Link
                        href="/admin/dashboard"
                        className="block px-4 py-2 text-sm text-on-surface hover:bg-surface-variant no-underline"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <div className="border-t border-border my-1" />
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left rtl:text-right px-4 py-2 text-sm text-error hover:bg-surface-variant bg-transparent border-none cursor-pointer"
                    >
                      {t("signOut")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth" className="btn-primary text-sm no-underline">
                Sign In
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden text-sm font-medium text-on-surface-variant bg-transparent border-none cursor-pointer"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-surface">
          <div className="px-4 py-3 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 text-sm font-medium text-on-surface-variant hover:text-primary no-underline"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Click outside to close menus */}
      {(userMenuOpen || mobileOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setUserMenuOpen(false);
            setMobileOpen(false);
          }}
        />
      )}
    </nav>
  );
}
