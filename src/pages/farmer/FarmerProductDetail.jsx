import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { BadgeCheck, ChevronLeft, Heart } from 'lucide-react';
import { useProducts } from '@/context/ProductContext';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/ui/Button';
import { StarRating } from '@/components/ui/Bits';
import { cx } from '@/lib/utils';
export function FarmerProductDetail() {
    const { id = '' } = useParams();
    const { byId, toggleStock, toggleFavourite, isFavourite } = useProducts();
    const { notify } = useToast();
    const navigate = useNavigate();
    const product = byId(id);
    if (!product)
        return <Navigate to="/farmer/marketplace" replace/>;
    const favourite = isFavourite(product.id);
    const topReview = product.reviews[0];
    return (<div className="mx-auto w-full max-w-3xl px-4 pb-10 lg:px-8">
      <div className="flex items-center justify-between py-3">
        <button type="button" onClick={() => navigate('/farmer/marketplace')} aria-label="Go back" className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full text-ink transition hover:bg-brand-50">
          <ChevronLeft className="h-6 w-6"/>
        </button>
        <button type="button" onClick={() => toggleFavourite(product.id)} aria-label={favourite ? 'Remove from favourites' : 'Add to favourites'} aria-pressed={favourite} className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition hover:bg-brand-50">
          <Heart className={cx('h-6 w-6', favourite && 'fill-red-500 text-red-500')}/>
        </button>
      </div>

      <img src={product.image} alt={product.name} className="mx-auto h-[230px] w-full max-w-md object-contain"/>

      <h1 className="mt-4 text-[22px] font-bold text-ink">{product.name}</h1>
      <p className="mt-1 text-[17px] font-bold text-ink">
        ₦ {product.price.toLocaleString('en-NG')} / {product.unit}
      </p>

      <section className="mt-5 border-t border-ink-line pt-4">
        <h2 className="text-[15px] font-bold text-ink">Product Details</h2>
        <p className="mt-2 max-w-prose text-[15px] leading-relaxed text-ink">
          {product.description}
        </p>
      </section>

      <div className="my-5 h-1.5 w-full rounded-full bg-ink-line/70"/>

      <section className="flex items-center justify-between border-b border-ink-line pb-4">
        <h2 className="text-[15px] font-bold text-ink">Available Quantity</h2>
        <p className="text-[15px] font-bold text-ink">
          {product.inStock ? `${product.available}${product.unit}` : 'Out of stock'}
        </p>
      </section>

      <section className="mt-4">
        <div className="flex items-start justify-between gap-4">
          <StarRating value={product.rating} size={20}/>
          <Link to={`/farmer/products/${product.id}/reviews`} className="text-[15px] font-semibold text-brand-600 hover:underline">
            See All
          </Link>
        </div>

        {topReview ? (<div className="mt-2">
            <p className="text-[15px] font-medium text-ink">{topReview.title}</p>
            <p className="mt-1 text-[15px] text-ink">{topReview.body}</p>
            <div className="mt-1.5 flex items-center justify-between gap-4">
              <p className="text-[15px] text-ink-mute">by {topReview.author}</p>
              {topReview.verified ? (<p className="flex items-center gap-1.5 text-[15px] font-medium text-brand-600">
                  <BadgeCheck className="h-[18px] w-[18px]"/>
                  Verified Purchase
                </p>) : null}
            </div>
          </div>) : (<p className="mt-2 text-[15px] text-ink-soft">No reviews yet.</p>)}
      </section>

      <div className="mt-7 space-y-3">
        <Button block onClick={() => {
            toggleStock(product.id);
            notify(product.inStock
                ? `${product.name} marked out of stock`
                : `${product.name} is back in stock`);
        }}>
          {product.inStock ? 'Mark Out of Stock' : 'Mark In Stock'}
        </Button>
        <Button variant="outline" block onClick={() => navigate(`/farmer/products/${product.id}/edit`)}>
          Edit Product
        </Button>
      </div>
    </div>);
}
