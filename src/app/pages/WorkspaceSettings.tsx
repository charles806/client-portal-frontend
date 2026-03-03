import { useState } from "react";
import {
  Building2,
  Users,
  CreditCard,
  Save,
  Plus,
  Trash2,
  Shield,
  Globe,
} from "lucide-react";

import { Header } from "../components/layout/Header";
import { Spinner } from "../components/ui/ios-spinner";

import { useWorkspaces } from "../hooks/useWorkspaces";
import { toast } from "sonner";
import type { WorkspaceMember } from "../store/workspaceStore";
import { useUser } from "@clerk/clerk-react";

type Tab = "general" | "members" | "billing";

const tabs: { id: Tab; label: string; icon: typeof Building2 }[] = [
  { id: "general", label: "General", icon: Building2 },
  { id: "members", label: "Members", icon: Users },
  { id: "billing", label: "Billing", icon: CreditCard },
];

const roleConfig: Record<
  WorkspaceMember["role"],
  { label: string; color: string }
> = {
  owner: {
    label: "Owner",
    color: "bg-indigo-100 text-indigo-700 border-indigo-200",
  },
  admin: {
    label: "Admin",
    color: "bg-violet-100 text-violet-700 border-violet-200",
  },
  member: {
    label: "Member",
    color: "bg-slate-100 text-slate-600 border-slate-200",
  },
  viewer: {
    label: "Viewer",
    color: "bg-amber-50 text-amber-600 border-amber-200",
  },
};

