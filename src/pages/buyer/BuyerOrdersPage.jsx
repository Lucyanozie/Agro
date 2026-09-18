import { useMemo, useState } from "react";
import { PackageOpen } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useOrders } from "@/context/OrderContext";
import { PageHeader } from "@/components/layout/Header";
import { BuyerOrderCard } from "@/components/orders/OrderCard";
import { EmptyState } from "@/components/ui/Bits";
import { LinkButton } from "@/components/ui/Button";
import { cx } from "@/lib/utils";
const TABS = [
  { label: "All", value: "all" },
  { label: "Processing", value: "processing" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];
export function BuyerOrdersPage() {
  const { user } = useAuth();
  const { buyerOrders } = useOrders();
  const [tab, setTab] = useState("all");
  const orders = buyerOrders(user?.id ?? "");
  const visible = useMemo(() => {
    if (tab === "all") return orders;
    // Pending and in-transit orders are both "in progress" to a buyer.
    if (tab === "processing")
      return orders.filter(
        (o) =>
          o.status === "processing" ||
          o.status === "pending" ||
          o.status === "in-transit",
      );
    return orders.filter((o) => o.status === tab);
  }, [orders, tab]);
  return (
    <>
      <PageHeader title="My Orders" backTo="/buyer" />

      <div className="px-4 pb-10 lg:px-8">
        <div
          className="no-scrollbar -mx-4 flex gap-7 overflow-x-auto border-b border-ink-line px-4 lg:mx-0 lg:px-0"
          role="tablist"
        >
          {TABS.map((t) => (
            <button
              key={t.value}
              role="tab"
              aria-selected={tab === t.value}
              onClick={() => setTab(t.value)}
              className={cx(
                "relative shrink-0 pb-2.5 text-[17px] transition",
                tab === t.value
                  ? "font-bold text-brand-600"
                  : "font-medium text-ink-soft",
              )}
            >
              {t.label}
              {tab === t.value ? (
                <span className="absolute inset-x-0 -bottom-px h-[3px] rounded-full bg-brand-600" />
              ) : null}
            </button>
          ))}
        </div>

        {visible.length ? (
          <ul className="mt-4 overflow-hidden rounded-xl border border-ink-line lg:grid lg:grid-cols-2 lg:gap-3 lg:border-0 xl:grid-cols-3">
            {visible.map((order) => (
              <BuyerOrderCard key={order.id} order={order} />
            ))}
          </ul>
        ) : (
          <div className="mt-8">
            <EmptyState
              icon={<PackageOpen className="h-7 w-7" />}
              title="No orders here"
              description="Once you place an order it will show up in this list."
              action={<LinkButton to="/buyer">Browse produce</LinkButton>}
            />
          </div>
        )}
      </div>
    </>
  );
}
