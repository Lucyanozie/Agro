import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
export function Modal({ open, onClose, title, children, footer }) {
    useEffect(() => {
        if (!open)
            return;
        function onKey(e) {
            if (e.key === 'Escape')
                onClose();
        }
        document.addEventListener('keydown', onKey);
        const previous = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = previous;
        };
    }, [open, onClose]);
    if (!open)
        return null;
    return createPortal(<div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button type="button" aria-label="Close dialog" onClick={onClose} className="absolute inset-0 bg-ink/40 animate-fade-in"/>
      <div role="dialog" aria-modal="true" className="relative z-10 w-full max-w-md rounded-t-2xl bg-white p-6 shadow-lift animate-slide-up sm:rounded-2xl">
        <div className="mb-3 flex items-start justify-between gap-4">
          {title ? <h2 className="text-lg font-bold text-ink">{title}</h2> : <span />}
          <button type="button" onClick={onClose} className="-mr-1 -mt-1 rounded-full p-1.5 text-ink-mute transition hover:bg-brand-50 hover:text-ink" aria-label="Close">
            <X className="h-5 w-5"/>
          </button>
        </div>
        <div className="text-[15px] text-ink-soft">{children}</div>
        {footer ? <div className="mt-6 flex gap-3">{footer}</div> : null}
      </div>
    </div>, document.body);
}
