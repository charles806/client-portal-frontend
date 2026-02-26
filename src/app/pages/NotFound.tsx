import { useNavigate } from "react-router";
import { ArrowLeft, Compass } from "lucide-react";

export function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto mb-6">
          <Compass size={28} className="text-indigo-500" />
        </div>
        <p className="text-indigo-600 mb-2" style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em" }}>
          404 ERROR
        </p>
        <h1 className="text-gray-900 mb-2" style={{ fontSize: "24px", fontWeight: 700 }}>Page not found</h1>
        <p className="text-gray-400 mb-8" style={{ fontSize: "14px" }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors shadow-sm"
          style={{ fontSize: "13.5px", fontWeight: 500 }}
        >
          <ArrowLeft size={15} />
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
