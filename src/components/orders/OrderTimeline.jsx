import { Check } from 'lucide-react';
import { cx } from '@/lib/utils';
const STEPS = [
    { status: 'pending', label: 'Order placed', note: 'We sent your order to the farmer' },
    { status: 'processing', label: 'Confirmed', note: 'The farmer is packing your produce' },
    { status: 'in-transit', label: 'Out for delivery', note: 'Your rider is on the way' },
    { status: 'delivered', label: 'Delivered', note: 'Enjoy your produce' },
];
export function OrderTimeline({ status }) {
    if (status === 'cancelled') {
        return (<div className="rounded-xl bg-status-cancelledBg px-4 py-3 text-sm font-semibold text-status-cancelled">
        This order was cancelled.
      </div>);
    }
    const current = STEPS.findIndex((s) => s.status === status);
    return (<ol className="relative">
      {STEPS.map((step, i) => {
            const done = i <= current;
            const isLast = i === STEPS.length - 1;
            return (<li key={step.status} className="flex gap-4 pb-6 last:pb-0">
            <div className="flex flex-col items-center">
              <span className={cx('flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition', done ? 'border-brand-600 bg-brand-600 text-white' : 'border-ink-line bg-white')}>
                {done ? <Check className="h-4 w-4" strokeWidth={3}/> : null}
              </span>
              {!isLast ? (<span className={cx('mt-1 w-[2px] flex-1', i < current ? 'bg-brand-600' : 'bg-ink-line')}/>) : null}
            </div>
            <div className="pb-1">
              <p className={cx('text-[15px] font-bold', done ? 'text-ink' : 'text-ink-mute')}>
                {step.label}
              </p>
              <p className="mt-0.5 text-sm text-ink-soft">{step.note}</p>
            </div>
          </li>);
        })}
    </ol>);
}
