import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { PRODUCTS } from '@/data/seed';
import { KEYS, load, save } from '@/lib/storage';
import { uid } from '@/lib/utils';
const ProductContext = createContext(null);
export function ProductProvider({ children }) {
    const [products, setProducts] = useState(() => load(KEYS.products, PRODUCTS));
    const [favourites, setFavourites] = useState(() => load(KEYS.favourites, ['p-tomato', 'p-potato', 'p-bell-pepper', 'p-carrot']));
    useEffect(() => {
        save(KEYS.products, products);
    }, [products]);
    useEffect(() => {
        save(KEYS.favourites, favourites);
    }, [favourites]);
    const byId = useCallback((id) => products.find((p) => p.id === id), [products]);
    const byCategory = useCallback((slug) => products.filter((p) => p.category === slug), [products]);
    const search = useCallback((query, category = 'all') => {
        const q = query.trim().toLowerCase();
        return products.filter((p) => {
            const matchesCategory = category === 'all' || p.category === category;
            const matchesQuery = !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
            return matchesCategory && matchesQuery;
        });
    }, [products]);
    const bestSellers = useMemo(() => products.filter((p) => p.inStock).slice(0, 4), [products]);
    const addProduct = useCallback((input) => {
        const product = {
            ...input,
            id: uid('p'),
            farmerId: 'u-musa',
            farmName: 'Musa Field Farm',
            location: 'Kaduna',
            inStock: true,
            rating: 0,
            reviews: [],
            createdAt: new Date().toISOString(),
        };
        setProducts((list) => [product, ...list]);
        return product;
    }, []);
    const updateProduct = useCallback((id, patch) => {
        setProducts((list) => list.map((p) => (p.id === id ? { ...p, ...patch } : p)));
    }, []);
    const toggleStock = useCallback((id) => {
        setProducts((list) => list.map((p) => (p.id === id ? { ...p, inStock: !p.inStock } : p)));
    }, []);
    const removeProduct = useCallback((id) => {
        setProducts((list) => list.filter((p) => p.id !== id));
    }, []);
    const addReview = useCallback((productId, review) => {
        setProducts((list) => list.map((p) => {
            if (p.id !== productId)
                return p;
            const reviews = [
                { ...review, id: uid('r'), date: new Date().toISOString() },
                ...p.reviews,
            ];
            const rating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
            return { ...p, reviews, rating: Math.round(rating * 10) / 10 };
        }));
    }, []);
    const toggleFavourite = useCallback((id) => {
        setFavourites((list) => (list.includes(id) ? list.filter((f) => f !== id) : [...list, id]));
    }, []);
    const isFavourite = useCallback((id) => favourites.includes(id), [favourites]);
    const value = useMemo(() => ({
        products,
        favourites,
        byId,
        byCategory,
        search,
        bestSellers,
        addProduct,
        updateProduct,
        toggleStock,
        removeProduct,
        addReview,
        toggleFavourite,
        isFavourite,
    }), [
        products,
        favourites,
        byId,
        byCategory,
        search,
        bestSellers,
        addProduct,
        updateProduct,
        toggleStock,
        removeProduct,
        addReview,
        toggleFavourite,
        isFavourite,
    ]);
    return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}
export function useProducts() {
    const ctx = useContext(ProductContext);
    if (!ctx)
        throw new Error('useProducts must be used inside <ProductProvider>');
    return ctx;
}
