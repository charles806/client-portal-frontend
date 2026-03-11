import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState, useEffect } from "react";
import {
  Building2,
  Users,
  CreditCard,
  Save,
  Plus,
  Trash2,
  Shield,
  Globe,
  Crown,
  User as UserIcon,
} from "lucide-react";

import { Header } from "../components/layout/Header";
import { Spinner } from "../components/ui/ios-spinner";
import { Input } from "../components/ui/input";
import { sanitizeValue } from "../components/ui/sanitization";

import { useWorkspaceStore } from "../store/workspaceStore";
import { useWorkspace, useWorkspaceMembers, WorkspaceMember } from "../hooks/useWorkspaces";
import { useWorkspaces } from "../hooks/useWorkspaces";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

type Tab = "general" | "members" | "billing";

const tabs: { id: Tab; label: string; icon: typeof Building2 }[] = [
  { id: "general", label: "General", icon: Building2 },
  { id: "members", label: "Members", icon: Users },
  { id: "billing", label: "Billing", icon: CreditCard },
];

const roleConfig: Record<
  'owner' | 'admin' | 'member',
  { label: string; color: string; icon: typeof Crown }
> = {
  owner: {
    label: "Owner",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    icon: Crown,
  },
  admin: {
    label: "Admin",
    color: "bg-indigo-100 text-indigo-700 border-indigo-200",
    icon: Shield,
  },
  member: {
    label: "Member",
    color: "bg-slate-100 text-slate-600 border-slate-200",
    icon: UserIcon,
  },
};

