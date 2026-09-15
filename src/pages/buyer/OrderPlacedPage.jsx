import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useOrders } from '@/context/OrderContext';
import { Button, LinkButton } from '@/components/ui/Button';
import { SuccessScreen } from '@/components/ui/SuccessMark';
import { longDate } from '@/lib/utils';
export function OrderPlacedPage() {
    const { id = '' } = useParams();
    const { byId } = useOrders();
    const { user } = useAuth();
    const navigate = useNavigate();
    const order = byId(id);
    const firstName = user?.name.split(' ')[0] ?? 'Serah';
    return (<SuccessScreen title="Order Placed!" description={<p>Thank you {firstName}. Your order has been recieved</p>} actions={<div className="space-y-3">
          {order ? (<LinkButton to={`/buyer/track/${order.id}`} block>
              Track this order
            </LinkButton>) : null}
          <Button variant="ghost" block onClick={() => navigate('/buyer', { replace: true })} className="!text-[19px]">
            Back to Home
          </Button>
        </div>}>
      {order ? (<div className="overflow-hidden rounded-lg border border-ink-line text-left">
          <div className="border-b border-ink-line px-4 py-3">
            <p className="text-[15px] text-ink-mute">Order ID</p>
            <p className="mt-0.5 text-[17px] font-bold text-ink">#{order.id}</p>
          </div>
          <div className="px-4 py-3">
            <p className="text-[15px] text-ink-mute">Delivery</p>
            <p className="mt-0.5 text-[17px] font-medium text-ink">
              {longDate(order.deliveryEstimate)}{' '}
              <span className="text-[15px] text-ink-soft">(2-3 days)</span>
            </p>
          </div>
        </div>) : null}
    </SuccessScreen>);
}
