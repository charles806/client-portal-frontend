import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Zap, Eye, EyeOff, ArrowLeft, Mail, User, Lock, ArrowRight } from "lucide-react";
import { Spinner } from "../components/ui/ios-spinner";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

export function UsernameModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { setUsername } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      toast.error("Please fill in both fields");
      return;
    }
    setLoading(true);
    try {
      await setUsername(form.username, form.password);
      toast.success("Username set successfully!");
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to set username");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-200">
        <div className="text-center mb-6">
          <div className="size-16 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-4">
            <User className="size-8 text-indigo-600" />
          </div>
          <h2 className="text-slate-900 mb-2 font-bold text-2xl">Choose your username</h2>
          <p className="text-slate-500 text-sm">Create a username and password for easier login next time</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-700 text-sm mb-1.5 font-semibold">Username *</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                autoFocus
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="alexmorgan"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-slate-700 text-sm mb-1.5 font-semibold">Password *</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Min. 8 characters"
                className="w-full pl-10 pr-12 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors font-semibold"
            >
              Skip
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition-all font-semibold shadow-lg shadow-indigo-200"
            >
              {loading && <Spinner size="sm" className="text-white" />}
              {loading ? "Setting up" : "Continue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function SignUp() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password || !form.firstName || !form.lastName) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      await signup(form);
      toast.success("Account created successfully!");
      navigate("/onboarding");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to create account");
    } finally {
      setLoading(false);
    }
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
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-12">
            <ArrowLeft className="size-4" />
            <span className="text-sm font-medium">Back to home</span>
          </button>
          <div className="flex items-center gap-2.5 mb-16">
            <div className="size-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Zap className="size-5 text-white" />
            </div>
            <span className="text-white text-xl font-bold">PortalWave</span>
          </div>
          <h2 className="text-white text-4xl font-bold leading-tight mb-6">The modern portal for<br />growing agencies.</h2>
          <p className="text-slate-400 text-lg leading-relaxed max-w-md">Everything you need to manage your clients, projects, and billing in one sleek interface.</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-xl p-8">
            <div className="mb-8">
              <h1 className="text-slate-900 text-3xl font-bold mb-2">Create account</h1>
              <p className="text-slate-500">Start your 14-day free trial today.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 text-sm mb-1.5 font-semibold">First name</label>
                  <input
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    placeholder="Alex"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 text-sm mb-1.5 font-semibold">Last name</label>
                  <input
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    placeholder="Morgan"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 text-sm mb-1.5 font-semibold">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="alex@company.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 text-sm mb-1.5 font-semibold">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Min. 8 characters"
                    className="w-full pl-10 pr-12 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all text-sm"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-700 transition-all font-semibold shadow-lg shadow-indigo-200 mt-4 h-12"
              >
                {loading ? <Spinner size="sm" className="text-white" /> : "Create account"}
                {!loading && <ArrowRight className="size-4 ml-1" />}
              </button>
            </form>
            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-slate-500 text-sm italic">Existing account?</p>
              <Link to="/signin" className="text-indigo-600 hover:text-indigo-800 font-bold ml-1 text-sm">
                Sign in now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}