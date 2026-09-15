import { cx } from '@/lib/utils';
const LABELS = {
    pending: 'Pending',
    processing: 'Processing',
    'in-transit': 'In-transit',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
};
const TONES = {
    pending: 'bg-status-pendingBg text-status-pending',
    processing: 'bg-status-processingBg text-status-processing',
    'in-transit': 'bg-status-transitBg text-status-transit',
    delivered: 'bg-status-deliveredBg text-status-delivered',
    cancelled: 'bg-status-cancelledBg text-status-cancelled',
};
export function StatusBadge({ status, className, size = 'md', }) {
    return (<span className={cx('inline-flex items-center justify-center rounded-full font-semibold', size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-4 py-1.5 text-sm', TONES[status], className)}>
      {LABELS[status]}
    </span>);
}
export function VerifiedBadge({ className }) {
    return (<span className={cx('inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700', className)}>
      <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" aria-hidden="true">
        <path fill="currentColor" d="m10 1.2 1.9 1.5 2.4-.3 1 2.2 2.2 1-.3 2.4L18.8 10l-1.6 1.9.3 2.4-2.2 1-1 2.2-2.4-.3L10 18.8l-1.9-1.6-2.4.3-1-2.2-2.2-1 .3-2.4L1.2 10l1.6-1.9-.3-2.4 2.2-1 1-2.2 2.4.3L10 1.2Z"/>
        <path fill="#fff" d="m8.9 12.7-2.4-2.4 1.1-1.1 1.3 1.3 3.5-3.5 1.1 1.1-4.6 4.6Z"/>
      </svg>
      Verified
    </span>);
}
