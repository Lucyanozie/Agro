import { Navigate, useParams } from "react-router-dom";
import { Phone } from "lucide-react";
import { useOrders } from "@/context/OrderContext";
import { PageHeader } from "@/components/layout/Header";
import { DeliveryMap } from "@/components/orders/DeliveryMap";
import { LinkButton } from "@/components/ui/Button";
import { longDate } from "@/lib/utils";
const STATUS_COPY = {
  pending: "Awaiting farmer confirmation",
  processing: "Preparing your order",
  "in-transit": "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};
export function OrderTrackingPage() {
  const { id = "" } = useParams();
  const { byId } = useOrders();
  const order = byId(id);
  if (!order) return <Navigate to="/buyer/orders" replace />;
  return (
    <>
      <PageHeader
        title="Delivery Tracking"
        backTo={`/buyer/orders/${order.id}`}
      />

      <div className="mx-auto w-full max-w-3xl pb-10">
        <section className="mx-4 rounded-xl border border-ink-line p-4 lg:mx-8">
          <p className="text-[15px] text-ink-mute">Order ID</p>
          <p className="mt-0.5 text-[17px] font-bold text-ink">#{order.id}</p>

          <p className="mt-4 text-[15px] text-ink-mute">Status</p>
          <p className="mt-0.5 text-[17px] font-bold text-brand-600">
            {STATUS_COPY[order.status] ?? order.status}
          </p>

          <p className="mt-4 text-[15px] text-ink-mute">Estimated Delivery</p>
          <p className="mt-0.5 text-[17px] font-bold text-ink">
            {longDate(order.deliveryEstimate)} - 2:00 PM
          </p>
        </section>

        <div className="relative mt-4">
          <DeliveryMap status={order.status} />

          {order.riderName ? (
            <div className="relative z-20 mx-4 -mt-6 flex items-center gap-4 rounded-xl border border-ink-line bg-white p-3 shadow-lift lg:mx-8">
              <div className="min-w-0 flex-1">
                <p className="truncate text-[17px] font-bold text-ink">
                  {order.riderName}
                </p>
                <p className="text-[15px] text-ink-mute">Your rider</p>
              </div>
              {order.riderPhone ? (
                <a
                  href={`tel:${order.riderPhone}`}
                  aria-label={`Call ${order.riderName}`}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-brand-600 transition hover:bg-brand-50"
                >
                  <Phone className="h-6 w-6" />
                </a>
              ) : null}
            </div>
          ) : null}
        </div>

        {order.status === "delivered" && !order.rated ? (
          <div className="mx-4 mt-6 lg:mx-8">
            <LinkButton to={`/buyer/orders/${order.id}/rate`} block>
              Rate your farmer
            </LinkButton>
          </div>
        ) : null}
      </div>
    </>
  );
}
