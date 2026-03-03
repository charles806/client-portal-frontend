import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Zap, Eye, EyeOff, ArrowLeft, Check } from "lucide-react";
import { Spinner } from "../components/ui/ios-spinner";

import { useSignUp } from "@clerk/clerk-react";
import { toast } from "sonner";

const benefits = [
  "Free 14-day trial, no credit card",
  "Unlimited projects during trial",
  "Full access to all features",
  "Cancel anytime",
];

export default function SignUp() {
  const navigate = useNavigate();
  const { signUp, setActive, isLoaded } = useSignUp();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    if (!isLoaded) return;

    if (!form.firstName || !form.email || !form.password) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (!agreed) {
      toast.error("Please agree to the terms of service");
      return;
    }

    setLoading(true);

    try {
      const result = await signUp.create({
        firstName: form.firstName,
        lastName: form.lastName,
        emailAddress: form.email,
        password: form.password,
      });

      // Check if email verification is required
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        toast.success("Account created! Let's set up your workspace.");
        navigate("/onboarding");
      } else {
        // Handle email verification if needed
        toast.success("Account created! Please check your email to verify.");
        navigate("/onboarding");
      }
    } catch (err: any) {
      console.error("Sign up error:", err);
      const errorMessage = err.errors?.[0]?.message || "Failed to create account";
      setServerError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-slate-100 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 flex-col p-12 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-56 h-56 bg-violet-600/20 rounded-full blur-3xl" />
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
            Start your free trial
            <br />
            in 2 minutes
          </h2>
          <p
            className="text-slate-400 mb-10"
            style={{ fontSize: "0.9rem", lineHeight: 1.7 }}
          >
            Join 5,000+ teams already using PortalWave to deliver better client
            experiences.
          </p>

          <div className="space-y-3">
            {benefits.map((b) => (
              <div key={b} className="flex items-center gap-3">
                <div className="size-5 rounded-full bg-indigo-600/20 border border-indigo-600/40 flex items-center justify-center shrink-0">
                  <Check className="size-3 text-indigo-400" />
                </div>
                <span className="text-slate-300 text-sm">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <div className="size-8 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center">
                <Zap className="size-4 text-white" />
              </div>
              <span
                className="text-slate-900 text-lg"
                style={{ fontWeight: 700 }}
              >
                PortalWave
              </span>
            </button>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-xl p-8">
            <div className="mb-8">
              <h1
                className="text-slate-900 mb-1"
                style={{ fontWeight: 700, fontSize: "1.5rem" }}
              >
                Create your account
              </h1>
              <p className="text-slate-500 text-sm">
                Start your 14-day free trial — no credit card needed
              </p>
            </div>

            {serverError && (
              <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="size-5 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-red-600 text-xs font-bold font-mono">!</span>
                </div>
                <p className="text-red-600 text-sm leading-relaxed font-medium">
                  {serverError}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div id="clerk-captcha" className="hidden"></div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    className="block text-slate-700 text-sm mb-1.5"
                    style={{ fontWeight: 600 }}
                  >
                    First name <span className="text-red-400">*</span>
                  </label>
                  <input
                    value={form.firstName}
                    onChange={(e) =>
                      setForm({ ...form, firstName: e.target.value })
                    }
                    placeholder="Alex"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all text-sm"
                  />
                </div>
                <div>
                  <label
                    className="block text-slate-700 text-sm mb-1.5"
                    style={{ fontWeight: 600 }}
                  >
                    Last name
                  </label>
                  <input
                    value={form.lastName}
                    onChange={(e) =>
                      setForm({ ...form, lastName: e.target.value })
                    }
                    placeholder="Morgan"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  className="block text-slate-700 text-sm mb-1.5"
                  style={{ fontWeight: 600 }}
                >
                  Work email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="alex@company.com"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all text-sm"
                />
              </div>

              <div>
                <label
                  className="block text-slate-700 text-sm mb-1.5"
                  style={{ fontWeight: 600 }}
                >
                  Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    placeholder="Min. 8 characters"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all pr-12 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => setAgreed(!agreed)}
                  className={`size-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors cursor-pointer ${agreed ? "bg-indigo-600 border-indigo-600" : "border-slate-300 bg-white"}`}
                >
                  {agreed && <Check className="size-3 text-white" />}
                </button>
                <p className="text-slate-500 text-sm leading-relaxed">
                  I agree to the{" "}
                  <a
                    href="#"
                    className="text-indigo-600 hover:text-indigo-800 transition-colors"
                    style={{ fontWeight: 500 }}
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="text-indigo-600 hover:text-indigo-800 transition-colors"
                    style={{ fontWeight: 500 }}
                  >
                    Privacy Policy
                  </a>
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !isLoaded}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-700 transition-all cursor-pointer shadow-lg shadow-indigo-200 disabled:opacity-60"
                style={{ fontWeight: 600 }}
              >
                {loading && <Spinner size="sm" className="text-white" />}
                {loading ? "Creating account" : "Create free account"}
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

              <div className="mt-6 grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => signUp?.authenticateWithRedirect({
                    strategy: "oauth_google",
                    redirectUrl: "/sso-callback",
                    redirectUrlComplete: "/onboarding"
                  })}
                  className="flex items-center justify-center px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <svg className="size-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() => signUp?.authenticateWithRedirect({
                    strategy: "oauth_github",
                    redirectUrl: "/sso-callback",
                    redirectUrlComplete: "/onboarding"
                  })}
                  className="flex items-center justify-center px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() => signUp?.authenticateWithRedirect({
                    strategy: "oauth_apple",
                    redirectUrl: "/sso-callback",
                    redirectUrlComplete: "/onboarding"
                  })}
                  className="flex items-center justify-center px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 text-center">
              <p className="text-slate-500 text-sm">
                Already have an account?{" "}
                <Link
                  to="/signin"
                  className="text-indigo-600 hover:text-indigo-800 transition-colors"
                  style={{ fontWeight: 600 }}
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
