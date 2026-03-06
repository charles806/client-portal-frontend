import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Zap, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Spinner } from "../components/ui/ios-spinner";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

export default function SignIn() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.identifier || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      await login(form.identifier, form.password);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast.error(error.response?.data?.error || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-slate-100 flex">
      {/* Left panel - same as before */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 flex-col p-12 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-violet-600/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer mb-12"
          >
            <ArrowLeft className="size-4" />
            <span className="text-sm">Back to home</span>
          </button>

          <div className="flex items-center gap-2.5 mb-16">
            <div className="size-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Zap className="size-5 text-white" />
            </div>
            <span className="text-white text-xl" style={{ fontWeight: 700 }}>
              PortalWave
            </span>
          </div>

          <h2
            className="text-white mb-4"
            style={{ fontSize: "1.75rem", fontWeight: 700, lineHeight: 1.3 }}
          >
            Welcome back to
            <br />
            your workspace
          </h2>
          <p
            className="text-slate-400 leading-relaxed"
            style={{ fontSize: "0.9rem" }}
          >
            Access your projects, timelines, and client portal — all in one place.
          </p>

          <div className="mt-12 space-y-4">
            {[
              { stat: "5,000+", label: "Teams worldwide" },
              { stat: "$2.4B", label: "Projects managed" },
              { stat: "99.9%", label: "Uptime SLA" },
            ].map(({ stat, label }) => (
              <div key={label} className="flex items-center gap-4">
                <div className="text-indigo-400 text-xl" style={{ fontWeight: 700 }}>
                  {stat}
                </div>
                <div className="text-slate-500 text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <button onClick={() => navigate("/")} className="flex items-center gap-2">
              <div className="size-8 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center">
                <Zap className="size-4 text-white" />
              </div>
              <span className="text-slate-900 text-lg" style={{ fontWeight: 700 }}>
                PortalWave
              </span>
            </button>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-xl p-8">
            <div className="mb-8">
              <h1 className="text-slate-900 mb-1" style={{ fontWeight: 700, fontSize: "1.5rem" }}>
                Sign in
              </h1>
              <p className="text-slate-500 text-sm">
                Use your email or username to sign in
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-700 text-sm mb-1.5" style={{ fontWeight: 600 }}>
                  Email or Username
                </label>
                <input
                  type="text"
                  value={form.identifier}
                  onChange={(e) => setForm({ ...form, identifier: e.target.value })}
                  placeholder="alex@company.com or username"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                  style={{ fontSize: "0.9rem" }}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-slate-700 text-sm" style={{ fontWeight: 600 }}>
                    Password
                  </label>
                  <a href="#" className="text-indigo-600 text-xs hover:text-indigo-800 transition-colors" style={{ fontWeight: 500 }}>
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all pr-12"
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
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-700 transition-all cursor-pointer shadow-lg shadow-indigo-200 disabled:opacity-60 mt-2"
                style={{ fontWeight: 600 }}
              >
                {loading && <Spinner size="sm" className="text-white" />}
                {loading ? "Signing in" : "Sign in"}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-100 text-center">
              <p className="text-slate-500 text-sm">
                Don't have an account?{" "}
                <Link to="/signup" className="text-indigo-600 hover:text-indigo-800 transition-colors" style={{ fontWeight: 600 }}>
                  Sign up for free
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}