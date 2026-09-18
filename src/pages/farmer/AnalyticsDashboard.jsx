import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDown,
  ArrowUp,
  ShoppingBag,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useOrders } from "@/context/OrderContext";
import { useProducts } from "@/context/ProductContext";
import { PageHeader } from "@/components/layout/Header";
import { cx, money } from "@/lib/utils";
import { PeriodSelect } from "./MetricLayout";
function MetricRow({ icon, label, value, delta, to }) {
  const up = delta >= 0;
  const Arrow = up ? ArrowUp : ArrowDown;
  return (
    <Link
      to={to}
      className="flex items-center gap-4 rounded-xl border border-ink-line px-4 py-5 transition hover:border-brand-300 hover:shadow-card"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
        {icon}
      </span>
      <span className="flex-1 text-[17px] font-medium text-ink-soft">
        {label}
      </span>
      <span className="text-right">
        <span className="block text-[17px] font-bold text-ink">{value}</span>
        <span
          className={cx(
            "mt-0.5 flex items-center justify-end gap-0.5 text-[15px] font-bold",
            up ? "text-brand-600" : "text-red-500",
          )}
        >
          <Arrow className="h-4 w-4" strokeWidth={2.5} />
          {Math.abs(delta)}%
        </span>
      </span>
    </Link>
  );
}
export function AnalyticsDashboard() {
  const { user } = useAuth();
  const { farmerOrders, earnings } = useOrders();
  const { products } = useProducts();
  const [period, setPeriod] = useState("This Month");
  const orders = farmerOrders(user?.id ?? "");
  const best = products.find(
    (product) => product.farmerId === user?.id && product.inStock,
  );
  const sold = orders.reduce(
    (total, order) =>
      total + order.lines.reduce((sum, line) => sum + line.qty, 0),
    0,
  );
  return (
    <>
      <PageHeader title="Analytic Dashboard" backTo="/farmer" />

      <div className="mx-auto w-full max-w-3xl px-4 pb-12 lg:px-8">
        <div className="flex justify-end">
          <PeriodSelect value={period} onChange={setPeriod} />
        </div>

        <div className="mt-5 space-y-4">
          <MetricRow
            icon={<TrendingUp className="h-6 w-6" />}
            label="Earnings"
            value={money(earnings.totalEarnings - earnings.withdrawn)}
            delta={0}
            to="/farmer/earnings"
          />
          <MetricRow
            icon={<ShoppingCart className="h-6 w-6" />}
            label="Product Sold"
            value={`${sold} units`}
            delta={0}
            to="/farmer/sold"
          />
          <MetricRow
            icon={<ShoppingBag className="h-6 w-6" />}
            label="Total Orders"
            value={orders.length}
            delta={0}
            to="/farmer/order-overview"
          />
        </div>

        {best ? (
          <section className="mt-8 rounded-xl border border-ink-line p-4">
            <h2 className="flex items-center gap-3 text-[17px] font-bold text-ink">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <ShoppingCart className="h-5 w-5" />
              </span>
              Best Selling Product
            </h2>
            <Link
              to={`/farmer/products/${best.id}`}
              className="mt-3 flex items-center gap-5 rounded-lg p-2 transition hover:bg-brand-50/50"
            >
              <img
                src={best.image}
                alt=""
                className="h-20 w-24 shrink-0 object-contain"
              />
              <span>
                <span className="block text-[17px] font-bold text-ink">
                  {best.name}
                </span>
                <span className="mt-1 block text-[15px] text-ink-soft">
                  ₦ {best.price.toLocaleString("en-NG")} / {best.unit}
                </span>
              </span>
            </Link>
          </section>
        ) : null}
      </div>
    </>
  );
}
