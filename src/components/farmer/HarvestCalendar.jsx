import { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cx } from '@/lib/utils';
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];
const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];
/** Monday-first grid with harvest days marked green and today marked blue. */
export function HarvestCalendar({ harvestDates, initialMonth, }) {
    const [cursor, setCursor] = useState(() => initialMonth ?? new Date());
    const harvestDays = useMemo(() => {
        return new Set(harvestDates
            .map((d) => new Date(d))
            .filter((d) => d.getMonth() === cursor.getMonth() && d.getFullYear() === cursor.getFullYear())
            .map((d) => d.getDate()));
    }, [harvestDates, cursor]);
    const cells = useMemo(() => {
        const year = cursor.getFullYear();
        const month = cursor.getMonth();
        const first = new Date(year, month, 1);
        // getDay() is Sunday-first; shift so Monday starts the week.
        const lead = (first.getDay() + 6) % 7;
        const days = new Date(year, month + 1, 0).getDate();
        return [
            ...Array.from({ length: lead }, () => null),
            ...Array.from({ length: days }, (_, i) => i + 1),
        ];
    }, [cursor]);
    const today = new Date();
    const isCurrentMonth = today.getMonth() === cursor.getMonth() && today.getFullYear() === cursor.getFullYear();
    function shiftMonth(delta) {
        setCursor((c) => new Date(c.getFullYear(), c.getMonth() + delta, 1));
    }
    return (<section className="card p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[17px] font-bold text-ink">Harvest Calendar</h2>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => shiftMonth(-1)} className="rounded-full p-1.5 text-ink-soft transition hover:bg-brand-50" aria-label="Previous month">
            <ChevronDown className="h-4 w-4 rotate-90"/>
          </button>
          <span className="min-w-[104px] text-center text-[17px] font-bold text-ink">
            {MONTHS[cursor.getMonth()]} {cursor.getFullYear()}
          </span>
          <button type="button" onClick={() => shiftMonth(1)} className="rounded-full p-1.5 text-ink-soft transition hover:bg-brand-50" aria-label="Next month">
            <ChevronDown className="h-4 w-4 -rotate-90"/>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-y-2 text-center">
        {WEEKDAYS.map((d) => (<div key={d} className="text-sm font-semibold text-ink">
            {d}
          </div>))}
        {cells.map((day, i) => {
            if (day === null)
                return <div key={`pad-${i}`}/>;
            const isHarvest = harvestDays.has(day);
            const isToday = isCurrentMonth && today.getDate() === day;
            return (<div key={day} className="flex items-center justify-center py-0.5">
              <span className={cx('flex h-8 w-8 items-center justify-center rounded-full text-[15px] font-semibold transition', isToday
                    ? 'bg-[#2F7BEA] text-white'
                    : isHarvest
                        ? 'bg-brand-600 text-white'
                        : 'text-ink')}>
                {day}
              </span>
            </div>);
        })}
      </div>

      <div className="mt-4 flex items-center gap-6">
        <span className="flex items-center gap-2 text-sm font-semibold text-ink-soft">
          <span className="h-3.5 w-3.5 rounded-full bg-brand-600"/>
          Harvest Day
        </span>
        <span className="flex items-center gap-2 text-sm font-semibold text-ink-soft">
          <span className="h-3.5 w-3.5 rounded-full bg-[#2F7BEA]"/>
          Today
        </span>
      </div>
    </section>);
}
