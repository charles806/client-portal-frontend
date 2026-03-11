import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router";
import { Zap, Eye, EyeOff, Lock, CheckCircle } from "lucide-react";
import { Spinner } from "../components/ui/ios-spinner";
import { toast } from "sonner";
import apiClient from "../services/api";

export default function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    if (!token) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-slate-100 flex items-center justify-center p-6">
                <div className="w-full max-w-md">
                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-xl p-8 text-center">
                        <h1 className="text-slate-900 mb-2" style={{ fontWeight: 700, fontSize: "1.5rem" }}>
                            Invalid reset link
                        </h1>
                        <p className="text-slate-500 text-sm mb-6">
                            This password reset link is invalid or has expired.
                        </p>
                        <Link
                            to="/forgot-password"
                            className="inline-block px-6 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition-colors text-sm"
                            style={{ fontWeight: 600 }}
                        >
                            Request new link
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!password || !confirmPassword) {
            toast.error("Please fill in all fields");
            return;
        }

        if (password.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords don't match");
            return;
        }

        setLoading(true);

        try {
            await apiClient.post('/auth/reset-password', { token, password });
            setSuccess(true);
            toast.success("Password reset successfully!");

            // Redirect to sign in after 2 seconds
            setTimeout(() => {
                navigate('/signin');
            }, 2000);
        } catch (error: any) {
            console.error("Reset password error:", error);
            toast.error(error.response?.data?.error || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-slate-100 flex items-center justify-center p-6">
                <div className="w-full max-w-md">
                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-xl p-8 text-center">
                        <div className="size-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="size-8 text-emerald-600" />
                        </div>
                        <h1 className="text-slate-900 mb-2" style={{ fontWeight: 700, fontSize: "1.5rem" }}>
                            Password reset!
                        </h1>
                        <p className="text-slate-500 text-sm mb-6">
                            Your password has been reset successfully. Redirecting to sign in...
                        </p>
                        <div className="flex justify-center">
                            <Spinner size="md" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

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
                            Reset your password
                        </h1>
                        <p className="text-slate-500 text-sm">
                            Choose a strong password for your account
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-slate-700 text-sm mb-1.5" style={{ fontWeight: 600 }}>
                                New password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Min. 8 characters"
                                    className="w-full pl-10 pr-12 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                                    style={{ fontSize: "0.9rem" }}
                                    autoFocus
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

                        <div>
                            <label className="block text-slate-700 text-sm mb-1.5" style={{ fontWeight: 600 }}>
                                Confirm password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Re-enter password"
                                    className="w-full pl-10 pr-12 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                                    style={{ fontSize: "0.9rem" }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                                >
                                    {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
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
                            {loading ? "Resetting" : "Reset password"}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                        <Link
                            to="/signin"
                            className="text-indigo-600 hover:text-indigo-800 transition-colors text-sm"
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