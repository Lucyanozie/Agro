import { ArrowDown, ArrowUp } from 'lucide-react';
import { EarningsChart } from '@/components/farmer/EarningsChart';
import { PageHeader } from '@/components/layout/Header';
import { cx } from '@/lib/utils';
export const PERIODS = ['This Week', 'This Month', 'This Year'];
export function PeriodSelect({ value, onChange, }) {
    return (<label className="relative inline-flex">
      <span className="sr-only">Reporting period</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="appearance-none rounded-lg border border-ink-line bg-white py-2.5 pl-4 pr-9 text-[15px] font-medium text-ink transition focus:border-brand-400 focus:outline-none">
        {PERIODS.map((p) => (<option key={p} value={p}>
            {p}
          </option>))}
      </select>
      <svg viewBox="0 0 20 20" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink" aria-hidden="true">
        <path d="M5 7.5 10 12.5 15 7.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    </label>);
}
export function Delta({ value }) {
    const up = value >= 0;
    const Icon = up ? ArrowUp : ArrowDown;
    return (<p className={cx('mt-1 flex items-center gap-0.5 text-[15px] font-bold', up ? 'text-brand-600' : 'text-red-500')}>
      <Icon className="h-4 w-4" strokeWidth={2.5}/>
      {Math.abs(value)}%
    </p>);
}
/** Shared frame for Earnings / Product Sold / Order Overview. */
export function MetricLayout({ title, backTo, period, onPeriodChange, metricLabel, metricValue, delta, data, children, footer, chartUnit, }) {
    return (<>
      <PageHeader title={title} backTo={backTo}/>

      <div className="mx-auto w-full max-w-3xl px-4 pb-12 lg:px-8">
        <div className="flex justify-end">
          <PeriodSelect value={period} onChange={onPeriodChange}/>
        </div>

        <div className="mt-5">
          <p className="text-[17px] font-medium text-ink-soft">{metricLabel}</p>
          <p className="mt-1 text-[30px] font-bold leading-none text-ink">{metricValue}</p>
          <Delta value={delta}/>
        </div>

        <div className="mt-6">
          <EarningsChart data={data} unit={chartUnit}/>
        </div>

        {children ? <div className="mt-8">{children}</div> : null}
        {footer ? <div className="mt-10">{footer}</div> : null}
      </div>
    </>);
}
