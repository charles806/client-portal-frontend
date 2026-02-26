import { useState } from "react";
import { User, Bell, Lock, Palette, Globe, CreditCard, ChevronRight, Check } from "lucide-react";
import { Header } from "../components/layout/Header";

const settingsSections = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Lock },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "workspace", label: "Workspace", icon: Globe },
  { id: "billing", label: "Billing", icon: CreditCard },
];

export function Settings() {
  const [activeSection, setActiveSection] = useState("profile");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Settings"
        subtitle="Manage your account and workspace preferences"
      />

      <div className="p-6">
        <div className="flex gap-6">
          {/* Settings Sidebar */}
          <div className="w-52 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-2 space-y-0.5">
              {settingsSections.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveSection(id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-150 ${
                    activeSection === id
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Icon size={14} className={activeSection === id ? "text-indigo-600" : "text-gray-400"} />
                  <span style={{ fontSize: "13px", fontWeight: activeSection === id ? 600 : 500 }}>{label}</span>
                  {activeSection === id && <ChevronRight size={12} className="ml-auto text-indigo-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Settings Content */}
          <div className="flex-1 min-w-0 space-y-4">
            {activeSection === "profile" && <ProfileSettings onSave={handleSave} saved={saved} />}
            {activeSection === "notifications" && <NotificationSettings onSave={handleSave} saved={saved} />}
            {activeSection === "security" && <SecuritySettings onSave={handleSave} saved={saved} />}
            {activeSection === "appearance" && <AppearanceSettings onSave={handleSave} saved={saved} />}
            {activeSection === "workspace" && <WorkspaceSettings onSave={handleSave} saved={saved} />}
            {activeSection === "billing" && <BillingSettings />}
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsCard({ title, description, children, onSave, saved }: {
  title: string;
  description: string;
  children: React.ReactNode;
  onSave?: () => void;
  saved?: boolean;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-gray-900" style={{ fontSize: "14px", fontWeight: 600 }}>{title}</h2>
        <p className="text-gray-400 mt-0.5" style={{ fontSize: "12.5px" }}>{description}</p>
      </div>
      <div className="px-6 py-5">{children}</div>
      {onSave && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            className="px-4 py-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            style={{ fontSize: "13px", fontWeight: 500 }}
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              saved
                ? "bg-emerald-600 text-white"
                : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm"
            }`}
            style={{ fontSize: "13px", fontWeight: 500 }}
          >
            {saved ? <><Check size={14} /> Saved</> : "Save Changes"}
          </button>
        </div>
      )}
    </div>
  );
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-gray-700" style={{ fontSize: "12.5px", fontWeight: 500 }}>{label}</label>
      {children}
      {hint && <p className="text-gray-400" style={{ fontSize: "11.5px" }}>{hint}</p>}
    </div>
  );
}

const inputClass = "border border-gray-200 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all";

function ProfileSettings({ onSave, saved }: { onSave: () => void; saved: boolean }) {
  return (
    <SettingsCard
      title="Profile Information"
      description="Update your personal details and account information"
      onSave={onSave}
      saved={saved}
    >
      <div className="space-y-5">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white" style={{ fontSize: "20px", fontWeight: 700 }}>JD</span>
          </div>
          <div>
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors" style={{ fontSize: "13px", fontWeight: 500 }}>
              Change photo
            </button>
            <p className="text-gray-400 mt-1" style={{ fontSize: "11.5px" }}>JPG, GIF or PNG. 1MB max.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="First Name">
            <input type="text" defaultValue="Jamie" className={inputClass} style={{ fontSize: "13.5px" }} />
          </Field>
          <Field label="Last Name">
            <input type="text" defaultValue="Dawson" className={inputClass} style={{ fontSize: "13.5px" }} />
          </Field>
        </div>
        <Field label="Email Address" hint="We'll send account notifications to this email">
          <input type="email" defaultValue="jamie.dawson@company.com" className={inputClass} style={{ fontSize: "13.5px" }} />
        </Field>
        <Field label="Job Title">
          <input type="text" defaultValue="Account Manager" className={inputClass} style={{ fontSize: "13.5px" }} />
        </Field>
        <Field label="Timezone">
          <select className={`${inputClass} bg-white`} style={{ fontSize: "13.5px" }}>
            <option>America/New_York (UTC-5)</option>
            <option>America/Los_Angeles (UTC-8)</option>
            <option>Europe/London (UTC+0)</option>
            <option>Asia/Tokyo (UTC+9)</option>
          </select>
        </Field>
      </div>
    </SettingsCard>
  );
}

function NotificationSettings({ onSave, saved }: { onSave: () => void; saved: boolean }) {
  const [prefs, setPrefs] = useState({
    projectUpdates: true,
    milestones: true,
    invoices: true,
    teamActivity: false,
    weeklyReport: true,
    clientMessages: true,
  });

  return (
    <SettingsCard
      title="Notification Preferences"
      description="Choose what you want to be notified about"
      onSave={onSave}
      saved={saved}
    >
      <div className="space-y-4">
        {[
          { key: "projectUpdates", label: "Project Updates", desc: "When projects change status or milestones are hit" },
          { key: "milestones", label: "Milestone Alerts", desc: "Upcoming and overdue milestone reminders" },
          { key: "invoices", label: "Invoice Activity", desc: "When invoices are viewed, paid, or overdue" },
          { key: "teamActivity", label: "Team Activity", desc: "Comments, uploads, and approvals from your team" },
          { key: "weeklyReport", label: "Weekly Summary", desc: "Portfolio summary every Monday morning" },
          { key: "clientMessages", label: "Client Messages", desc: "Direct messages from client contacts" },
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
            <div>
              <p className="text-gray-800" style={{ fontSize: "13px", fontWeight: 500 }}>{item.label}</p>
              <p className="text-gray-400 mt-0.5" style={{ fontSize: "12px" }}>{item.desc}</p>
            </div>
            <button
              onClick={() => setPrefs({ ...prefs, [item.key]: !prefs[item.key as keyof typeof prefs] })}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 flex-shrink-0 ml-4 ${
                prefs[item.key as keyof typeof prefs] ? "bg-indigo-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
                  prefs[item.key as keyof typeof prefs] ? "translate-x-4" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </SettingsCard>
  );
}

function SecuritySettings({ onSave, saved }: { onSave: () => void; saved: boolean }) {
  return (
    <div className="space-y-4">
      <SettingsCard
        title="Change Password"
        description="Update your password to keep your account secure"
        onSave={onSave}
        saved={saved}
      >
        <div className="space-y-4">
          <Field label="Current Password">
            <input type="password" placeholder="••••••••" className={inputClass} style={{ fontSize: "13.5px" }} />
          </Field>
          <Field label="New Password" hint="Must be at least 12 characters">
            <input type="password" placeholder="••••••••" className={inputClass} style={{ fontSize: "13.5px" }} />
          </Field>
          <Field label="Confirm New Password">
            <input type="password" placeholder="••••••••" className={inputClass} style={{ fontSize: "13.5px" }} />
          </Field>
        </div>
      </SettingsCard>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-gray-900" style={{ fontSize: "14px", fontWeight: 600 }}>Two-Factor Authentication</h3>
            <p className="text-gray-400 mt-0.5" style={{ fontSize: "12.5px" }}>Add an extra layer of security to your account</p>
          </div>
          <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded-full" style={{ fontSize: "11px", fontWeight: 600 }}>
            Not enabled
          </span>
        </div>
        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors" style={{ fontSize: "13px", fontWeight: 500 }}>
          Enable 2FA
        </button>
      </div>
    </div>
  );
}

function AppearanceSettings({ onSave, saved }: { onSave: () => void; saved: boolean }) {
  const [theme, setTheme] = useState("light");
  const [accent, setAccent] = useState("indigo");

  return (
    <SettingsCard
      title="Appearance"
      description="Customize the look and feel of your dashboard"
      onSave={onSave}
      saved={saved}
    >
      <div className="space-y-6">
        <div>
          <p className="text-gray-700 mb-3" style={{ fontSize: "12.5px", fontWeight: 500 }}>Theme</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "light", label: "Light", preview: "bg-white border-gray-200" },
              { value: "dark", label: "Dark", preview: "bg-gray-900 border-gray-700" },
              { value: "system", label: "System", preview: "bg-gradient-to-br from-white to-gray-900 border-gray-300" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setTheme(opt.value)}
                className={`relative p-3 rounded-lg border-2 transition-all ${
                  theme === opt.value ? "border-indigo-500" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className={`h-12 rounded-md ${opt.preview} border mb-2`} />
                <p className="text-gray-700 text-center" style={{ fontSize: "12px", fontWeight: 500 }}>{opt.label}</p>
                {theme === opt.value && (
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-indigo-600 flex items-center justify-center">
                    <Check size={10} className="text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-gray-700 mb-3" style={{ fontSize: "12.5px", fontWeight: 500 }}>Accent Color</p>
          <div className="flex items-center gap-2.5">
            {[
              { value: "indigo", color: "bg-indigo-600" },
              { value: "blue", color: "bg-blue-600" },
              { value: "violet", color: "bg-violet-600" },
              { value: "emerald", color: "bg-emerald-600" },
              { value: "rose", color: "bg-rose-500" },
            ].map((c) => (
              <button
                key={c.value}
                onClick={() => setAccent(c.value)}
                className={`w-8 h-8 rounded-full ${c.color} transition-transform hover:scale-110 ${
                  accent === c.value ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : ""
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </SettingsCard>
  );
}

function WorkspaceSettings({ onSave, saved }: { onSave: () => void; saved: boolean }) {
  return (
    <SettingsCard
      title="Workspace Settings"
      description="Configure your organization and workspace preferences"
      onSave={onSave}
      saved={saved}
    >
      <div className="space-y-5">
        <Field label="Company Name">
          <input type="text" defaultValue="Acme Consulting Group" className={inputClass} style={{ fontSize: "13.5px" }} />
        </Field>
        <Field label="Company Website">
          <input type="url" defaultValue="https://acme-consulting.com" className={inputClass} style={{ fontSize: "13.5px" }} />
        </Field>
        <Field label="Default Currency">
          <select className={`${inputClass} bg-white`} style={{ fontSize: "13.5px" }}>
            <option>USD — US Dollar</option>
            <option>EUR — Euro</option>
            <option>GBP — British Pound</option>
            <option>CAD — Canadian Dollar</option>
          </select>
        </Field>
        <Field label="Fiscal Year Start">
          <select className={`${inputClass} bg-white`} style={{ fontSize: "13.5px" }}>
            <option>January</option>
            <option>April</option>
            <option>July</option>
            <option>October</option>
          </select>
        </Field>
      </div>
    </SettingsCard>
  );
}

function BillingSettings() {
  return (
    <div className="space-y-4">
      {/* Current Plan */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-gray-900" style={{ fontSize: "14px", fontWeight: 600 }}>Current Plan</h3>
            <p className="text-gray-400 mt-0.5" style={{ fontSize: "12.5px" }}>You're on the Professional plan</p>
          </div>
          <span className="px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-full" style={{ fontSize: "12px", fontWeight: 600 }}>
            Professional
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100 mb-4">
          {[
            { label: "Billing Cycle", value: "Monthly" },
            { label: "Next Invoice", value: "Mar 24, 2026" },
            { label: "Amount", value: "$149/mo" },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-gray-400" style={{ fontSize: "11.5px" }}>{item.label}</p>
              <p className="text-gray-900 mt-0.5" style={{ fontSize: "13.5px", fontWeight: 600 }}>{item.value}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors" style={{ fontSize: "13px", fontWeight: 500 }}>
            Upgrade to Enterprise
          </button>
          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors" style={{ fontSize: "13px", fontWeight: 500 }}>
            View all plans
          </button>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-gray-900 mb-4" style={{ fontSize: "14px", fontWeight: 600 }}>Payment Method</h3>
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-7 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white" style={{ fontSize: "9px", fontWeight: 700 }}>VISA</span>
            </div>
            <div>
              <p className="text-gray-900" style={{ fontSize: "13px", fontWeight: 500 }}>•••• •••• •••• 4242</p>
              <p className="text-gray-400" style={{ fontSize: "11.5px" }}>Expires 09/2028</p>
            </div>
          </div>
          <button className="text-indigo-600 hover:text-indigo-700 transition-colors" style={{ fontSize: "12.5px", fontWeight: 500 }}>
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
