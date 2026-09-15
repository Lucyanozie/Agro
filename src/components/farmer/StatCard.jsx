import { Link } from 'react-router-dom';
import { cx } from '@/lib/utils';
const TONES = {
    green: { card: 'bg-brand-50/70 border-brand-100', icon: 'text-brand-600' },
    blue: { card: 'bg-[#EEF2FF] border-[#DCE3FB]', icon: 'text-[#2F5FD0]' },
    amber: { card: 'bg-[#FDF3E7] border-[#F7E3CB]', icon: 'text-[#E8913A]' },
};
export function StatCard({ icon, value, label, tone = 'green', to, className, }) {
    const body = (<>
      <span className={cx('mb-2 inline-flex', TONES[tone].icon)}>{icon}</span>
      <span className="block text-[17px] font-bold leading-tight text-ink">{value}</span>
      <span className="mt-0.5 block text-sm text-ink-soft">{label}</span>
    </>);
    const classes = cx('flex flex-col rounded-xl border px-4 py-3 text-left transition', TONES[tone].card, to && 'hover:shadow-card', className);
    return to ? (<Link to={to} className={classes}>
      {body}
    </Link>) : (<div className={classes}>{body}</div>);
}
