
export function cx(...parts) {
    return parts.filter(Boolean).join(' ');
}
export const NAIRA = '₦';
export function money(amount, opts = {}) {
    return (NAIRA +
        amount.toLocaleString('en-NG', {
            minimumFractionDigits: opts.decimals ? 2 : 0,
            maximumFractionDigits: opts.decimals ? 2 : 0,
        }));
}
const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];
/** "June 30,2026" — the date style used across the order screens. */
export function longDate(iso) {
    const d = new Date(iso);
    return `${MONTHS[d.getMonth()]} ${d.getDate()},${d.getFullYear()}`;
}
export function shortTime(iso) {
    const d = new Date(iso);
    let h = d.getHours();
    const suffix = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${String(d.getMinutes()).padStart(2, '0')} ${suffix}`;
}
/** Chat list stamp: time today, "Yesterday", otherwise a numeric date. */
export function chatStamp(iso) {
    const d = new Date(iso);
    const now = new Date();
    const days = Math.floor((new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() -
        new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()) /
        86_400_000);
    if (days <= 0)
        return shortTime(iso);
    if (days === 1)
        return 'Yesterday';
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}
export function greeting(d = new Date()) {
    const h = d.getHours();
    if (h < 12)
        return 'Good morning';
    if (h < 17)
        return 'Good afternoon';
    return 'Good evening';
}
export function initials(name) {
    return name
        .replace(/[^a-zA-Z ,]/g, '')
        .split(/[\s,]+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0].toUpperCase())
        .join('');
}
export function uid(prefix = 'id') {
    return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}
/** Sequential-looking order reference, e.g. ORD12346. */
export function nextOrderId(existing) {
    const nums = existing
        .map((id) => Number(id.replace(/\D/g, '')))
        .filter((n) => Number.isFinite(n) && n > 0);
    const next = (nums.length ? Math.max(...nums) : 12_345) + 1;
    return `ORD${next}`;
}
export function addDays(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
}
export function clamp(n, min, max) {
    return Math.min(max, Math.max(min, n));
}
