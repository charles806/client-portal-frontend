import React, { createContext, useContext, useState, useCallback } from 'react';

interface ErrorState {
    message: string;
    title?: string;
    type?: 'error' | 'warning' | 'info';
}

interface ErrorContextType {
    error: ErrorState | null;
    showError: (message: string, title?: string, type?: 'error' | 'warning' | 'info') => void;
    clearError: () => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

// Global reference for API interceptor
let globalShowError: ((message: string, title?: string, type?: 'error' | 'warning' | 'info') => void) | null = null;

export const showErrorGlobal = (message: string, title?: string, type?: 'error' | 'warning' | 'info' = 'error') => {
    if (globalShowError) {
        globalShowError(message, title, type);
    }
};

export function ErrorProvider({ children }: { children: React.ReactNode }) {
    const [error, setError] = useState<ErrorState | null>(null);

    const showError = useCallback((message: string, title?: string, type: 'error' | 'warning' | 'info' = 'error') => {
        setError({ message, title, type });
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // Set global reference
    globalShowError = showError;

    return (
        <ErrorContext.Provider value={{ error, showError, clearError }}>
            {children}
        </ErrorContext.Provider>
    );
}

export function useError() {
    const context = useContext(ErrorContext);
    if (context === undefined) {
        throw new Error('useError must be used within an ErrorProvider');
    }
    return context;
}
