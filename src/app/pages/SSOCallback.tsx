import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react';

export default function SSOCallback() {
    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-slate-100">
            <div className="text-center">
                <AuthenticateWithRedirectCallback />
                <div className="size-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-slate-600 text-sm">Completing sign in...</p>
            </div>
        </div>
    );
}