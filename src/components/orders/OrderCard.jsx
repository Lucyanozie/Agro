import { Link } from 'react-router-dom';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { longDate, money } from '@/lib/utils';
/** Buyer's order-history row. */
export function BuyerOrderCard({ order }) {
    return (<li className="border-b border-ink-line px-4 py-4 last:border-0 lg:rounded-xl lg:border lg:px-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[17px] font-bold text-ink">#{order.id}</p>
        <StatusBadge status={order.status} size="sm"/>
      </div>
      <p className="mt-1 text-[15px] text-ink-soft">Farmer: {order.farmerName}</p>
      <div className="mt-2 flex items-end justify-between gap-3">
        <Link to={`/buyer/orders/${order.id}`} className="text-[15px] font-semibold text-brand-600 hover:underline">
          View Details
        </Link>
        <p className="text-[17px] font-bold text-ink">{money(order.total)}</p>
      </div>
      <p className="mt-1 text-right text-[15px] text-ink-mute">{longDate(order.placedAt)}</p>
    </li>);
}
/** Farmer's order row — pending orders carry accept / cancel actions. */
export function FarmerOrderCard({ order, onAccept, onCancel, }) {
    return (<li className="border-b border-ink-line px-4 py-4 last:border-0 lg:rounded-xl lg:border lg:px-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[17px] font-bold text-ink">#{order.id}</p>
        <StatusBadge status={order.status} size="sm"/>
      </div>
      <div className="mt-1 flex items-baseline justify-between gap-3">
        <p className="truncate text-[15px] text-ink-soft">Buyer: {order.buyerName}</p>
        <p className="shrink-0 text-[17px] font-bold text-ink">{money(order.total)}</p>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <Link to={`/farmer/orders/${order.id}`} className="text-[15px] font-semibold text-brand-600 hover:underline">
          View Details
        </Link>
        <p className="text-[15px] text-ink-mute">{longDate(order.placedAt)}</p>
      </div>

      {order.status === 'pending' ? (<div className="mt-4 grid grid-cols-2 gap-4">
          <Button size="md" onClick={onAccept}>
            Accept
          </Button>
          <Button size="md" variant="danger" onClick={onCancel}>
            Cancel
          </Button>
        </div>) : null}
    </li>);
}
