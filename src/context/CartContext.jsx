import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { KEYS, load, save } from '@/lib/storage';
export const DELIVERY_FEE = 1500;
const CartContext = createContext(null);
const seedCart = [
    { productId: 'p-carrot', qty: 2 },
    { productId: 'p-red-grapes', qty: 3 },
];
export function CartProvider({ children }) {
    const [lines, setLines] = useState(() => load(KEYS.cart, seedCart));
    useEffect(() => {
        save(KEYS.cart, lines);
    }, [lines]);
    const add = useCallback((product, qty = 1) => {
        setLines((list) => {
            const existing = list.find((l) => l.productId === product.id);
            if (existing) {
                return list.map((l) => (l.productId === product.id ? { ...l, qty: l.qty + qty } : l));
            }
            return [...list, { productId: product.id, qty }];
        });
    }, []);
    const setQty = useCallback((productId, qty) => {
        setLines((list) => qty <= 0
            ? list.filter((l) => l.productId !== productId)
            : list.map((l) => (l.productId === productId ? { ...l, qty } : l)));
    }, []);
    const increment = useCallback((productId) => setLines((list) => list.map((l) => (l.productId === productId ? { ...l, qty: l.qty + 1 } : l))), []);
    const decrement = useCallback((productId) => setLines((list) => list
        .map((l) => (l.productId === productId ? { ...l, qty: l.qty - 1 } : l))
        .filter((l) => l.qty > 0)), []);
    const remove = useCallback((productId) => setLines((list) => list.filter((l) => l.productId !== productId)), []);
    const clear = useCallback(() => setLines([]), []);
    const has = useCallback((productId) => lines.some((l) => l.productId === productId), [lines]);
    const qtyOf = useCallback((productId) => lines.find((l) => l.productId === productId)?.qty ?? 0, [lines]);
    const count = useMemo(() => lines.length, [lines]);
    const totals = useCallback((resolve) => {
        const subtotal = lines.reduce((sum, l) => {
            const p = resolve(l.productId);
            return p ? sum + p.price * l.qty : sum;
        }, 0);
        const deliveryFee = lines.length ? DELIVERY_FEE : 0;
        return { items: lines.length, subtotal, deliveryFee, total: subtotal + deliveryFee };
    }, [lines]);
    const value = useMemo(() => ({ lines, count, add, setQty, increment, decrement, remove, clear, has, qtyOf, totals }), [lines, count, add, setQty, increment, decrement, remove, clear, has, qtyOf, totals]);
    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx)
        throw new Error('useCart must be used inside <CartProvider>');
    return ctx;
}
