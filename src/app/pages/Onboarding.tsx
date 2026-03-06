import { useState } from "react";
import { useNavigate } from "react-router";
import { Zap, ArrowRight, Check } from "lucide-react";
import { Spinner } from "../components/ui/ios-spinner";
import { Input } from "../components/ui/input";

import { useAuth } from "../context/AuthContext";
import { useWorkspaces } from "../hooks/useWorkspaces";
import { useWorkspaceStore } from "../store/workspaceStore";
import { toast } from "sonner";

export default function Onboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createWorkspace } = useWorkspaces();
  const { setCurrentWorkspace } = useWorkspaceStore();
  const [step, setStep] = useState<"welcome" | "create" | "success">("welcome");
  const [workspaceName, setWorkspaceName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceName.trim()) {
      toast.error("Please enter a workspace name");
      return;
    }

    setLoading(true);
    try {
      const workspace = await createWorkspace({ name: workspaceName.trim() });
      setCurrentWorkspace(workspace.id);
      setStep("success");

      // Auto-redirect after 2 seconds
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Failed to create workspace:", error);
      toast.error("Failed to create workspace");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100 flex items-center justify-center p-6">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-violet-100 rounded-full blur-3xl opacity-40" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="size-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-200">
              <Zap className="size-5 text-white" />
            </div>
            <span
              className="text-slate-900 text-xl"
              style={{ fontWeight: 700 }}
            >
              PortalWave
            </span>
          </div>
        </div>

        {/* Step: Welcome */}
        {step === "welcome" && (
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-xl p-8 text-center">
            <h1
              className="text-slate-900 mb-2"
              style={{ fontWeight: 800, fontSize: "1.75rem" }}
            >
              Welcome, {user?.firstName}! 👋
            </h1>
            <p className="text-slate-500 mb-8">
              Let's create your first workspace to get started
            </p>
            <button
              onClick={() => setStep("create")}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-700 transition-all cursor-pointer shadow-lg shadow-indigo-200"
              style={{ fontWeight: 600 }}
            >
              Get Started <ArrowRight className="size-4" />
            </button>
          </div>
        )}

        {/* Step: Create Workspace */}
        {step === "create" && (
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-xl p-8">
            <h2
              className="text-slate-900 mb-1"
              style={{ fontWeight: 700, fontSize: "1.25rem" }}
            >
              Create your workspace
            </h2>
            <p className="text-slate-500 text-sm mb-6">
              This is where you'll manage your projects and clients
            </p>

            <form onSubmit={handleCreateWorkspace} className="space-y-4">
              <div>
                <label
                  className="block text-slate-700 text-sm mb-1.5"
                  style={{ fontWeight: 600 }}
                >
                  Workspace name <span className="text-red-400">*</span>
                </label>
                <Input
                  autoFocus
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  placeholder="My Company"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all font-normal"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-700 transition-all cursor-pointer shadow-lg shadow-indigo-200 disabled:opacity-60"
                style={{ fontWeight: 600 }}
              >
                {loading && <Spinner size="sm" className="text-white" />}
                {loading ? "Creating workspace" : "Create Workspace"}
              </button>
            </form>
          </div>
        )}

        {/* Step: Success */}
        {step === "success" && (
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-xl p-12 text-center">
            <div className="size-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
              <Check className="size-10 text-emerald-600" />
            </div>
            <h2
              className="text-slate-900 mb-2"
              style={{ fontWeight: 800, fontSize: "1.5rem" }}
            >
              You're all set! 🎉
            </h2>
            <p className="text-slate-500 mb-4">
              Redirecting to your dashboard...
            </p>
            <Spinner size="lg" className="mx-auto" />

          </div>
        )}
      </div>
    </div>
  );
}
