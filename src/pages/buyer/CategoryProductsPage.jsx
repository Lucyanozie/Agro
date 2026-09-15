import { useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { PackageSearch } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useProducts } from '@/context/ProductContext';
import { useToast } from '@/context/ToastContext';
import { PageHeader } from '@/components/layout/Header';
import { ProductRow } from '@/components/marketplace/ProductCard';
import { EmptyState, SearchInput } from '@/components/ui/Bits';
import { CATEGORIES } from '@/data/seed';
import { cx } from '@/lib/utils';
export function CategoryProductsPage() {
    const { slug = '' } = useParams();
    const { byCategory, search } = useProducts();
    const { add, has } = useCart();
    const { notify } = useToast();
    const [query, setQuery] = useState('');
    const category = CATEGORIES.find((c) => c.slug === slug);
    const products = useMemo(() => query.trim()
        ? search(query, slug)
        : byCategory(slug), [query, search, byCategory, slug]);
    if (!category)
        return <Navigate to="/buyer" replace/>;
    return (<>
      <PageHeader title={category.name} backTo="/buyer"/>

      <div className="pb-10">
        <div className="px-4 lg:px-8">
          <SearchInput value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search product..." wrapClassName="lg:max-w-lg"/>

          <nav aria-label="Categories" className="no-scrollbar -mx-4 mt-4 flex gap-2.5 overflow-x-auto px-4 lg:mx-0 lg:px-0">
            {CATEGORIES.map((c) => (<Link key={c.slug} to={`/buyer/category/${c.slug}`} aria-current={c.slug === slug ? 'page' : undefined} className={cx('shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition', c.slug === slug
                ? 'border-brand-600 bg-brand-600 text-white'
                : 'border-ink-line bg-white text-ink hover:border-brand-300 hover:bg-brand-50')}>
                {c.name}
              </Link>))}
          </nav>
        </div>

        {products.length ? (<div className="mt-4 lg:grid lg:grid-cols-2 lg:gap-3 lg:px-8 xl:grid-cols-3">
            {products.map((product) => (<ProductRow key={product.id} product={product} to={`/buyer/product/${product.id}`} added={has(product.id)} onAdd={() => {
                    add(product);
                    notify(`${product.name} added to cart`);
                }}/>))}
          </div>) : (<div className="mt-8 px-4 lg:px-8">
            <EmptyState icon={<PackageSearch className="h-7 w-7"/>} title="Nothing here yet" description={`No ${category.name.toLowerCase()} match that search.`}/>
          </div>)}
      </div>
    </>);
}
