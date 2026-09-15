import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { cx, uid } from '@/lib/utils';
const ToastContext = createContext(null);
const ICONS = { success: CheckCircle2, error: AlertCircle, info: Info };
const TONES = {
    success: 'border-brand-200 bg-white text-brand-700',
    error: 'border-red-200 bg-white text-red-600',
    info: 'border-ink-line bg-white text-ink',
};
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const dismiss = useCallback((id) => {
        setToasts((list) => list.filter((t) => t.id !== id));
    }, []);
    const notify = useCallback((message, kind = 'success') => {
        const toast = { id: uid('t'), kind, message };
        setToasts((list) => [...list, toast]);
        window.setTimeout(() => dismiss(toast.id), 3200);
    }, [dismiss]);
    const value = useMemo(() => ({ notify }), [notify]);
    return (<ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-3 z-[60] flex flex-col items-center gap-2 px-4" role="status" aria-live="polite">
        {toasts.map((t) => {
            const Icon = ICONS[t.kind];
            return (<div key={t.id} className={cx('pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-xl border px-4 py-3 shadow-lift animate-toast-in', TONES[t.kind])}>
              <Icon className="h-5 w-5 shrink-0"/>
              <p className="flex-1 text-sm font-medium text-ink">{t.message}</p>
              <button type="button" onClick={() => dismiss(t.id)} className="rounded-full p-1 text-ink-mute transition hover:bg-brand-50 hover:text-ink" aria-label="Dismiss notification">
                <X className="h-4 w-4"/>
              </button>
            </div>);
        })}
      </div>
    </ToastContext.Provider>);
}
export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx)
        throw new Error('useToast must be used inside <ToastProvider>');
    return ctx;
}
