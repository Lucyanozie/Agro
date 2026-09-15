import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { StepIndicator } from '@/components/ui/StepIndicator';
/**
 * Frame for the verification steps: back control, optional dot rail, and a
 * centred column that widens into two readable columns on desktop.
 */
export function VerificationLayout({ step, title, subtitle, children, footer, backTo, }) {
    const navigate = useNavigate();
    return (<div className="mx-auto flex min-h-[100dvh] w-full max-w-2xl flex-col px-5 pb-10 pt-4">
      <div className="flex items-center gap-4">
        <button type="button" onClick={() => (backTo ? navigate(backTo) : navigate(-1))} aria-label="Go back" className="-ml-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink transition hover:bg-brand-50">
          <ChevronLeft className="h-6 w-6"/>
        </button>
        {step ? <StepIndicator current={step} className="mx-auto"/> : null}
        <span className="h-10 w-10 shrink-0" aria-hidden="true"/>
      </div>

      <header className="mt-5 text-center">
        <h1 className="text-[26px] font-extrabold leading-tight text-ink">{title}</h1>
        {subtitle ? <p className="mt-1.5 text-[17px] text-ink-soft">{subtitle}</p> : null}
      </header>

      <div className="mt-6 flex-1">{children}</div>

      <div className="mt-8">{footer}</div>
    </div>);
}
