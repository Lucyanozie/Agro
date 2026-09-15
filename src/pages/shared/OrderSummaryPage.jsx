import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, MapPin, MessageCircle } from 'lucide-react';
import { useOrders } from '@/context/OrderContext';
import { useToast } from '@/context/ToastContext';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button, LinkButton } from '@/components/ui/Button';
import { OrderTimeline } from '@/components/orders/OrderTimeline';
import { longDate, money } from '@/lib/utils';
/** Order detail, shared by both roles — the action row differs by role. */
export function OrderSummaryPage({ role }) {
    const { id = '' } = useParams();
    const { byId, setStatus } = useOrders();
    const { notify } = useToast();
    const navigate = useNavigate();
    const order = byId(id);
    if (!order)
        return <Navigate to={role === 'farmer' ? '/farmer/orders' : '/buyer/orders'} replace/>;
    const chatPath = role === 'farmer' ? '/farmer/chats' : '/buyer/chats';
    return (<div className="mx-auto w-full max-w-3xl px-4 pb-12 lg:px-8">
      <div className="py-3">
        <button type="button" onClick={() => navigate(role === 'farmer' ? '/farmer/orders' : '/buyer/orders')} aria-label="Go back" className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full text-ink transition hover:bg-brand-50">
          <ChevronLeft className="h-6 w-6"/>
        </button>
      </div>

      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-medium tracking-wide text-ink">ORDER SUMMARY</h1>
        <StatusBadge status={order.status}/>
      </div>

      <p className="mt-1 text-[15px] text-ink-soft">
        #{order.id} · placed {longDate(order.placedAt)}
      </p>

      <ul className="mt-4 border-t border-ink-line">
        {order.lines.map((line) => (<li key={line.productId} className="border-b border-ink-line py-4">
            <div className="flex items-center gap-4">
              <img src={line.image} alt={line.name} className="h-[70px] w-[92px] shrink-0 rounded-lg object-contain"/>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[17px] font-bold text-ink">{line.name}</p>
                <p className="mt-0.5 text-[15px] text-ink-soft">
                  {money(line.price)} / {line.unit} × {line.qty}
                </p>
              </div>
              <p className="shrink-0 text-[17px] font-bold text-ink">
                {money(line.price * line.qty)}
              </p>
            </div>
          </li>))}
      </ul>

      <dl className="mt-5 space-y-2.5">
        <div className="flex items-center justify-between text-[17px]">
          <dt className="text-ink">Subtotal</dt>
          <dd className="font-semibold text-ink">{money(order.subtotal)}</dd>
        </div>
        <div className="flex items-center justify-between text-[17px]">
          <dt className="text-ink">Delivery Fee ({order.lines.length})</dt>
          <dd className="font-semibold text-ink">{money(order.deliveryFee)}</dd>
        </div>
        <div className="flex items-center justify-between border-t border-ink-line pt-3 text-[17px]">
          <dt className="font-bold text-ink">Total</dt>
          <dd className="font-bold text-ink">{money(order.total)}</dd>
        </div>
      </dl>

      <section className="mt-6 rounded-xl border border-ink-line p-4">
        <h2 className="flex items-center gap-2 text-[15px] font-bold text-ink">
          <MapPin className="h-[18px] w-[18px] text-brand-600"/>
          Delivery address
        </h2>
        <p className="mt-1 text-[15px] text-ink-soft">{order.address}</p>
        <p className="mt-3 text-[15px] text-ink-soft">
          {role === 'farmer' ? `Buyer: ${order.buyerName}` : `Farmer: ${order.farmerName}`}
        </p>
      </section>

      <section className="mt-6 rounded-xl border border-ink-line p-4">
        <h2 className="mb-4 text-[15px] font-bold text-ink">Progress</h2>
        <OrderTimeline status={order.status}/>
      </section>

      <div className="mt-7 space-y-3">
        {role === 'farmer' ? (<>
            {order.status === 'pending' ? (<div className="grid grid-cols-2 gap-3">
                <Button onClick={() => {
                    setStatus(order.id, 'processing');
                    notify(`Order #${order.id} accepted`);
                }}>
                  Accept
                </Button>
                <Button variant="danger" onClick={() => {
                    setStatus(order.id, 'cancelled');
                    notify(`Order #${order.id} cancelled`, 'error');
                }}>
                  Cancel
                </Button>
              </div>) : null}
            {order.status === 'processing' ? (<Button block onClick={() => {
                    setStatus(order.id, 'in-transit');
                    notify('Order marked as out for delivery');
                }}>
                Mark as out for delivery
              </Button>) : null}
            {order.status === 'in-transit' ? (<Button block onClick={() => {
                    setStatus(order.id, 'delivered');
                    notify('Order marked delivered — earnings credited');
                }}>
                Mark as delivered
              </Button>) : null}
          </>) : (<>
            {order.status === 'in-transit' || order.status === 'processing' ? (<LinkButton to={`/buyer/track/${order.id}`} block>
                Track this order
              </LinkButton>) : null}
            {order.status === 'delivered' && !order.rated ? (<LinkButton to={`/buyer/orders/${order.id}/rate`} variant="outline" block>
                Rate your farmer
              </LinkButton>) : null}
          </>)}

        <LinkButton to={chatPath} variant="ghost" block>
          <MessageCircle className="h-5 w-5"/>
          {role === 'farmer' ? 'Message buyer' : 'Message farmer'}
        </LinkButton>
      </div>
    </div>);
}
