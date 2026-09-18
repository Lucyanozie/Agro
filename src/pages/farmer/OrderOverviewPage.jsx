import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useOrders } from "@/context/OrderContext";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { longDate, money } from "@/lib/utils";
import { MetricLayout } from "./MetricLayout";
import { seriesFor } from "./EarningsPage";
export function OrderOverviewPage() {
  const { user } = useAuth();
  const { farmerOrders } = useOrders();
  const [period, setPeriod] = useState("This Month");
  const orders = farmerOrders(user?.id ?? "");
  const data = useMemo(() => seriesFor(period), [period]);
  return (
    <MetricLayout
      title="Order Overview"
      backTo="/farmer/analytics"
      period={period}
      onPeriodChange={setPeriod}
      metricLabel="Total Orders"
      metricValue={orders.length}
      delta={0}
      data={data}
    >
      <section>
        <h2 className="mb-3 text-[22px] font-bold text-ink">Recents</h2>
        <ul className="space-y-3">
          {orders.slice(0, 4).map((order) => (
            <li
              key={order.id}
              className="rounded-xl border border-ink-line px-4 py-3"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-[17px] font-bold text-ink">#{order.id}</p>
                <StatusBadge status={order.status} size="sm" />
              </div>
              <div className="mt-1 flex items-baseline justify-between gap-3">
                <p className="truncate text-[15px] text-ink-soft">
                  Buyer: {order.buyerName}
                </p>
                <p className="shrink-0 text-[17px] font-bold text-ink">
                  {money(order.total)}
                </p>
              </div>
              <div className="mt-2 flex items-center justify-between gap-3">
                <Link
                  to={`/farmer/orders/${order.id}`}
                  className="text-[15px] font-semibold text-brand-600 hover:underline"
                >
                  View Details
                </Link>
                <p className="text-[15px] text-ink-mute">
                  {longDate(order.placedAt)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </MetricLayout>
  );
}
