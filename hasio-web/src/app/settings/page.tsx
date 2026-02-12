"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useLanguage } from "@/hooks/useLanguage";
import { authClient } from "@/lib/auth-client";
import { AuthGuard } from "@/components/ui/AuthGuard";
import Link from "next/link";

function SettingsContent() {
  const router = useRouter();
  const { user, userType } = useCurrentUser();
  const { t, toggleLanguage, language } = useLanguage();
  const updateProfile = useMutation(api.users.updateProfile);
  const upgradeUserType = useMutation(api.users.upgradeUserType);
  const deleteUser = useMutation(api.users.deleteUser);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setPhone(user.phone || "");
      setBio(user.bio || "");
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await updateProfile({
        fullName: fullName || undefined,
        phone: phone || undefined,
        bio: bio || undefined,
      });
      setMessage("Profile updated successfully.");
    } catch (err: any) {
      setMessage(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpgrade = async (type: "business" | "provider") => {
    if (!confirm(`Upgrade your account to ${type}?`)) return;
    try {
      await upgradeUserType({ userType: type });
      setMessage(`Account upgraded to ${type}.`);
    } catch (err: any) {
      setMessage(err.message || "Failed to upgrade account.");
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) return;
    if (!confirm("This will permanently delete all your data. Continue?")) return;
    try {
      await deleteUser();
      await authClient.signOut();
      router.push("/");
    } catch (err: any) {
      setMessage(err.message || "Failed to delete account.");
    }
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-heading font-bold text-on-surface mb-8">
        {t("settings")}
      </h1>

      {message && (
        <p className={`text-sm px-3 py-2 rounded-lg mb-6 ${
          message.includes("success") || message.includes("updated")
            ? "bg-success/10 text-success"
            : "bg-error/10 text-error"
        }`}>
          {message}
        </p>
      )}

      {/* Profile */}
      <section className="mb-8">
        <h2 className="text-lg font-heading font-bold text-on-surface mb-4">Profile</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Email</label>
            <input type="email" value={user?.email || ""} disabled className="input bg-surface-variant" />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="input"
            />
          </div>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </section>

      {/* Language */}
      <section className="mb-8 border-t border-border pt-8">
        <h2 className="text-lg font-heading font-bold text-on-surface mb-4">Language</h2>
        <button onClick={toggleLanguage} className="btn-secondary">
          {language === "en" ? "Switch to Arabic (العربية)" : "Switch to English"}
        </button>
      </section>

      {/* Upgrade */}
      {userType === "user" && (
        <section className="mb-8 border-t border-border pt-8">
          <h2 className="text-lg font-heading font-bold text-on-surface mb-4">
            Upgrade Account
          </h2>
          <p className="text-sm text-on-surface-variant mb-4">
            Upgrade to post content or offer services on Hasio.
          </p>
          <div className="flex gap-3">
            <button onClick={() => handleUpgrade("business")} className="btn-secondary">
              Become Business Owner
            </button>
            <button onClick={() => handleUpgrade("provider")} className="btn-secondary">
              Become Service Provider
            </button>
          </div>
        </section>
      )}

      {/* Privacy */}
      <section className="mb-8 border-t border-border pt-8">
        <h2 className="text-lg font-heading font-bold text-on-surface mb-4">Legal</h2>
        <Link href="/privacy-policy" className="text-sm text-primary hover:underline">
          Privacy Policy
        </Link>
      </section>

      {/* Danger Zone */}
      <section className="border-t border-border pt-8">
        <h2 className="text-lg font-heading font-bold text-on-surface mb-4">Account</h2>
        <div className="space-y-3">
          <button onClick={handleSignOut} className="btn-secondary w-full">
            {t("signOut")}
          </button>
          <button
            onClick={handleDeleteAccount}
            className="w-full py-3 px-4 bg-error/10 text-error rounded-lg font-semibold text-sm hover:bg-error/20 transition-colors border-none cursor-pointer"
          >
            Delete Account
          </button>
        </div>
      </section>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <AuthGuard>
      <SettingsContent />
    </AuthGuard>
  );
}
