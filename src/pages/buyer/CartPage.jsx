import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useOrders } from "@/context/OrderContext";
import { useProducts } from "@/context/ProductContext";
import { useToast } from "@/context/ToastContext";
import { PageHeader } from "@/components/layout/Header";
import { CartItem } from "@/components/cart/CartItem";
import { ProductTile } from "@/components/marketplace/ProductCard";
import { Button, LinkButton } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/Bits";
import { money } from "@/lib/utils";
export function CartPage() {
  const { user } = useAuth();
  const { lines, increment, decrement, remove, clear, totals } = useCart();
  const { byId, favourites } = useProducts();
  const { placeOrder } = useOrders();
  const { notify } = useToast();
  const navigate = useNavigate();
  const { items, subtotal, deliveryFee, total } = totals(byId);
  const favouriteProducts = favourites.map(byId).filter(Boolean).slice(0, 4);
  function checkout() {
    const orderLines = lines
      .map((l) => {
        const product = byId(l.productId);
        if (!product) return null;
        return {
          productId: product.id,
          name: product.name,
          image: product.image,
          price: product.price,
          unit: product.unit,
          qty: l.qty,
          farmerId: product.farmerId,
          farmerName: product.farmName,
        };
      })
      .filter((l) => Boolean(l));
    if (!orderLines.length) return;
    const order = placeOrder({
      buyerId: user?.id ?? "",
      buyerName: user?.name ?? "",
      farmerId: orderLines[0]?.farmerId,
      farmerName: orderLines[0]?.farmerName,
      lines: orderLines,
      subtotal,
      deliveryFee,
      address: user?.location ?? "",
    });
    clear();
    notify("Order placed successfully");
    navigate(`/buyer/order-placed/${order.id}`, { replace: true });
  }
  return (
    <>
      <div className="lg:hidden">
        <PageHeader title="My Cart" backTo="/buyer" />
      </div>
      <div className="hidden px-8 pt-8 lg:block">
        <h1 className="text-center text-3xl font-bold text-brand-600">
          My Cart
        </h1>
      </div>

      <div className="px-4 pb-10 lg:px-8">
        {lines.length ? (
          <div className="lg:flex lg:items-start lg:gap-8">
            <ul className="min-w-0 flex-1">
              {lines.map((line) => {
                const product = byId(line.productId);
                if (!product) return null;
                return (
                  <CartItem
                    key={line.productId}
                    product={product}
                    qty={line.qty}
                    onIncrement={() => increment(line.productId)}
                    onDecrement={() => decrement(line.productId)}
                    onRemove={() => {
                      remove(line.productId);
                      notify(`${product.name} removed from cart`);
                    }}
                  />
                );
              })}
            </ul>

            <aside className="mt-6 w-full shrink-0 lg:mt-0 lg:w-[330px]">
              <div className="overflow-hidden rounded-lg border border-ink-line">
                <h2 className="border-b border-ink-line px-4 py-3 text-[17px] font-medium tracking-wide text-ink">
                  CART SUMMARY
                </h2>
                <dl className="divide-y divide-ink-line">
                  <div className="flex items-center justify-between bg-brand-50/40 px-4 py-3">
                    <dt className="text-[17px] text-ink-mute">
                      Total Item ( {items} )
                    </dt>
                    <dd className="text-[17px] text-ink-mute">
                      {money(subtotal)}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3">
                    <dt className="text-[17px] text-ink">Delivery Fee</dt>
                    <dd className="text-[17px] font-bold text-ink">
                      {money(deliveryFee)}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3">
                    <dt className="text-[17px] font-bold text-ink">Subtotal</dt>
                    <dd className="text-[17px] font-bold text-ink">
                      {money(total)}
                    </dd>
                  </div>
                </dl>
                <div className="px-4 py-4">
                  <Button block size="md" onClick={checkout}>
                    Checkout
                  </Button>
                </div>
              </div>
            </aside>
          </div>
        ) : (
          <div className="mt-6">
            <EmptyState
              icon={<ShoppingCart className="h-7 w-7" />}
              title="Your cart is empty"
              description="Browse the marketplace and add some fresh produce."
              action={<LinkButton to="/buyer">Start shopping</LinkButton>}
            />
          </div>
        )}

        {favouriteProducts.length ? (
          <section className="mt-10">
            <h2 className="mb-3 text-2xl font-bold text-brand-300">
              Favourite
            </h2>
            <div className="grid grid-cols-3 gap-3 lg:grid-cols-4 lg:gap-4">
              {favouriteProducts.map((p) => (
                <ProductTile
                  key={p.id}
                  product={p}
                  to={`/buyer/product/${p.id}`}
                />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </>
  );
}
