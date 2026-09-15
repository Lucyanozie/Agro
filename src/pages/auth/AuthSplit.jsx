import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { cx } from '@/lib/utils';
/**
 * Shared onboarding frame: a scrolling form column with a tall photograph
 * beside it from `lg` up, collapsing to a single column on phones.
 */
export function AuthSplit({ children, image, imageAlt, showBack = true, backTo, leaves = false, contentClassName, }) {
    const navigate = useNavigate();
    return (<div className="flex min-h-[100dvh] bg-white lg:p-6">
      <div className="relative flex min-h-[100dvh] w-full flex-col overflow-hidden lg:min-h-0 lg:w-1/2 lg:flex-none">
        <div className="flex items-center gap-3 px-5 pt-5">
          <span className="hidden items-center gap-2 lg:flex" aria-hidden="true">
            <span className="h-3 w-3 rounded-full bg-brand-500"/>
            <span className="h-3 w-3 rounded-full bg-ink"/>
            <span className="h-3 w-3 rounded-full bg-brand-100"/>
          </span>
        </div>

        {showBack ? (<button type="button" onClick={() => (backTo ? navigate(backTo) : navigate(-1))} aria-label="Go back" className="ml-3 mt-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink transition hover:bg-brand-50 lg:ml-5">
            <ChevronLeft className="h-6 w-6"/>
          </button>) : (<div className="h-6"/>)}

        <div className={cx('relative z-10 flex flex-1 flex-col justify-center px-6 pb-10 pt-2 lg:px-12', contentClassName)}>
          <div className="mx-auto w-full max-w-[26rem]">{children}</div>
        </div>

        {leaves ? (<img src="/img/leaves.png" alt="" aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-0 w-full select-none opacity-90"/>) : null}
      </div>

      <div className="hidden w-1/2 flex-none lg:block">
        <img src={image} alt={imageAlt} className="h-full max-h-[calc(100dvh-3rem)] w-full rounded-2xl object-cover"/>
      </div>
    </div>);
}
