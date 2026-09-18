import { Minus, Plus } from 'lucide-react';
import { money } from '@/lib/utils';


export function CartItem({ product, qty, onIncrement, onDecrement, onRemove, }) {
    return (<li className="border-b border-ink-line py-5">
      <div className="flex items-center gap-4">
        <img src={product.image} alt={product.name} className="h-[70px] w-[92px] shrink-0 rounded-lg object-contain"/>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[17px] font-bold text-ink">{product.name}</p>
          <p className="mt-0.5 text-[15px] text-ink-soft">
            {money(product.price)} / {product.unit}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <button type="button" onClick={onDecrement} aria-label={`Reduce ${product.name} quantity`} className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-white transition hover:bg-brand-600 active:scale-95">
            <Minus className="h-4 w-4"/>
          </button>
          <span className="min-w-[1.25rem] text-center text-xl font-bold text-ink" aria-live="polite">
            {qty}
          </span>
          <button type="button" onClick={onIncrement} aria-label={`Increase ${product.name} quantity`} className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-white transition hover:bg-brand-600 active:scale-95">
            <Plus className="h-4 w-4"/>
          </button>
        </div>

        <p className="hidden w-28 shrink-0 text-right text-xl font-bold text-ink sm:block">
          {money(product.price * qty)}
        </p>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <button type="button" onClick={onRemove} className="text-[17px] font-bold text-brand-600 transition hover:text-brand-700 hover:underline">
          Remove
        </button>
        <p className="text-lg font-bold text-ink sm:hidden">{money(product.price * qty)}</p>
      </div>
    </li>);
}
