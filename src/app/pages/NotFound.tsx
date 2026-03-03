import { useNavigate } from 'react-router';
import { ArrowLeft, Zap } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100 flex items-center justify-center p-6">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="size-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-200">
            <Zap className="size-5 text-white" />
          </div>
          <span className="text-slate-900 text-xl" style={{ fontWeight: 700 }}>PortalWave</span>
        </div>

        <div className="text-indigo-400 mb-4" style={{ fontSize: '6rem', fontWeight: 900, lineHeight: 1 }}>404</div>
        <h1 className="text-slate-900 mb-3" style={{ fontWeight: 800, fontSize: '1.5rem' }}>Page not found</h1>
        <p className="text-slate-500 mb-8 max-w-sm mx-auto" style={{ lineHeight: 1.7 }}>
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer"
            style={{ fontWeight: 500 }}
          >
            <ArrowLeft className="size-4" /> Go back
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition-all cursor-pointer shadow-md shadow-indigo-200"
            style={{ fontWeight: 600 }}
          >
            Go to dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
