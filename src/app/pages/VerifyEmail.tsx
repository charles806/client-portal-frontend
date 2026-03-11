import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router";
import { Zap, CheckCircle, XCircle, Mail } from "lucide-react";
import { Spinner } from "../components/ui/ios-spinner";
import apiClient from "../services/api";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link');
      return;
    }

    verifyEmail();
  }, [token]);

  const verifyEmail = async () => {
    try {
      await apiClient.get(`/auth/verify-email?token=${token}`);
      setStatus('success');
      setMessage('Email verified successfully!');
      
      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (error: any) {
      setStatus('error');
      setMessage(error.response?.data?.error || 'Verification failed');
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

          <div className="text-center">
            {status === 'loading' && (
              <>
                <div className="size-16 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-4">
                  <Mail className="size-8 text-indigo-600" />
                </div>
                <h1 className="text-slate-900 mb-2" style={{ fontWeight: 700, fontSize: "1.5rem" }}>
                  Verifying your email
                </h1>
                <p className="text-slate-500 text-sm mb-6">
                  Please wait while we verify your email address...
                </p>
                <Spinner size="md" />
              </>
            )}

            {status === 'success' && (
              <>
                <div className="size-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="size-8 text-emerald-600" />
                </div>
                <h1 className="text-slate-900 mb-2" style={{ fontWeight: 700, fontSize: "1.5rem" }}>
                  Email verified! 🎉
                </h1>
                <p className="text-slate-500 text-sm mb-6">
                  {message} Redirecting to dashboard...
                </p>
                <div className="flex justify-center">
                  <Spinner size="md" />
                </div>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="size-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                  <XCircle className="size-8 text-red-600" />
                </div>
                <h1 className="text-slate-900 mb-2" style={{ fontWeight: 700, fontSize: "1.5rem" }}>
                  Verification failed
                </h1>
                <p className="text-slate-500 text-sm mb-6">
                  {message}
                </p>
                <div className="flex flex-col gap-3">
                  <Link
                    to="/dashboard"
                    className="w-full py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition-colors text-center text-sm"
                    style={{ fontWeight: 600 }}
                  >
                    Go to dashboard
                  </Link>
                  <Link
                    to="/signin"
                    className="w-full py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors text-center text-sm"
                    style={{ fontWeight: 600 }}
                  >
                    Back to sign in
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}