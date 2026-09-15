import { useLocation, useNavigate } from 'react-router-dom';
import { useProducts } from '@/context/ProductContext';
import { Button } from '@/components/ui/Button';
import { SuccessScreen } from '@/components/ui/SuccessMark';
import { money } from '@/lib/utils';
export function PublishedPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { byId } = useProducts();
    const productId = location.state?.productId;
    const product = productId ? byId(productId) : undefined;
    return (<SuccessScreen title="Published" actions={<div className="space-y-3">
          <Button block onClick={() => navigate('/farmer/marketplace', { replace: true })}>
            Continue
          </Button>
          {product ? (<Button variant="ghost" block onClick={() => navigate(`/farmer/products/${product.id}`, { replace: true })}>
              View listing
            </Button>) : null}
        </div>}>
      {product ? (<div className="mx-auto flex max-w-xs items-center gap-4 rounded-xl border border-ink-line p-3 text-left">
          <img src={product.image} alt="" className="h-16 w-20 shrink-0 rounded-lg object-contain"/>
          <div className="min-w-0">
            <p className="truncate text-[15px] font-bold text-ink">{product.name}</p>
            <p className="text-sm text-ink-soft">
              {money(product.price)} / {product.unit} · {product.available} {product.unit} available
            </p>
          </div>
        </div>) : null}
    </SuccessScreen>);
}
