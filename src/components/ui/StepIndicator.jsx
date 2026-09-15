import { cx } from '@/lib/utils';
/**
 * Connected dot rail used across the farmer verification flow.
 * `current` is 1-based; every dot up to and including it reads as complete.
 */
export function StepIndicator({ current, total = 6, className, }) {
    return (<div className={cx('flex w-full max-w-[260px] items-center', className)} role="progressbar" aria-valuenow={current} aria-valuemin={1} aria-valuemax={total} aria-label={`Step ${current} of ${total}`}>
      {Array.from({ length: total }, (_, i) => {
            const step = i + 1;
            const done = step <= current;
            return (<div key={step} className={cx('flex items-center', i < total - 1 && 'flex-1')}>
            <span className={cx('block h-[18px] w-[18px] shrink-0 rounded-full border-2 transition', done ? 'border-brand-600 bg-brand-600' : 'border-brand-500 bg-white')}/>
            {i < total - 1 ? (<span className={cx('h-[2px] flex-1 transition', step < current ? 'bg-brand-600' : 'bg-brand-200')}/>) : null}
          </div>);
        })}
    </div>);
}