export default function WorkspaceSettings() {
  const { user } = useAuth();
  const { currentWorkspaceId } = useWorkspaceStore();
  const { data: workspace, isLoading: workspaceLoading } = useWorkspace(currentWorkspaceId);
  const { updateWorkspace } = useWorkspaces();
  const {
    members,
    isLoading: membersLoading,
    inviteMember,
    updateMemberRole,
    removeMember,
  } = useWorkspaceMembers(currentWorkspaceId);

  const [activeTab, setActiveTab] = useState<Tab>("general");
  const [saving, setSaving] = useState(false);
  const [wsForm, setWsForm] = useState({
    name: workspace?.name || '',
  });
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<'admin' | 'member'>("member");
  const [inviting, setInviting] = useState(false);

  // Update form when workspace loads
  useEffect(() => {
    if (workspace?.name) {
      setWsForm({ name: workspace.name });
    }
  }, [workspace?.name]);

  if (workspaceLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="size-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="flex flex-col h-full">
        <Header title="Workspace Settings" />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-500">Workspace not found</p>
        </div>
      </div>
    );
  }

  const handleSaveGeneral = async () => {
    if (!currentWorkspaceId) return;

    setSaving(true);
    try {
      await updateWorkspace({
        id: currentWorkspaceId,
        data: { name: wsForm.name },
      });
    } catch (error) {
      console.error('Failed to update workspace:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail) {
      toast.error("Please enter an email address");
      return;
    }
    setInviting(true);
    try {
      await inviteMember({ email: inviteEmail, role: inviteRole });
      setInviteEmail("");
    } catch (error) {
      console.error('Failed to invite member:', error);
    } finally {
      setInviting(false);
    }
  };

  const handleRemove = async (memberId: string, memberName: string) => {
    if (!confirm(`Remove ${memberName} from the workspace?`)) return;
    try {
      await removeMember(memberId);
    } catch (error) {
      console.error('Failed to remove member:', error);
    }
  };

  const handleRoleChange = async (memberId: string, newRole: 'admin' | 'member') => {
    try {
      await updateMemberRole({ memberId, role: newRole });
    } catch (error) {
      console.error('Failed to update role:', error);
    }
  };

  // Get user's role in workspace
  const currentUserMember = members.find((m: WorkspaceMember) => m.userId === user?.id);
  const isOwner = currentUserMember?.role === 'owner';

  // Get member display name
  const getMemberName = (member: typeof members[0]) => {
    if (member.user?.firstName && member.user?.lastName) {
      return `${member.user.firstName} ${member.user.lastName}`;
    }
    if (member.user?.username) {
      return member.user.username;
    }
    return member.user?.email?.split('@')[0] || 'Unknown';
  };

  // Get member initials
  const getMemberInitials = (member: typeof members[0]) => {
    if (member.user?.firstName && member.user?.lastName) {
      return `${member.user.firstName[0]}${member.user.lastName[0]}`.toUpperCase();
    }
    if (member.user?.username) {
      return member.user.username.slice(0, 2).toUpperCase();
    }
    return member.user?.email?.slice(0, 2).toUpperCase() || 'UN';
  };

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
                      {workspace.name.slice(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <p
                        className="text-slate-900 text-sm"
                        style={{ fontWeight: 700 }}
                      >
                        {workspace.name}
                      </p>
                      <p className="text-slate-400 text-xs mb-2">
                        {members.length} members · {workspace._count?.projects || 0} projects
                      </p>
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
                      <Input
                        value={wsForm.name}
                        onChange={(e) =>
                          setWsForm({ ...wsForm, name: e.target.value })
                        }
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all text-sm font-normal"
                        disabled={!isOwner}
                      />
                    </div>
                  </div>

                  {isOwner && (
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
                  )}
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
                        {members.length} members
                      </p>
                    </div>
                  </div>

                  {/* Invite form */}
                  {(isOwner || currentUserMember?.role === 'admin') && (
                    <div className="flex gap-2 mb-6 p-4 bg-indigo-50/80 rounded-xl border border-indigo-100">
                      <Input
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="colleague@company.com"
                        className="flex-1 px-3 py-2.5 rounded-xl bg-white border border-indigo-200 text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-400 transition-all text-sm font-normal"
                        onKeyDown={(e) => e.key === "Enter" && handleInvite()}
                      />
                      <select
                        value={inviteRole}
                        onChange={(e) =>
                          setInviteRole(sanitizeValue(e.target.value) as 'admin' | 'member')
                        }
                        className="px-3 py-2.5 rounded-xl bg-white border border-indigo-200 text-slate-700 outline-none focus:border-indigo-400 transition-all text-sm cursor-pointer"
                      >
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
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
                  )}

                  {/* Members list */}
                  {membersLoading ? (
                    <div className="flex justify-center py-8">
                      <Spinner size="md" />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {members.map((member: WorkspaceMember) => {
                        const roleInfo = roleConfig[member.role];
                        const RoleIcon = roleInfo.icon;

                        return (
                          <div
                            key={member.id}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                          >
                            <div
                              className="size-9 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white shrink-0"
                              style={{ fontSize: "0.65rem", fontWeight: 700 }}
                            >
                              {getMemberInitials(member)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p
                                  className="text-slate-900 text-sm"
                                  style={{ fontWeight: 600 }}
                                >
                                  {getMemberName(member)}
                                </p>
                                {member.userId === user?.id && (
                                  <span
                                    className="text-xs text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200"
                                    style={{ fontWeight: 500 }}
                                  >
                                    You
                                  </span>
                                )}
                              </div>
                              <p className="text-slate-400 text-xs">
                                {member.user?.email}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {isOwner && member.role !== 'owner' ? (
                                <select
                                  value={member.role}
                                  onChange={(e) =>
                                    handleRoleChange(
                                      member.id,
                                      sanitizeValue(e.target.value) as 'admin' | 'member'
                                    )
                                  }
                                  className={`px-2.5 py-1 rounded-lg border text-xs cursor-pointer outline-none transition-all flex items-center gap-1 ${roleInfo.color}`}
                                  style={{ fontWeight: 600 }}
                                >
                                  <option value="member">Member</option>
                                  <option value="admin">Admin</option>
                                </select>
                              ) : (
                                <div className={`px-2.5 py-1 rounded-lg border text-xs flex items-center gap-1 ${roleInfo.color}`} style={{ fontWeight: 600 }}>
                                  <RoleIcon className="size-3" />
                                  {roleInfo.label}
                                </div>
                              )}
                              {isOwner && member.role !== 'owner' && (
                                <button
                                  onClick={() => handleRemove(member.id, getMemberName(member))}
                                  className="size-7 rounded-lg flex items-center justify-center text-slate-300 hover:text-red-400 hover:bg-red-50 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="size-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Billing tab */}
              {activeTab === "billing" && (
                <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-lg p-6">
                  <h2
                    className="text-slate-900 mb-1"
                    style={{ fontWeight: 700, fontSize: "1rem" }}
                  >
                    Billing
                  </h2>
                  <p className="text-slate-500 text-sm mb-6">
                    Billing features coming soon
                  </p>
                  <div className="text-center py-12">
                    <CreditCard className="size-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-400">Billing management will be available soon</p>
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