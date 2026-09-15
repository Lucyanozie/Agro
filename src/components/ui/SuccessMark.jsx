import { cx } from '@/lib/utils';
/** Deterministic confetti layout so the burst looks designed, not random. */
const CONFETTI = [
    { x: 22, y: 34, s: 5, c: '#E03131', r: 12, round: true },
    { x: 34, y: 16, s: 6, c: '#C9C93B', r: 20 },
    { x: 52, y: 6, s: 8, c: '#E03131', r: 0, round: true },
    { x: 68, y: 14, s: 6, c: '#C9C93B', r: 32 },
    { x: 80, y: 4, s: 4, c: '#E03131', r: 0, round: true },
    { x: 88, y: 24, s: 7, c: '#C9C93B', r: 18 },
    { x: 96, y: 42, s: 5, c: '#E03131', r: 0, round: true },
    { x: 12, y: 52, s: 5, c: '#2FB37A', r: 0, round: true },
    { x: 4, y: 40, s: 4, c: '#E03131', r: 24 },
    { x: 26, y: 58, s: 7, c: '#C9C93B', r: 40 },
    { x: 16, y: 70, s: 6, c: '#E03131', r: 0, round: true },
    { x: 30, y: 74, s: 5, c: '#2FB37A', r: 0, round: true },
    { x: 8, y: 78, s: 6, c: '#E8913A', r: 0, round: true },
    { x: 22, y: 86, s: 7, c: '#C9C93B', r: 14 },
    { x: 6, y: 92, s: 4, c: '#C9C93B', r: 28 },
    { x: 44, y: 30, s: 6, c: '#C9C93B', r: 36 },
    { x: 62, y: 40, s: 5, c: '#C9C93B', r: 0, round: true },
    { x: 92, y: 62, s: 5, c: '#2FB37A', r: 0, round: true },
    { x: 78, y: 80, s: 7, c: '#C9C93B', r: 22 },
    { x: 98, y: 76, s: 4, c: '#E03131', r: 0, round: true },
    { x: 86, y: 56, s: 4, c: '#E03131', r: 0, round: true },
    { x: 70, y: 92, s: 6, c: '#C9C93B', r: 30 },
];
/**
 * Celebration graphic shared by every "done" screen — account created,
 * verification approved, product published, order placed, withdrawal sent.
 */
export function SuccessMark({ className }) {
    return (<div className={cx('relative mx-auto aspect-[3/2] w-full max-w-[320px]', className)} aria-hidden="true">
      {CONFETTI.map((c, i) => (<span key={i} className="absolute animate-pop-in" style={{
                left: `${c.x}%`,
                top: `${c.y}%`,
                width: c.s,
                height: c.s,
                background: c.c,
                borderRadius: c.round ? '50%' : '1px',
                transform: `rotate(${c.r}deg)`,
                animationDelay: `${120 + i * 22}ms`,
            }}/>))}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="animate-pop-in rounded-full bg-[#3FBE1F] p-1 shadow-[0_6px_0_rgba(0,0,0,.12)]">
          <svg viewBox="0 0 100 100" className="h-[104px] w-[104px]">
            <circle cx="50" cy="50" r="50" fill="#3FBE1F"/>
            <path d="M28 52 L43 67 L73 33" fill="none" stroke="#CBEFAF" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>);
}
export function SuccessScreen({ title, description, children, actions }) {
    return (<div className="mx-auto flex min-h-[100dvh] w-full max-w-md flex-col items-center justify-center px-6 py-10 text-center">
      <SuccessMark />
      <h1 className="mt-4 text-[34px] font-extrabold leading-tight text-ink">{title}</h1>
      {description ? (<div className="mt-4 max-w-[19rem] text-[15px] leading-relaxed text-ink-soft">
          {description}
        </div>) : null}
      {children ? <div className="mt-6 w-full">{children}</div> : null}
      <div className="mt-9 w-full">{actions}</div>
    </div>);
}