export default function WorkspaceSettings() {
  const { user } = useUser();
  const {
    workspace,
    updateSettings,
    inviteMember,
    kickMember,
    changeMemberRole,
  } = useWorkspaces();
  const [activeTab, setActiveTab] = useState<Tab>("general");
  const [saving, setSaving] = useState(false);
  const [wsForm, setWsForm] = useState({
    name: workspace.name,
    industry: workspace.industry,
    website: workspace.website,
  });
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] =
    useState<WorkspaceMember["role"]>("member");
  const [inviting, setInviting] = useState(false);

  const handleSaveGeneral = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 900));
    updateSettings({
      name: wsForm.name,
      industry: wsForm.industry,
      website: wsForm.website,
    });
    setSaving(false);
    toast.success("Workspace settings saved");
  };

  const handleInvite = async () => {
    if (!inviteEmail) {
      toast.error("Please enter an email address");
      return;
    }
    setInviting(true);
    await new Promise((r) => setTimeout(r, 800));
    inviteMember({
      name: inviteEmail.split("@")[0],
      email: inviteEmail,
      role: inviteRole,
      avatar: inviteEmail.slice(0, 2).toUpperCase(),
      status: "invited",
    });
    setInviteEmail("");
    setInviting(false);
    toast.success(`Invitation sent to ${inviteEmail}`);
  };

  const handleRemove = (member: WorkspaceMember) => {
    if (!confirm(`Remove ${member.name} from the workspace?`)) return;
    kickMember(member.id);
    toast.success(`${member.name} removed from workspace`);
  };

  const planDetails = {
    starter: {
      name: "Starter",
      price: 29,
      color: "text-slate-600",
      bg: "bg-slate-50",
    },
    pro: {
      name: "Pro",
      price: 79,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    enterprise: {
      name: "Enterprise",
      price: 199,
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
  };

  const currentPlan = planDetails[workspace.plan];

  return (
    <div className="flex flex-col h-full">
      <Header title="Workspace Settings" subtitle={workspace.name} />

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

            {/* Content */}
            <div className="flex-1">
              {/* General tab */}
              {activeTab === "general" && (
                <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-lg p-6">
                  <h2
                    className="text-slate-900 mb-1"
                    style={{ fontWeight: 700, fontSize: "1rem" }}
                  >
                    General Settings
                  </h2>
                  <p className="text-slate-500 text-sm mb-6">
                    Configure your workspace details
                  </p>

                  {/* Workspace icon */}
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                    <div
                      className="size-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-indigo-200"
                      style={{ fontSize: "1.5rem", fontWeight: 700 }}
                    >
                      {workspace.name.slice(0, 1)}
                    </div>
                    <div>
                      <p
                        className="text-slate-900 text-sm"
                        style={{ fontWeight: 700 }}
                      >
                        {workspace.name}
                      </p>
                      <p className="text-slate-400 text-xs mb-2">
                        {workspace.members.length} members · {currentPlan.name}{" "}
                        plan
                      </p>
                      <button
                        onClick={() => toast.info("Logo upload coming soon")}
                        className="text-xs text-indigo-600 hover:text-indigo-800 border border-indigo-200 px-3 py-1 rounded-lg hover:bg-indigo-50 transition-colors cursor-pointer"
                        style={{ fontWeight: 500 }}
                      >
                        Upload logo
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label
                        className="block text-slate-700 text-xs mb-1.5"
                        style={{ fontWeight: 600 }}
                      >
                        Workspace name
                      </label>
                      <input
                        value={wsForm.name}
                        onChange={(e) =>
                          setWsForm({ ...wsForm, name: e.target.value })
                        }
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label
                        className="block text-slate-700 text-xs mb-1.5"
                        style={{ fontWeight: 600 }}
                      >
                        Industry
                      </label>
                      <select
                        value={wsForm.industry}
                        onChange={(e) =>
                          setWsForm({ ...wsForm, industry: e.target.value })
                        }
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 outline-none focus:border-indigo-400 transition-all text-sm cursor-pointer"
                      >
                        <option>Software Development</option>
                        <option>Design Agency</option>
                        <option>Marketing Agency</option>
                        <option>Consulting</option>
                        <option>E-commerce</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label
                        className="block text-slate-700 text-xs mb-1.5"
                        style={{ fontWeight: 600 }}
                      >
                        <span className="flex items-center gap-1.5">
                          <Globe className="size-3" /> Website
                        </span>
                      </label>
                      <input
                        value={wsForm.website}
                        onChange={(e) =>
                          setWsForm({ ...wsForm, website: e.target.value })
                        }
                        placeholder="https://yourcompany.com"
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={handleSaveGeneral}
                      disabled={saving}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition-all cursor-pointer shadow-md shadow-indigo-200 disabled:opacity-60 text-sm"
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
              )}

              {/* Members tab */}
              {activeTab === "members" && (
                <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2
                        className="text-slate-900 mb-0.5"
                        style={{ fontWeight: 700, fontSize: "1rem" }}
                      >
                        Team Members
                      </h2>
                      <p className="text-slate-500 text-sm">
                        {workspace.members.length} members
                      </p>
                    </div>
                  </div>

                  {/* Invite form */}
                  <div className="flex gap-2 mb-6 p-4 bg-indigo-50/80 rounded-xl border border-indigo-100">
                    <input
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="colleague@company.com"
                      className="flex-1 px-3 py-2.5 rounded-xl bg-white border border-indigo-200 text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-400 transition-all text-sm"
                      onKeyDown={(e) => e.key === "Enter" && handleInvite()}
                    />
                    <select
                      value={inviteRole}
                      onChange={(e) =>
                        setInviteRole(e.target.value as WorkspaceMember["role"])
                      }
                      className="px-3 py-2.5 rounded-xl bg-white border border-indigo-200 text-slate-700 outline-none focus:border-indigo-400 transition-all text-sm cursor-pointer"
                    >
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                      <option value="viewer">Viewer</option>
                    </select>
                    <button
                      onClick={handleInvite}
                      disabled={inviting}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition-colors cursor-pointer text-sm disabled:opacity-60 shrink-0"
                      style={{ fontWeight: 600 }}
                    >
                      {inviting ? (
                        <Spinner size="sm" className="text-white" />
                      ) : (
                        <Plus className="size-3.5" />
                      )}
                      Invite
                    </button>
                  </div>

                  {/* Members list */}
                  <div className="space-y-2">
                    {workspace.members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                      >
                        <div
                          className="size-9 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white shrink-0"
                          style={{ fontSize: "0.65rem", fontWeight: 700 }}
                        >
                          {member.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p
                              className="text-slate-900 text-sm"
                              style={{ fontWeight: 600 }}
                            >
                              {member.name}
                            </p>
                            {member.status === "invited" && (
                              <span
                                className="text-xs text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200"
                                style={{ fontWeight: 500 }}
                              >
                                Invited
                              </span>
                            )}
                          </div>
                          <p className="text-slate-400 text-xs">
                            {member.email}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            value={member.role}
                            onChange={(e) =>
                              changeMemberRole(
                                member.id,
                                e.target.value as WorkspaceMember["role"],
                              )
                            }
                            disabled={member.role === "owner"}
                            className={`px-2.5 py-1 rounded-lg border text-xs cursor-pointer outline-none transition-all ${roleConfig[member.role].color} disabled:opacity-70 disabled:cursor-not-allowed`}
                            style={{ fontWeight: 600 }}
                          >
                            <option value="viewer">Viewer</option>
                            <option value="member">Member</option>
                            <option value="admin">Admin</option>
                            {member.role === "owner" && (
                              <option value="owner">Owner</option>
                            )}
                          </select>
                          {member.role !== "owner" && (
                            <button
                              onClick={() => handleRemove(member)}
                              className="size-7 rounded-lg flex items-center justify-center text-slate-300 hover:text-red-400 hover:bg-red-50 transition-colors cursor-pointer"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Billing tab */}
              {activeTab === "billing" && (
                <div className="space-y-4">
                  {/* Current plan */}
                  <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-lg p-6">
                    <h2
                      className="text-slate-900 mb-1"
                      style={{ fontWeight: 700, fontSize: "1rem" }}
                    >
                      Current Plan
                    </h2>
                    <p className="text-slate-500 text-sm mb-4">
                      Manage your subscription and billing
                    </p>

                    <div
                      className={`flex items-center justify-between p-4 rounded-xl border ${currentPlan.bg} border-indigo-200`}
                    >
                      <div>
                        <p
                          className={`${currentPlan.color} text-lg`}
                          style={{ fontWeight: 800 }}
                        >
                          {currentPlan.name}
                        </p>
                        <p className="text-slate-500 text-sm">
                          ${currentPlan.price}/month · Renews March 2, 2027
                        </p>
                      </div>
                      <button
                        onClick={() => toast.info("Plan upgrade coming soon")}
                        className="px-4 py-2 rounded-xl border border-indigo-300 text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer text-sm"
                        style={{ fontWeight: 600 }}
                      >
                        Upgrade
                      </button>
                    </div>
                  </div>

                  {/* Payment method */}
                  <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-lg p-6">
                    <h3
                      className="text-slate-900 mb-4"
                      style={{ fontWeight: 700, fontSize: "0.95rem" }}
                    >
                      Payment Method
                    </h3>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-slate-800 flex items-center justify-center">
                          <CreditCard className="size-5 text-white" />
                        </div>
                        <div>
                          <p
                            className="text-slate-800 text-sm"
                            style={{ fontWeight: 600 }}
                          >
                            •••• •••• •••• 4242
                          </p>
                          <p className="text-slate-400 text-xs">
                            Expires 12/27
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => toast.info("Card update coming soon")}
                        className="text-indigo-600 hover:text-indigo-800 text-xs cursor-pointer transition-colors"
                        style={{ fontWeight: 600 }}
                      >
                        Update
                      </button>
                    </div>
                  </div>

                  {/* Invoices */}
                  <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-lg p-6">
                    <h3
                      className="text-slate-900 mb-4"
                      style={{ fontWeight: 700, fontSize: "0.95rem" }}
                    >
                      Billing History
                    </h3>
                    <div className="space-y-2">
                      {[
                        {
                          date: "Feb 2, 2026",
                          amount: "$79.00",
                          status: "Paid",
                        },
                        {
                          date: "Jan 2, 2026",
                          amount: "$79.00",
                          status: "Paid",
                        },
                        {
                          date: "Dec 2, 2025",
                          amount: "$79.00",
                          status: "Paid",
                        },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0"
                        >
                          <div>
                            <p
                              className="text-slate-700 text-sm"
                              style={{ fontWeight: 500 }}
                            >
                              Pro Plan — {item.date}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span
                              className="text-emerald-600 text-xs bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200"
                              style={{ fontWeight: 600 }}
                            >
                              {item.status}
                            </span>
                            <span
                              className="text-slate-900 text-sm"
                              style={{ fontWeight: 700 }}
                            >
                              {item.amount}
                            </span>
                            <button
                              onClick={() =>
                                toast.success("Downloading receipt...")
                              }
                              className="text-slate-400 hover:text-indigo-600 text-xs transition-colors cursor-pointer"
                              style={{ fontWeight: 500 }}
                            >
                              Download
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Danger zone */}
                  <div className="rounded-2xl bg-red-50/50 border border-red-200 p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Shield className="size-4 text-red-400" />
                      <h3
                        className="text-red-600 text-sm"
                        style={{ fontWeight: 700 }}
                      >
                        Danger Zone
                      </h3>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p
                          className="text-slate-700 text-sm"
                          style={{ fontWeight: 500 }}
                        >
                          Cancel subscription
                        </p>
                        <p className="text-slate-400 text-xs">
                          Your workspace will be downgraded at the end of the
                          billing period
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          toast.error("Please contact support to cancel")
                        }
                        className="px-4 py-2 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-colors cursor-pointer text-sm"
                        style={{ fontWeight: 600 }}
                      >
                        Cancel plan
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
