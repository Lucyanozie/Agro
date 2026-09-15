import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ORDERS, RIDER, WITHDRAWALS } from '@/data/seed';
import { KEYS, load, save } from '@/lib/storage';
import { addDays, nextOrderId, uid } from '@/lib/utils';
const initialEarnings = {
    totalEarnings: 500_000,
    withdrawn: 296_350,
    withdrawals: WITHDRAWALS,
};
const OrderContext = createContext(null);
export function OrderProvider({ children }) {
    const [orders, setOrders] = useState(() => load(KEYS.orders, ORDERS));
    const [earnings, setEarnings] = useState(() => load(KEYS.earnings, initialEarnings));
    useEffect(() => {
        save(KEYS.orders, orders);
    }, [orders]);
    useEffect(() => {
        save(KEYS.earnings, earnings);
    }, [earnings]);
    const byId = useCallback((id) => orders.find((o) => o.id === id), [orders]);
    const buyerOrders = useCallback((buyerId) => orders
        .filter((o) => o.buyerId === buyerId)
        .slice()
        .sort((a, b) => +new Date(b.placedAt) - +new Date(a.placedAt)), [orders]);
    const farmerOrders = useCallback((farmerId) => orders
        .filter((o) => o.farmerId === farmerId)
        .slice()
        .sort((a, b) => +new Date(b.placedAt) - +new Date(a.placedAt)), [orders]);
    const placeOrder = useCallback((input) => {
        const now = new Date();
        const created = {
            id: nextOrderId(orders.map((o) => o.id)),
            buyerId: input.buyerId,
            buyerName: input.buyerName,
            farmerId: 'u-musa',
            farmerName: 'Aliu, Musa',
            lines: input.lines,
            subtotal: input.subtotal,
            deliveryFee: input.deliveryFee,
            total: input.subtotal + input.deliveryFee,
            status: 'pending',
            placedAt: now.toISOString(),
            deliveryEstimate: addDays(now, 3).toISOString(),
            address: input.address,
            riderId: RIDER.id,
        };
        setOrders((list) => [created, ...list]);
        return created;
    }, [orders]);
    /** Delivering an order credits the farmer's balance, so earnings track activity. */
    const setStatus = useCallback((id, status) => {
        const order = orders.find((o) => o.id === id);
        setOrders((list) => list.map((o) => (o.id === id ? { ...o, status } : o)));
        if (order && status === 'delivered' && order.status !== 'delivered') {
            setEarnings((e) => ({ ...e, totalEarnings: e.totalEarnings + order.subtotal }));
        }
    }, [orders]);
    const markRated = useCallback((id) => {
        setOrders((list) => list.map((o) => (o.id === id ? { ...o, rated: true } : o)));
    }, []);
    const availableBalance = useMemo(() => earnings.totalEarnings - earnings.withdrawn, [earnings]);
    const withdraw = useCallback((amount, bank) => {
        const record = {
            id: uid('w'),
            amount,
            bank,
            reference: `#WS${Math.floor(100_000 + Math.random() * 899_999)}`,
            date: new Date().toISOString(),
            status: 'Processing',
        };
        setEarnings((e) => ({
            ...e,
            withdrawn: e.withdrawn + amount,
            withdrawals: [record, ...e.withdrawals],
        }));
        return record;
    }, []);
    const value = useMemo(() => ({
        orders,
        byId,
        buyerOrders,
        farmerOrders,
        placeOrder,
        setStatus,
        markRated,
        earnings,
        availableBalance,
        withdraw,
    }), [
        orders,
        byId,
        buyerOrders,
        farmerOrders,
        placeOrder,
        setStatus,
        markRated,
        earnings,
        availableBalance,
        withdraw,
    ]);
    return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}
export function useOrders() {
    const ctx = useContext(OrderContext);
    if (!ctx)
        throw new Error('useOrders must be used inside <OrderProvider>');
    return ctx;
}
