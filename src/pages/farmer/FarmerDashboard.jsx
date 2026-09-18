import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  MessageCircle,
  Plus,
  ShoppingBag,
  Sprout,
  Truck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useChats } from "@/context/ChatContext";
import { useOrders } from "@/context/OrderContext";
import { useProducts } from "@/context/ProductContext";
import { GreetingHeader, MobileBrandHeader } from "@/components/layout/Header";
import { StatCard } from "@/components/farmer/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { LinkButton } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/Bits";
import { money } from "@/lib/utils";
export function FarmerDashboard() {
  const { user } = useAuth();
  const { products } = useProducts();
  const myProducts = products.filter(
    (product) => product.farmerId === user?.id,
  );
  const { farmerOrders, earnings } = useOrders();
  const { unreadCount, conversations } = useChats();
  const [query, setQuery] = useState("");
  const orders = farmerOrders(user?.id ?? "");
  const recent = useMemo(() => orders.slice(0, 5), [orders]);
  // "Active" deliveries are anything the farmer still has to move.
  const inTransit = orders.filter(
    (o) => o.status === "in-transit" || o.status === "processing",
  ).length;
  const firstName =
    user?.name?.split(/[\s,]+/).filter(Boolean)[1] ?? user?.name ?? "";
  return (
    <>
      <MobileBrandHeader showMenu />
      <GreetingHeader
        name={firstName}
        subtitle="Let's make today a good harvest."
        accountHref="/farmer/profile"
        search={{ value: query, onChange: setQuery }}
      />

      <div className="px-4 pb-10 lg:px-8">
        {/* Farm summary banner */}
        <section className="mt-3 flex flex-col gap-3 overflow-hidden rounded-xl border border-brand-100 bg-brand-50/80 p-4 sm:flex-row sm:items-center sm:justify-between lg:p-5">
          <div className="flex items-center gap-4">
            <img
              src="/img/farm-aerial.jpg"
              alt=""
              className="hidden h-16 w-24 shrink-0 rounded-lg object-cover sm:block lg:hidden"
            />
            <div>
              <h2 className="text-[22px] font-bold text-brand-600">
                {user?.farmName ?? ""}
              </h2>
              <p className="mt-0.5 text-[15px] text-ink-soft">
                {[user?.farmSize, user?.location].filter(Boolean).join(" · ")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <img
              src="/img/farm-aerial.jpg"
              alt=""
              className="hidden h-14 w-20 shrink-0 rounded-lg object-cover lg:block"
            />
            <LinkButton
              to="/farmer/products/new"
              size="md"
              className="shrink-0"
            >
              <Plus className="h-5 w-5" />
              New listing
            </LinkButton>
          </div>
        </section>

        <div className="mt-4 lg:hidden">
          <SearchInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search product"
          />
        </div>

        {/* Overview */}
        <section className="mt-6">
          <h2 className="mb-3 text-[17px] font-bold text-ink">Farm Overview</h2>
          <div className="grid grid-cols-3 gap-3 lg:grid-cols-5">
            <StatCard
              icon={<Sprout className="h-6 w-6" />}
              value={myProducts.length}
              label="Products"
              to="/farmer/marketplace"
            />
            <StatCard
              icon={<NairaIcon />}
              value={money(earnings.totalEarnings - earnings.withdrawn)}
              label="Earnings"
              tone="blue"
              to="/farmer/earnings"
            />
            <StatCard
              icon={<ShoppingBag className="h-6 w-6" />}
              value={orders.length}
              label="Orders"
              tone="amber"
              to="/farmer/orders"
            />
            <StatCard
              icon={<MessageCircle className="h-6 w-6" />}
              value={`${unreadCount} new`}
              label="Chats"
              tone="blue"
              to="/farmer/chats"
              className="col-span-1"
            />
            <StatCard
              icon={<Truck className="h-6 w-6" />}
              value={`${inTransit} active`}
              label="Track Delivery"
              tone="blue"
              to="/farmer/orders"
              className="col-span-2 lg:col-span-1"
            />
          </div>
        </section>

        {/* Recent orders */}
        <section className="mt-7">
          <div className="mb-3 flex items-center justify-between gap-4">
            <h2 className="text-[17px] font-bold text-ink">Recent Orders</h2>
            <Link
              to="/farmer/chats"
              className="flex items-center gap-2 text-[15px] font-bold text-brand-600 hover:underline"
            >
              Message buyer
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-xl border border-ink-line lg:block">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[15px] text-ink-soft">
                  <th className="px-5 py-3 font-medium">Product</th>
                  <th className="px-5 py-3 font-medium">Buyer</th>
                  <th className="px-5 py-3 font-medium">Order</th>
                  <th className="px-5 py-3 text-right font-medium">Amount</th>
                  <th className="px-5 py-3 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-line">
                {recent.map((order) => (
                  <tr
                    key={order.id}
                    className="transition hover:bg-brand-50/40"
                  >
                    <td className="px-5 py-3">
                      <img
                        src={order.lines[0]?.image}
                        alt={order.lines[0]?.name ?? ""}
                        className="h-14 w-16 rounded object-contain"
                      />
                    </td>
                    <td className="px-5 py-3 text-[15px] text-ink">
                      {order.buyerName}
                    </td>
                    <td className="px-5 py-3 text-[15px] text-ink">
                      #{order.id}
                    </td>
                    <td className="px-5 py-3 text-right text-[15px] font-bold text-ink">
                      {money(order.total)}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link to={`/farmer/orders/${order.id}`}>
                        <StatusBadge status={order.status} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile list */}
          <ul className="space-y-2 lg:hidden">
            {recent.map((order) => (
              <li key={order.id}>
                <Link
                  to={`/farmer/orders/${order.id}`}
                  className="flex items-center gap-3 rounded-lg border border-ink-line px-3 py-2.5"
                >
                  <img
                    src={order.lines[0]?.image}
                    alt=""
                    className="h-12 w-14 shrink-0 rounded object-contain"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-bold text-ink">
                      {order.lines[0]?.name}{" "}
                      <span className="font-normal text-ink-soft">
                        ({order.lines[0]?.qty} Kg)
                      </span>
                    </p>
                    <p className="truncate text-sm text-ink-mute">
                      Order #{order.id}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[15px] font-bold text-ink">
                      {money(order.total)}
                    </p>
                    <p className="text-sm font-semibold text-brand-600">
                      {order.status === "processing" ? "Confirmed" : ""}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-4 lg:hidden">
            <LinkButton to="/farmer/orders" variant="outline" block size="md">
              View all orders
            </LinkButton>
          </div>
        </section>
      </div>
    </>
  );
}
function NairaIcon() {
  return (
    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2F5FD0] text-[13px] font-bold text-white">
      ₦
    </span>
  );
}
