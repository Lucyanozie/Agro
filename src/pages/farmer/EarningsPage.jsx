import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '@/context/OrderContext';
import { Button } from '@/components/ui/Button';
import { EARNINGS_SERIES } from '@/data/seed';
import { money } from '@/lib/utils';
import { MetricLayout } from './MetricLayout';
/** Scales the seeded daily series to the selected reporting period. */
export function seriesFor(period) {
    if (period === 'This Week')
        return [
            { label: 'Mon', value: 12 },
            { label: 'Tue', value: 18 },
            { label: 'Wed', value: 9 },
            { label: 'Thu', value: 22 },
            { label: 'Fri', value: 16 },
            { label: 'Sat', value: 27 },
            { label: 'Sun', value: 14 },
        ];
    if (period === 'This Year')
        return [
            { label: 'Q1', value: 38 },
            { label: 'Q2', value: 52 },
            { label: 'Q3', value: 46 },
            { label: 'Q4', value: 64 },
        ];
    return EARNINGS_SERIES;
}
export function EarningsPage() {
    const { earnings, availableBalance } = useOrders();
    const navigate = useNavigate();
    const [period, setPeriod] = useState('This Month');
    const data = useMemo(() => seriesFor(period), [period]);
    return (<MetricLayout title="Earnings" backTo="/farmer" period={period} onPeriodChange={setPeriod} metricLabel="Total Earnings" metricValue={money(earnings.totalEarnings)} delta={5} data={data} footer={<div className="space-y-3">
          <Button block onClick={() => navigate('/farmer/earnings/withdraw')}>
            Withdraw Earnings
          </Button>
          <p className="text-center text-[15px] text-ink-soft">
            Available to withdraw:{' '}
            <span className="font-bold text-ink">{money(availableBalance)}</span>
          </p>
        </div>}/>);
}
