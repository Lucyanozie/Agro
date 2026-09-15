import { Link } from 'react-router-dom';
import { MapPin, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CATEGORIES } from '@/data/seed';
import { cx, money } from '@/lib/utils';
function categoryName(slug) {
    return CATEGORIES.find((c) => c.slug === slug)?.name ?? slug;
}
/** Buyer-facing tile: image over name and price. Used for Best Sellers / Favourites. */
export function ProductTile({ product, to }) {
    return (<Link to={to} className="group flex flex-col overflow-hidden rounded-xl border border-ink-line bg-white p-3 text-center transition hover:border-brand-300 hover:shadow-card">
      <div className="mb-2 aspect-square w-full overflow-hidden rounded-lg bg-white">
        <img src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-contain transition duration-300 group-hover:scale-[1.04]"/>
      </div>
      <p className="truncate text-[15px] font-bold text-ink">{product.name}</p>
      <p className="mt-0.5 text-sm text-ink-soft">
        {money(product.price)} / {product.unit}
      </p>
    </Link>);
}
/** Buyer-facing list row with a quick-add control. */
export function ProductRow({ product, to, onAdd, added, }) {
    return (<div className="flex items-center gap-4 border-b border-ink-line bg-white px-4 py-4 transition hover:bg-brand-50/40 lg:rounded-xl lg:border lg:px-5">
      <Link to={to} className="shrink-0">
        <img src={product.image} alt={product.name} loading="lazy" className="h-[86px] w-[104px] rounded-lg object-contain"/>
      </Link>
      <Link to={to} className="min-w-0 flex-1">
        <p className="truncate text-[17px] font-bold text-ink">{product.name}</p>
        <p className="mt-1 text-[15px] font-medium text-ink">
          {money(product.price)} / {product.unit}
        </p>
        <p className="mt-0.5 text-[15px] text-ink-mute">
          {product.inStock ? `Available ${product.available} ${product.unit}` : 'Out of stock'}
        </p>
      </Link>
      {onAdd ? (<button type="button" onClick={onAdd} disabled={!product.inStock} aria-label={`Add ${product.name} to cart`} className={cx('flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white transition', product.inStock
                ? added
                    ? 'bg-brand-700'
                    : 'bg-brand-600 hover:bg-brand-700 active:scale-95'
                : 'cursor-not-allowed bg-ink-line')}>
          <Plus className="h-5 w-5"/>
        </button>) : null}
    </div>);
}
/** Farmer marketplace card with stock and edit actions. */
export function FarmerProductCard({ product, onToggleStock, onEdit, to, }) {
    return (<article className="flex flex-col overflow-hidden rounded-xl border border-ink-line bg-white transition hover:shadow-card">
      <Link to={to} className="block px-4 pt-3">
        <p className="text-sm font-medium text-brand-600">{categoryName(product.category)}</p>
        <div className="mt-1 aspect-[4/3] w-full overflow-hidden">
          <img src={product.image} alt={product.name} loading="lazy" className={cx('h-full w-full object-contain', !product.inStock && 'opacity-45 grayscale')}/>
        </div>
      </Link>

      <div className="flex flex-1 flex-col px-4 pb-4">
        <div className="flex items-baseline justify-between gap-3">
          <Link to={to} className="truncate text-[15px] font-bold text-ink hover:underline">
            {product.name}
          </Link>
          <p className="shrink-0 text-[15px] font-bold text-brand-600">
            {money(product.price)}
            <span className="text-ink-soft">/{product.unit}</span>
          </p>
        </div>
        <p className="mt-1 text-sm text-ink-soft">
          {product.inStock ? `Available ${product.available} ${product.unit}` : 'Out of stock'}
        </p>
        <p className="mt-1 flex items-center gap-1 text-sm text-ink-soft">
          <MapPin className="h-4 w-4 shrink-0 text-ink-mute"/>
          <span className="truncate">
            {product.farmName} · {product.location}
          </span>
        </p>

        <div className="mt-4 flex flex-col gap-2">
          <Button size="sm" onClick={onToggleStock} className="h-10">
            {product.inStock ? 'Mark Out of Stock' : 'Mark In Stock'}
          </Button>
          <Button size="sm" variant="outline" onClick={onEdit} className="h-10">
            Edit Product
          </Button>
        </div>
      </div>
    </article>);
}
