import { useState } from "react";
import { useNavigate } from "react-router";
import { Zap, User, Lock, Eye, EyeOff } from "lucide-react";
import { Spinner } from "../components/ui/ios-spinner";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

export default function SetupAccount() {
  const navigate = useNavigate();
  const { setUsername, user } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.username || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (form.username.length < 3) {
      toast.error("Username must be at least 3 characters");
      return;
    }

    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      await setUsername(form.username, form.password);
      toast.success("Account setup complete!");
      navigate("/onboarding");
    } catch (error: any) {
      console.error("Setup account error:", error);
      toast.error(error.response?.data?.error || "Failed to setup account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-xl p-8">
          <div className="flex items-center gap-2 mb-8">
            <div className="size-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center">
              <Zap className="size-5 text-white" />
            </div>
            <span className="text-slate-900 text-lg" style={{ fontWeight: 700 }}>
              PortalWave
            </span>
          </div>

          <div className="mb-8">
            <h1 className="text-slate-900 mb-2" style={{ fontWeight: 700, fontSize: "1.5rem" }}>
              Complete your account
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed">
              Set up a username and password for easier sign-in next time.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-slate-700 text-sm mb-1.5" style={{ fontWeight: 600 }}>
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  placeholder="alexmorgan"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                  style={{ fontSize: "0.9rem" }}
                  autoFocus
                />
              </div>
              <p className="text-slate-400 text-xs mt-1">
                3+ characters, letters, numbers, and underscores only
              </p>
            </div>

            <div>
              <label className="block text-slate-700 text-sm mb-1.5" style={{ fontWeight: 600 }}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Min. 8 characters"
                  className="w-full pl-10 pr-12 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                  style={{ fontSize: "0.9rem" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-700 transition-all cursor-pointer shadow-lg shadow-indigo-200 disabled:opacity-60 mt-6"
              style={{ fontWeight: 600 }}
            >
              {loading && <Spinner size="sm" className="text-white" />}
              {loading ? "Setting up" : "Continue"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <button
              onClick={() => navigate("/onboarding")}
              className="text-slate-500 hover:text-slate-700 transition-colors text-sm"
              style={{ fontWeight: 500 }}
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}