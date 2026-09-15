import { useMemo, useState } from 'react';
import { PackageOpen } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useOrders } from '@/context/OrderContext';
import { useToast } from '@/context/ToastContext';
import { PageHeader } from '@/components/layout/Header';
import { FarmerOrderCard } from '@/components/orders/OrderCard';
import { EmptyState } from '@/components/ui/Bits';
import { cx } from '@/lib/utils';
const TABS = [
    { label: 'Pending', value: 'pending' },
    { label: 'Processing', value: 'processing' },
    { label: 'Delivered', value: 'delivered' },
    { label: 'Cancelled', value: 'cancelled' },
];
export function FarmerOrdersPage() {
    const { user } = useAuth();
    const { farmerOrders, setStatus } = useOrders();
    const { notify } = useToast();
    const [tab, setTab] = useState('pending');
    const orders = farmerOrders(user?.id ?? 'u-musa');
    /**
     * The Pending tab doubles as the action queue, so it also surfaces orders
     * already moving through fulfilment rather than looking empty once accepted.
     */
    const visible = useMemo(() => {
        if (tab === 'all')
            return orders;
        if (tab === 'pending')
            return orders.filter((o) => o.status === 'pending' || o.status === 'in-transit');
        return orders.filter((o) => o.status === tab);
    }, [orders, tab]);
    return (<>
      <PageHeader title="My Orders" backTo="/farmer"/>

      <div className="px-4 pb-10 lg:px-8">
        <div className="no-scrollbar -mx-4 flex gap-6 overflow-x-auto border-b border-ink-line px-4 lg:mx-0 lg:px-0" role="tablist">
          {TABS.map((t) => (<button key={t.value} role="tab" aria-selected={tab === t.value} onClick={() => setTab(t.value)} className={cx('relative shrink-0 pb-2.5 text-[17px] transition', tab === t.value ? 'font-bold text-brand-600' : 'font-medium text-ink')}>
              {t.label}
              {tab === t.value ? (<span className="absolute inset-x-0 -bottom-px h-[3px] rounded-full bg-brand-600"/>) : null}
            </button>))}
        </div>

        {visible.length ? (<ul className="mt-1 lg:mt-4 lg:space-y-3">
            {visible.map((order) => (<FarmerOrderCard key={order.id} order={order} onAccept={() => {
                    setStatus(order.id, 'processing');
                    notify(`Order #${order.id} accepted`);
                }} onCancel={() => {
                    setStatus(order.id, 'cancelled');
                    notify(`Order #${order.id} cancelled`, 'error');
                }}/>))}
          </ul>) : (<div className="mt-8">
            <EmptyState icon={<PackageOpen className="h-7 w-7"/>} title="Nothing here yet" description={`You have no ${tab === 'all' ? '' : tab} orders right now.`}/>
          </div>)}
      </div>
    </>);
}
