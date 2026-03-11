import { useState } from "react";
import { Link } from "react-router";
import { Zap, ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { Spinner } from "../components/ui/ios-spinner";
import { toast } from "sonner";
import apiClient from "../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);

    try {
      await apiClient.post('/auth/forgot-password', { email });
      setEmailSent(true);
      toast.success("Reset link sent! Check your email.");
    } catch (error: any) {
      console.error("Forgot password error:", error);
      // Still show success to prevent email enumeration
      setEmailSent(true);
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-slate-100 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-xl p-8 text-center">
            <div className="size-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="size-8 text-emerald-600" />
            </div>
            <h1 className="text-slate-900 mb-2" style={{ fontWeight: 700, fontSize: "1.5rem" }}>
              Check your email
            </h1>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              If an account exists for <span className="font-semibold">{email}</span>, you'll receive a password reset link shortly.
            </p>
            <p className="text-slate-400 text-xs mb-6">
              Didn't receive the email? Check your spam folder or try again.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setEmailSent(false)}
                className="w-full py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer text-sm"
                style={{ fontWeight: 600 }}
              >
                Try another email
              </button>
              <Link
                to="/signin"
                className="w-full py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition-colors text-center text-sm"
                style={{ fontWeight: 600 }}
              >
                Back to sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Link
          to="/signin"
          className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors mb-8"
        >
          <ArrowLeft className="size-4" />
          <span className="text-sm" style={{ fontWeight: 500 }}>Back to sign in</span>
        </Link>

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
              Forgot password?
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed">
              No worries! Enter your email and we'll send you reset instructions.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-slate-700 text-sm mb-1.5" style={{ fontWeight: 600 }}>
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@company.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                  style={{ fontSize: "0.9rem" }}
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-700 transition-all cursor-pointer shadow-lg shadow-indigo-200 disabled:opacity-60"
              style={{ fontWeight: 600 }}
            >
              {loading && <Spinner size="sm" className="text-white" />}
              {loading ? "Sending" : "Send reset link"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}