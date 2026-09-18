import { useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useProducts } from "@/context/ProductContext";
import { useOrders } from "@/context/OrderContext";
import { ProductTile } from "@/components/marketplace/ProductCard";
import { MetricLayout } from "./MetricLayout";
import { seriesFor } from "./EarningsPage";
export function ProductSoldPage() {
  const { user } = useAuth();
  const { products } = useProducts();
  const { farmerOrders } = useOrders();
  const sold = farmerOrders(user?.id ?? "").reduce(
    (total, order) =>
      total + order.lines.reduce((sum, line) => sum + line.qty, 0),
    0,
  );
  const [period, setPeriod] = useState("This Month");
  const data = useMemo(() => seriesFor(period), [period]);
  return (
    <MetricLayout
      title="Product Sold"
      backTo="/farmer/analytics"
      period={period}
      onPeriodChange={setPeriod}
      metricLabel="Total Product Sold"
      metricValue={`${sold} units`}
      delta={0}
      data={data}
      chartUnit="kg"
    >
      <section className="card p-4">
        <h2 className="mb-3 text-[17px] font-bold text-ink">Best Sellers</h2>
        <div className="grid grid-cols-3 gap-3">
          {products
            .filter((p) => p.farmerId === user?.id && p.inStock)
            .slice(0, 3)
            .map((p) => (
              <ProductTile
                key={p.id}
                product={p}
                to={`/farmer/products/${p.id}`}
              />
            ))}
        </div>
      </section>
    </MetricLayout>
  );
}
