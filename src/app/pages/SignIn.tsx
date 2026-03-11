import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router";
import { Zap, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Spinner } from "../components/ui/ios-spinner";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

export default function SignIn() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const error = searchParams.get('error');
    if (error === 'oauth_failed') {
      toast.error('OAuth authentication failed. Please try again.');
    }
  }, [searchParams]);

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

  const handleOAuthLogin = (provider: 'google' | 'github') => {
    window.location.href = `${API_URL}/auth/${provider}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-slate-100 flex">
      {/* Left panel */}
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
                  <Link
                    to="/forgot-password"
                    className="text-indigo-600 text-xs hover:text-indigo-800 transition-colors"
                    style={{ fontWeight: 500 }}
                  >
                    Forgot password?
                  </Link>
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

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white/80 text-slate-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleOAuthLogin('google')}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <svg className="size-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span className="text-sm font-medium">Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOAuthLogin('github')}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">GitHub</span>
                </button>
              </div>
            </div>

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