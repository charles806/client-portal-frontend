import { XCircle, AlertCircle, Info, X } from 'lucide-react';
import { useError } from '../../context/ErrorContext';

export function ErrorModal() {
    const { error, clearError } = useError();

    if (!error) return null;

    const typeConfig = {
        error: {
            icon: <XCircle className="size-6 text-red-500" />,
            bg: 'bg-red-50',
            border: 'border-red-100',
            titleColor: 'text-red-900',
            buttonBg: 'bg-red-600 hover:bg-red-500',
        },
        warning: {
            icon: <AlertCircle className="size-6 text-amber-500" />,
            bg: 'bg-amber-50',
            border: 'border-amber-100',
            titleColor: 'text-amber-900',
            buttonBg: 'bg-amber-600 hover:bg-amber-500',
        },
        info: {
            icon: <Info className="size-6 text-blue-500" />,
            bg: 'bg-blue-50',
            border: 'border-blue-100',
            titleColor: 'text-blue-900',
            buttonBg: 'bg-blue-600 hover:bg-blue-500',
        },
    };

    const config = typeConfig[error.type || 'error'];

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className={`bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border ${config.border} animate-in zoom-in-95 duration-200`}>
                <div className={`p-6 ${config.bg} flex items-start gap-4`}>
                    <div className="shrink-0 pt-1">
                        {config.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                            <h3 className={`font-bold text-lg truncate ${config.titleColor}`}>
                                {error.title || 'Error'}
                            </h3>
                            <button
                                onClick={clearError}
                                className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                            >
                                <X className="size-4" />
                            </button>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            {error.message}
                        </p>
                    </div>
                </div>
                <div className="px-6 py-4 bg-white flex justify-end">
                    <button
                        onClick={clearError}
                        className={`px-5 py-2.5 rounded-xl text-white font-semibold text-sm transition-all shadow-lg ${config.buttonBg}`}
                    >
                        Dismiss
                    </button>
                </div>
            </div>
        </div>
    );
}
