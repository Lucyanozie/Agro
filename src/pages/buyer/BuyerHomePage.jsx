import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Camera } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useProducts } from '@/context/ProductContext';
import { useToast } from '@/context/ToastContext';
import { GreetingHeader, MobileBrandHeader } from '@/components/layout/Header';
import { CategoryCard } from '@/components/marketplace/CategoryCard';
import { ProductRow, ProductTile } from '@/components/marketplace/ProductCard';
import { SearchInput } from '@/components/ui/Bits';
import { CATEGORIES } from '@/data/seed';
export function BuyerHomePage() {
    const { user } = useAuth();
    const { bestSellers, search } = useProducts();
    const { notify } = useToast();
    const [query, setQuery] = useState('');
    const firstName = user?.name.split(' ')[0] ?? 'Sarah';
    const results = useMemo(() => (query.trim() ? search(query) : []), [query, search]);
    return (<>
      <MobileBrandHeader />
      <GreetingHeader name={firstName} subtitle="What would you like today?" accountHref="/buyer/account"/>

      <div className="px-4 pb-10 lg:px-8">
        {/* Featured banner — desktop only, matching the design */}
        <Link to="/buyer/category/grains" className="mt-4 hidden overflow-hidden rounded-xl lg:block">
          <img src="/img/banner-fertilizer.jpg" alt="Featured: Nourish your soil, grow better — shop organic fertilizer" className="h-auto w-full object-cover"/>
        </Link>

        {/* Search */}
        <div className="mt-4 flex items-center gap-3">
          <SearchInput value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search for products" wrapClassName="flex-1"/>
          <button type="button" onClick={() => notify('Visual search is coming soon')} aria-label="Search by photo" className="flex h-[46px] w-[52px] shrink-0 items-center justify-center rounded-xl border border-ink-line text-ink transition hover:border-brand-300 hover:text-brand-600">
            <Camera className="h-5 w-5"/>
          </button>
        </div>

        {query.trim() ? (<section className="mt-5">
            <h2 className="mb-2 text-xl font-bold text-brand-600">
              {results.length} result{results.length === 1 ? '' : 's'} for “{query.trim()}”
            </h2>
            <div className="-mx-4 lg:mx-0 lg:grid lg:grid-cols-2 lg:gap-3">
              {results.map((p) => (<ProductRow key={p.id} product={p} to={`/buyer/product/${p.id}`}/>))}
            </div>
          </section>) : (<>
            {/* Categories */}
            <section className="mt-6">
              <div className="mb-3 flex items-end justify-between gap-4">
                <h2 className="text-xl font-bold text-brand-600">Categories</h2>
                <Link to="/buyer/category/vegetables" className="flex items-center gap-1 text-[15px] font-semibold text-brand-600 hover:underline">
                  See all
                  <ArrowRight className="h-4 w-4"/>
                </Link>
              </div>
              <div className="grid grid-cols-4 gap-x-3 gap-y-5 sm:grid-cols-5 lg:grid-cols-7">
                {CATEGORIES.map((c) => (<CategoryCard key={c.slug} category={c}/>))}
              </div>
            </section>

            {/* Best sellers */}
            <section className="mt-8">
              <h2 className="mb-3 text-xl font-bold text-brand-600">Best Sellers</h2>
              <div className="rounded-xl border border-ink-line p-3 lg:border-0 lg:p-0">
                <div className="grid grid-cols-3 gap-3 lg:grid-cols-4 lg:gap-4">
                  {bestSellers.map((p) => (<ProductTile key={p.id} product={p} to={`/buyer/product/${p.id}`}/>))}
                </div>
              </div>
            </section>
          </>)}
      </div>
    </>);
}
