import { Navigate, useParams } from 'react-router-dom';
import { BadgeCheck, MessageSquareQuote } from 'lucide-react';
import { useProducts } from '@/context/ProductContext';
import { PageHeader } from '@/components/layout/Header';
import { EmptyState, StarRating } from '@/components/ui/Bits';
import { longDate } from '@/lib/utils';
export function ReviewsPage({ role }) {
    const { id = '' } = useParams();
    const { byId } = useProducts();
    const product = byId(id);
    const base = role === 'farmer' ? '/farmer/products' : '/buyer/product';
    if (!product)
        return <Navigate to={role === 'farmer' ? '/farmer/marketplace' : '/buyer'} replace/>;
    return (<>
      <PageHeader title="Reviews" backTo={`${base}/${product.id}`}/>

      <div className="mx-auto w-full max-w-2xl px-4 pb-12 lg:px-8">
        <div className="flex items-center gap-4">
          <img src={product.image} alt="" className="h-16 w-20 shrink-0 object-contain"/>
          <div>
            <h2 className="text-[17px] font-bold text-ink">{product.name}</h2>
            <div className="mt-1 flex items-center gap-2">
              <StarRating value={product.rating} size={16}/>
              <span className="text-[15px] text-ink-soft">
                {product.rating.toFixed(1)} · {product.reviews.length} review
                {product.reviews.length === 1 ? '' : 's'}
              </span>
            </div>
          </div>
        </div>

        {product.reviews.length ? (<ul className="mt-6 divide-y divide-ink-line">
            {product.reviews.map((review) => (<li key={review.id} className="py-4">
                <div className="flex items-center justify-between gap-4">
                  <StarRating value={review.rating} size={16}/>
                  <span className="text-[15px] text-ink-mute">{longDate(review.date)}</span>
                </div>
                <p className="mt-2 text-[15px] font-medium text-ink">{review.title}</p>
                <p className="mt-1 text-[15px] text-ink">{review.body}</p>
                <div className="mt-2 flex items-center justify-between gap-4">
                  <p className="text-[15px] text-ink-mute">by {review.author}</p>
                  {review.verified ? (<p className="flex items-center gap-1.5 text-[15px] font-medium text-brand-600">
                      <BadgeCheck className="h-[18px] w-[18px]"/>
                      Verified Purchase
                    </p>) : null}
                </div>
              </li>))}
          </ul>) : (<div className="mt-8">
            <EmptyState icon={<MessageSquareQuote className="h-7 w-7"/>} title="No reviews yet" description="Reviews appear here once buyers rate this produce."/>
          </div>)}
      </div>
    </>);
}
