import { useState } from "react";
import {
  User,
  Bell,
  Shield,
  Palette,
  Key,
  Save,
  Check,
} from "lucide-react";
import { Spinner } from "../components/ui/ios-spinner";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { sanitizeValue } from "../components/ui/sanitization";
import { Mail } from 'lucide-react';
import { AvatarUpload } from '../components/AvatarUpload';
import apiClient from '../services/api';
import { Header } from "../components/layout/Header";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

type Tab = "profile" | "notifications" | "security" | "appearance";

const tabs: { id: Tab; label: string; icon: typeof User }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "appearance", label: "Appearance", icon: Palette },
];

export default function Settings() {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  // const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'User' : "Alex Morgan",
    email: user?.email ?? "alex@nexusstudio.io",
    role: "Owner",
    bio: "Building great digital products with an amazing team.",
    timezone: "UTC-5 (Eastern Time)",
    language: "English",
  });
  const [notifications, setNotifications] = useState({
    email: {
      projectUpdates: true,
      milestones: true,
      invoices: true,
      teamActivity: false,
      weeklyDigest: true,
    },
    push: { desktop: true, mobile: false },
  });
  const [security, setSecurity] = useState({
    twoFactor: false,
    sessionTimeout: "24h",
  });
  const [appearance, setAppearance] = useState({
    theme: "light",
    density: "comfortable",
    accentColor: "indigo",
  });

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    toast.success("Settings saved successfully");
  };

  const handleAvatarUpload = async (url: string) => {
    try {
      await apiClient.patch('/auth/profile', { avatarUrl: url });
      await refreshUser();
      toast.success('Avatar updated!');
    } catch (error) {
      console.error('Failed to update avatar:', error);
    }
  };

  const Toggle = ({
    checked,
    onChange,
  }: {
    checked: boolean;
    onChange: () => void;
  }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${checked ? "bg-indigo-600" : "bg-slate-200"}`}
    >
      <span
        className={`inline-block size-3.5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-[18px]" : "translate-x-0.5"}`}
      />
    </button>
  );

  return (
    <div className="flex flex-col h-full">
      <Header title="Settings" subtitle="Manage your account preferences" />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Tab nav */}
            <div className="lg:w-48 shrink-0">
              <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-lg p-2">
                {tabs.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all cursor-pointer text-left ${activeTab === id ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"}`}
                    style={{ fontWeight: 500 }}
                  >
                    <Icon className="size-4 shrink-0" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab content */}
            <div className="flex-1">
              <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-lg p-6">
                {/* Profile tab */}
                {activeTab === "profile" && (
                  <div>
                    <h2
                      className="text-slate-900 mb-1"
                      style={{ fontWeight: 700, fontSize: "1rem" }}
                    >
                      Profile
                    </h2>
                    <p className="text-slate-500 text-sm mb-6">
                      Update your personal information
                    </p>

                    {/* Avatar */}
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-slate-700 mb-3">
                        Profile Picture
                      </label>
                      <AvatarUpload
                        currentUrl={user?.avatarUrl}
                        onUploadComplete={handleAvatarUpload}
                        size="lg"
                      />
                      <p className="text-slate-500 text-xs mt-2">
                        Click to upload a new avatar (max 5MB)
                      </p>
                    </div>


                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label
                            className="block text-slate-700 text-xs mb-1.5"
                            style={{ fontWeight: 600 }}
                          >
                            Full name
                          </label>
                          <Input
                            value={profile.name}
                            onChange={(e) =>
                              setProfile({ ...profile, name: e.target.value })
                            }
                            className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all text-sm"
                          />
                        </div>
                        <div>
                          <label
                            className="block text-slate-700 text-xs mb-1.5"
                            style={{ fontWeight: 600 }}
                          >
                            Email
                          </label>
                          <Input
                            type="email"
                            value={profile.email}
                            onChange={(e) =>
                              setProfile({ ...profile, email: e.target.value })
                            }
                            className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          className="block text-slate-700 text-xs mb-1.5"
                          style={{ fontWeight: 600 }}
                        >
                          Bio
                        </label>
                        <Textarea
                          value={profile.bio}
                          onChange={(e) =>
                            setProfile({ ...profile, bio: e.target.value })
                          }
                          rows={3}
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all text-sm resize-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label
                            className="block text-slate-700 text-xs mb-1.5"
                            style={{ fontWeight: 600 }}
                          >
                            Timezone
                          </label>
                          <select
                            value={profile.timezone}
                            onChange={(e) =>
                              setProfile({
                                ...profile,
                                timezone: sanitizeValue(e.target.value),
                              })
                            }
                            className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 outline-none focus:border-indigo-400 transition-all text-sm cursor-pointer"
                          >
                            <option>UTC-8 (Pacific Time)</option>
                            <option>UTC-7 (Mountain Time)</option>
                            <option>UTC-6 (Central Time)</option>
                            <option>UTC-5 (Eastern Time)</option>
                            <option>UTC+0 (GMT)</option>
                            <option>UTC+1 (CET)</option>
                          </select>
                        </div>
                        <div>
                          <label
                            className="block text-slate-700 text-xs mb-1.5"
                            style={{ fontWeight: 600 }}
                          >
                            Language
                          </label>
                          <select
                            value={profile.language}
                            onChange={(e) =>
                              setProfile({
                                ...profile,
                                language: sanitizeValue(e.target.value),
                              })
                            }
                            className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 outline-none focus:border-indigo-400 transition-all text-sm cursor-pointer"
                          >
                            <option>English</option>
                            <option>Spanish</option>
                            <option>French</option>
                            <option>German</option>
                            <option>Japanese</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications tab */}
                {activeTab === "notifications" && (
                  <div>
                    <h2
                      className="text-slate-900 mb-1"
                      style={{ fontWeight: 700, fontSize: "1rem" }}
                    >
                      Notifications
                    </h2>
                    <p className="text-slate-500 text-sm mb-6">
                      Choose when and how you want to be notified
                    </p>

                    <div className="space-y-6">
                      <div>
                        <p
                          className="text-slate-700 text-sm mb-3"
                          style={{ fontWeight: 700 }}
                        >
                          Email notifications
                        </p>
                        <div className="space-y-3">
                          {Object.entries(notifications.email).map(
                            ([key, value]) => (
                              <div
                                key={key}
                                className="flex items-center justify-between py-2 border-b border-slate-50"
                              >
                                <div>
                                  <p
                                    className="text-slate-700 text-sm capitalize"
                                    style={{ fontWeight: 500 }}
                                  >
                                    {key.replace(/([A-Z])/g, " $1").trim()}
                                  </p>
                                </div>
                                <Toggle
                                  checked={value}
                                  onChange={() =>
                                    setNotifications({
                                      ...notifications,
                                      email: {
                                        ...notifications.email,
                                        [key]: !value,
                                      },
                                    })
                                  }
                                />
                              </div>
                            ),
                          )}
                        </div>
                      </div>

                      <div>
                        <p
                          className="text-slate-700 text-sm mb-3"
                          style={{ fontWeight: 700 }}
                        >
                          Push notifications
                        </p>
                        <div className="space-y-3">
                          {Object.entries(notifications.push).map(
                            ([key, value]) => (
                              <div
                                key={key}
                                className="flex items-center justify-between py-2 border-b border-slate-50"
                              >
                                <p
                                  className="text-slate-700 text-sm capitalize"
                                  style={{ fontWeight: 500 }}
                                >
                                  {key} notifications
                                </p>
                                <Toggle
                                  checked={value}
                                  onChange={() =>
                                    setNotifications({
                                      ...notifications,
                                      push: {
                                        ...notifications.push,
                                        [key]: !value,
                                      },
                                    })
                                  }
                                />
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security tab */}
                {activeTab === "security" && (
                  <div>
                    <h2
                      className="text-slate-900 mb-1"
                      style={{ fontWeight: 700, fontSize: "1rem" }}
                    >
                      Security
                    </h2>
                    <p className="text-slate-500 text-sm mb-6">
                      Manage your account security settings
                    </p>

                    <div className="space-y-6">
                      {/* Change password */}
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="flex items-center gap-3 mb-3">
                          <Key className="size-4 text-slate-500" />
                          <p
                            className="text-slate-700 text-sm"
                            style={{ fontWeight: 700 }}
                          >
                            Change password
                          </p>
                        </div>
                        <div className="space-y-3">
                          <Input
                            type="password"
                            placeholder="Current password"
                            className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-400 transition-all text-sm"
                          />
                          <Input
                            type="password"
                            placeholder="New password"
                            className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-400 transition-all text-sm"
                          />
                          <Input
                            type="password"
                            placeholder="Confirm new password"
                            className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-400 transition-all text-sm"
                          />
                        </div>
                        <button
                          onClick={() => toast.success("Password updated")}
                          className="mt-3 px-4 py-2 rounded-xl bg-slate-900 text-white text-sm hover:bg-slate-800 transition-colors cursor-pointer"
                          style={{ fontWeight: 600 }}
                        >
                          Update password
                        </button>
                      </div>

                      {/* 2FA */}
                      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="flex items-center gap-3">
                          <Shield className="size-4 text-slate-500" />
                          <div>
                            <p
                              className="text-slate-700 text-sm"
                              style={{ fontWeight: 700 }}
                            >
                              Two-factor authentication
                            </p>
                            <p className="text-slate-400 text-xs mt-0.5">
                              Add an extra layer of security
                            </p>
                          </div>
                        </div>
                        <Toggle
                          checked={security.twoFactor}
                          onChange={() =>
                            setSecurity({
                              ...security,
                              twoFactor: !security.twoFactor,
                            })
                          }
                        />
                      </div>

                      {/* Sessions */}
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                        <p
                          className="text-slate-700 text-sm mb-3"
                          style={{ fontWeight: 700 }}
                        >
                          Active sessions
                        </p>
                        {[
                          "MacBook Pro — Chrome (Current)",
                          "iPhone 15 — Safari",
                        ].map((session, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
                          >
                            <div>
                              <p
                                className="text-slate-700 text-xs"
                                style={{ fontWeight: 500 }}
                              >
                                {session}
                              </p>
                              <p className="text-slate-400 text-xs">
                                Last active {i === 0 ? "now" : "2 hours ago"}
                              </p>
                            </div>
                            {i !== 0 && (
                              <button
                                onClick={() => toast.success("Session revoked")}
                                className="text-red-400 hover:text-red-600 text-xs transition-colors cursor-pointer"
                                style={{ fontWeight: 500 }}
                              >
                                Revoke
                              </button>
                            )}
                            {i === 0 && (
                              <span
                                className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200"
                                style={{ fontWeight: 500 }}
                              >
                                Current
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Appearance tab */}
                {activeTab === "appearance" && (
                  <div>
                    <h2
                      className="text-slate-900 mb-1"
                      style={{ fontWeight: 700, fontSize: "1rem" }}
                    >
                      Appearance
                    </h2>
                    <p className="text-slate-500 text-sm mb-6">
                      Customize the look and feel of your workspace
                    </p>

                    <div className="space-y-6">
                      {/* Theme */}
                      <div>
                        <p
                          className="text-slate-700 text-sm mb-3"
                          style={{ fontWeight: 700 }}
                        >
                          Theme
                        </p>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            {
                              id: "light",
                              label: "Light",
                              preview: "bg-white border-slate-200",
                            },
                            {
                              id: "dark",
                              label: "Dark",
                              preview: "bg-slate-900 border-slate-700",
                            },
                            {
                              id: "system",
                              label: "System",
                              preview:
                                "bg-gradient-to-br from-white to-slate-900 border-slate-300",
                            },
                          ].map(({ id, label, preview }) => (
                            <button
                              key={id}
                              onClick={() =>
                                setAppearance({ ...appearance, theme: id })
                              }
                              className={`relative rounded-xl border-2 p-3 cursor-pointer transition-all ${appearance.theme === id ? "border-indigo-500" : "border-slate-200 hover:border-slate-300"}`}
                            >
                              <div
                                className={`h-12 rounded-lg border ${preview} mb-2`}
                              />
                              <p
                                className="text-slate-700 text-xs text-center"
                                style={{ fontWeight: 500 }}
                              >
                                {label}
                              </p>
                              {appearance.theme === id && (
                                <div className="absolute top-1.5 right-1.5 size-4 rounded-full bg-indigo-600 flex items-center justify-center">
                                  <Check className="size-2.5 text-white" />
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Density */}
                      <div>
                        <p
                          className="text-slate-700 text-sm mb-3"
                          style={{ fontWeight: 700 }}
                        >
                          Density
                        </p>
                        <div className="flex items-center gap-2">
                          {["compact", "comfortable", "spacious"].map((d) => (
                            <button
                              key={d}
                              onClick={() =>
                                setAppearance({ ...appearance, density: d })
                              }
                              className={`flex-1 py-2.5 rounded-xl border text-xs capitalize cursor-pointer transition-all ${appearance.density === d ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-slate-200 text-slate-500 hover:border-slate-300"}`}
                              style={{ fontWeight: 600 }}
                            >
                              {d}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Accent color */}
                      <div>
                        <p
                          className="text-slate-700 text-sm mb-3"
                          style={{ fontWeight: 700 }}
                        >
                          Accent color
                        </p>
                        <div className="flex items-center gap-3">
                          {[
                            { id: "indigo", color: "bg-indigo-600" },
                            { id: "violet", color: "bg-violet-600" },
                            { id: "blue", color: "bg-blue-600" },
                            { id: "emerald", color: "bg-emerald-600" },
                            { id: "rose", color: "bg-rose-600" },
                            { id: "amber", color: "bg-amber-500" },
                          ].map(({ id, color }) => (
                            <button
                              key={id}
                              onClick={() =>
                                setAppearance({
                                  ...appearance,
                                  accentColor: id,
                                })
                              }
                              className={`size-8 rounded-full ${color} cursor-pointer transition-transform hover:scale-110 ${appearance.accentColor === id ? "ring-2 ring-offset-2 ring-current scale-110" : ""}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Save button */}
                <div className="mt-6 pt-5 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-700 transition-all cursor-pointer shadow-md shadow-indigo-200 disabled:opacity-60 text-sm"
                    style={{ fontWeight: 600 }}
                  >
                    {saving ? (
                      <Spinner size="sm" className="text-white" />
                    ) : (
                      <Save className="size-4" />
                    )}
                    {saving ? "Saving" : "Save changes"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
