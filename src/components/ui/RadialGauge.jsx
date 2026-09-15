import { clamp } from '@/lib/utils';
/** Verification score ring — e.g. "99% Excellent!" on the review screen. */
export function RadialGauge({ value, size = 180, stroke = 14, caption, }) {
    const pct = clamp(value, 0, 100);
    const r = (size - stroke) / 2;
    const circumference = 2 * Math.PI * r;
    const offset = circumference * (1 - pct / 100);
    return (<div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E4F2E3" strokeWidth={stroke}/>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#2E9138" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} style={{ transition: 'stroke-dashoffset .9s cubic-bezier(.22,1,.36,1)' }}/>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[34px] font-extrabold leading-none text-ink">{pct}%</span>
        {caption ? (<span className="mt-1 text-sm font-semibold text-brand-600">{caption}</span>) : null}
      </div>
      <span className="sr-only">Verification score {pct} percent</span>
    </div>);
}
export function scoreCaption(score) {
    if (score >= 90)
        return 'Excellent!';
    if (score >= 70)
        return 'Good';
    if (score >= 40)
        return 'Getting there';
    return 'Just started';
}
