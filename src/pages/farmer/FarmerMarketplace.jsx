import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PackageSearch } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useProducts } from "@/context/ProductContext";
import { useToast } from "@/context/ToastContext";
import { FarmerProductCard } from "@/components/marketplace/ProductCard";
import { EmptyState, Pill, SearchInput } from "@/components/ui/Bits";
import { Button, LinkButton } from "@/components/ui/Button";
import { PageHeader } from "@/components/layout/Header";
import { Modal } from "@/components/ui/Modal";
const FILTERS = [
  { label: "All", value: "all" },
  { label: "Vegetables", value: "vegetables" },
  { label: "Fruits", value: "fruits" },
  { label: "Grains", value: "grains" },
  { label: "Tuber", value: "roots" },
];
export function FarmerMarketplace() {
  const { user } = useAuth();
  const { search, toggleStock, removeProduct, products } = useProducts();
  const { notify } = useToast();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [productToDelete, setProductToDelete] = useState(null);
  const results = useMemo(
    () =>
      search(query, filter).filter((product) => product.farmerId === user?.id),
    [search, query, filter, user?.id],
  );
  function confirmDelete() {
    if (!productToDelete) return;
    removeProduct(productToDelete.id);
    notify(`${productToDelete.name} deleted`);
    setProductToDelete(null);
  }
  return (
    <>
      <div className="hidden px-8 pb-2 pt-6 lg:block">
        <h1 className="text-[22px] font-bold text-ink">Marketplace</h1>
        <p className="mt-0.5 text-[15px] text-ink-soft">
          Farm-gate prices, delivered directly to you.
        </p>
      </div>
      <div className="lg:hidden">
        <PageHeader title="Marketplace" backTo="/farmer" />
      </div>

      <div className="px-4 pb-10 lg:px-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <SearchInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search product"
            wrapClassName="lg:max-w-[640px]"
          />
          <div className="no-scrollbar -mx-4 flex gap-2.5 overflow-x-auto px-4 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0">
            {FILTERS.map((f) => (
              <Pill
                key={f.value}
                active={filter === f.value}
                onClick={() => setFilter(f.value)}
              >
                {f.label}
              </Pill>
            ))}
          </div>
        </div>

        {results.length ? (
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((product) => (
              <FarmerProductCard
                key={product.id}
                product={product}
                to={`/farmer/products/${product.id}`}
                onToggleStock={() => {
                  toggleStock(product.id);
                  notify(
                    product.inStock
                      ? `${product.name} marked out of stock`
                      : `${product.name} is back in stock`,
                  );
                }}
                onEdit={() => navigate(`/farmer/products/${product.id}/edit`)}
                onDelete={() => setProductToDelete(product)}
              />
            ))}
          </div>
        ) : (
          <div className="mt-8">
            <EmptyState
              icon={<PackageSearch className="h-7 w-7" />}
              title="No products match that search"
              description={
                products.some((product) => product.farmerId === user?.id)
                  ? "Try a different name or clear the category filter."
                  : "Add your first listing to start selling."
              }
              action={
                <LinkButton to="/farmer/products/new">Add a product</LinkButton>
              }
            />
          </div>
        )}
      </div>
      <Modal
        open={Boolean(productToDelete)}
        onClose={() => setProductToDelete(null)}
        title="Delete product?"
        footer={
          <>
            <Button
              variant="outline"
              size="md"
              onClick={() => setProductToDelete(null)}
              className="flex-1"
            >
              Cancel
            </Button>
            <button
              type="button"
              onClick={confirmDelete}
              className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-red-600 px-5 text-[15px] font-semibold text-white transition hover:bg-red-700"
            >
              Delete
            </button>
          </>
        }
      >
        This will remove{" "}
        <strong className="text-ink">{productToDelete?.name}</strong> from your
        marketplace.
      </Modal>
    </>
  );
}
