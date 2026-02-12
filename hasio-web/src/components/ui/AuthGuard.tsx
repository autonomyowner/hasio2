"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: "business" | "provider" | "admin";
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const router = useRouter();
  const { isLoaded, isSignedIn, user, isUserLoading } = useCurrentUser();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/auth");
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (requiredRole && user && user.userType !== requiredRole && user.userType !== "admin") {
      router.push("/");
    }
  }, [requiredRole, user, router]);

  if (!isLoaded || isUserLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-on-surface-variant">Loading...</p>
      </div>
    );
  }

  if (!isSignedIn) return null;

  if (requiredRole && user && user.userType !== requiredRole && user.userType !== "admin") {
    return null;
  }

  return <>{children}</>;
}
