import { Link } from 'react-router-dom';
import { Search, Star } from 'lucide-react';
import { cx } from '@/lib/utils';
export function Logo({ variant = 'green', className, }) {
    return (<img src={variant === 'white' ? '/img/logo-white.png' : '/img/logo.png'} alt="AgroConnect" className={cx('h-auto w-[150px] select-none', className)} draggable={false}/>);
}
export function SearchInput({ wrapClassName, className, ...rest }) {
    return (<div className={cx('relative w-full', wrapClassName)}>
      <Search className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink-mute"/>
      <input type="search" {...rest} className={cx('w-full rounded-full border border-ink-line bg-white py-3 pl-11 pr-4 text-[15px] text-ink transition placeholder:text-ink-mute focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100', className)}/>
    </div>);
}
export function StarRating({ value, size = 18, className, }) {
    return (<div className={cx('flex items-center gap-0.5', className)} aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (<Star key={i} style={{ width: size, height: size }} className={cx(i <= Math.round(value) ? 'fill-[#FFB800] text-[#FFB800]' : 'fill-ink-line text-ink-line')}/>))}
    </div>);
}
export function Pill({ active, children, onClick, className, }) {
    return (<button type="button" onClick={onClick} className={cx('shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition', active
            ? 'border-brand-600 bg-brand-600 text-white'
            : 'border-ink-line bg-white text-ink hover:border-brand-300 hover:bg-brand-50', className)}>
      {children}
    </button>);
}
/** Soft green chip used for crop / farm-type multi-select. */
export function ChoiceChip({ active, children, onClick, }) {
    return (<button type="button" onClick={onClick} aria-pressed={active} className={cx('rounded-full border px-5 py-2.5 text-[15px] font-semibold transition', active
            ? 'border-brand-600 bg-brand-50 text-brand-700'
            : 'border-transparent bg-brand-50/70 text-brand-600 hover:bg-brand-100')}>
      {children}
    </button>);
}
export function SectionHeading({ title, action, to, className, }) {
    return (<div className={cx('mb-3 flex items-end justify-between gap-4', className)}>
      <h2 className="text-xl font-bold text-brand-600">{title}</h2>
      {action && to ? (<Link to={to} className="text-sm font-semibold text-brand-600 hover:underline">
          {action}
        </Link>) : null}
    </div>);
}
export function EmptyState({ icon, title, description, action, }) {
    return (<div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-line px-6 py-14 text-center">
      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600">
        {icon}
      </div>
      <h3 className="text-base font-bold text-ink">{title}</h3>
      {description ? <p className="mt-1 max-w-xs text-sm text-ink-soft">{description}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>);
}
export function Toggle({ checked, onChange, label, }) {
    return (<button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)} className={cx('relative h-7 w-12 shrink-0 rounded-full transition', checked ? 'bg-brand-600' : 'bg-ink-line')}>
      <span className={cx('absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all', checked ? 'left-6' : 'left-1')}/>
    </button>);
}
