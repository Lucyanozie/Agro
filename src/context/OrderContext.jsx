import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { addDays, uid } from "@/lib/utils";
import { useAuth } from "./AuthContext";

const initialEarnings = { totalEarnings: 0, withdrawn: 0, withdrawals: [] };
const OrderContext = createContext(null);
function sortOrders(list) {
  return list
    .slice()
    .sort((a, b) => +new Date(b.placedAt) - +new Date(a.placedAt));
}

export function OrderProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [orders, setOrders] = useState([]);
  const [earnings, setEarnings] = useState(initialEarnings);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setOrders([]);
    setEarnings(initialEarnings);
    setError("");
    if (!userId) return undefined;
    async function loadData() {
      try {
        const orderQueries = [
          query(collection(db, "orders"), where("buyerId", "==", userId)),
        ];
        if (user.role === "farmer")
          orderQueries.push(
            query(
              collection(db, "orders"),
              where("farmerIds", "array-contains", userId),
            ),
          );
        const snapshots = await Promise.all(
          orderQueries.map((item) => getDocs(item)),
        );
        const unique = new Map();
        snapshots.forEach((snapshot) =>
          snapshot.docs.forEach((item) =>
            unique.set(item.id, { id: item.id, ...item.data() }),
          ),
        );
        const earningsSnapshot =
          user.role === "farmer"
            ? await getDoc(doc(db, "users", userId, "earnings", "summary"))
            : null;
        if (cancelled) return;
        setOrders(sortOrders([...unique.values()]));
        setEarnings(
          earningsSnapshot?.exists()
            ? { ...initialEarnings, ...earningsSnapshot.data() }
            : initialEarnings,
        );
      } catch {
        if (!cancelled) {
          setOrders([]);
          setEarnings(initialEarnings);
          setError("Unable to load your orders.");
        }
      }
    }
    loadData();
    return () => {
      cancelled = true;
    };
  }, [userId, user?.role]);

  const byId = useCallback(
    (id) => orders.find((order) => order.id === id),
    [orders],
  );
  const buyerOrders = useCallback(
    (buyerId) =>
      sortOrders(orders.filter((order) => order.buyerId === buyerId)),
    [orders],
  );
  const farmerOrders = useCallback(
    (farmerId) =>
      sortOrders(
        orders.filter((order) =>
          (order.farmerIds ?? [order.farmerId]).includes(farmerId),
        ),
      ),
    [orders],
  );

  const placeOrder = useCallback(
    (input) => {
      if (!userId) return null;
      const now = new Date();
      const farmerIds = [
        ...new Set(input.lines.map((line) => line.farmerId).filter(Boolean)),
      ];
      const data = {
        buyerId: userId,
        buyerName: input.buyerName,
        farmerId: farmerIds[0] ?? "",
        farmerIds,
        farmerName: input.farmerName ?? input.lines[0]?.farmerName ?? "",
        lines: input.lines,
        subtotal: input.subtotal,
        deliveryFee: input.deliveryFee,
        total: input.subtotal + input.deliveryFee,
        status: "pending",
        placedAt: now.toISOString(),
        createdAt: now.toISOString(),
        deliveryEstimate: addDays(now, 3).toISOString(),
        address: input.address,
        riderId: input.riderId ?? "",
      };
      const ref = doc(collection(db, "orders"));
      const order = { id: ref.id, ...data };
      setOrders((list) => [order, ...list]);
      setDoc(ref, data).catch(() => {
        setOrders((list) => list.filter((item) => item.id !== order.id));
        setError("Unable to place order.");
      });
      return order;
    },
    [userId],
  );

  const setStatus = useCallback(
    (id, status) => {
      const order = orders.find((item) => item.id === id);
      if (!order) return;
      setOrders((list) =>
        list.map((item) => (item.id === id ? { ...item, status } : item)),
      );
      updateDoc(doc(db, "orders", id), { status }).catch(() =>
        setError("Unable to update order."),
      );
      if (
        user?.role === "farmer" &&
        status === "delivered" &&
        order.status !== "delivered"
      ) {
        setEarnings((current) => {
          const next = {
            ...current,
            totalEarnings: current.totalEarnings + order.subtotal,
          };
          setDoc(doc(db, "users", userId, "earnings", "summary"), next, {
            merge: true,
          }).catch(() => setError("Unable to update earnings."));
          return next;
        });
      }
    },
    [orders, user?.role, userId],
  );

  const markRated = useCallback((id) => {
    setOrders((list) =>
      list.map((order) =>
        order.id === id ? { ...order, rated: true } : order,
      ),
    );
    updateDoc(doc(db, "orders", id), { rated: true }).catch(() =>
      setError("Unable to save rating status."),
    );
  }, []);
  const availableBalance = useMemo(
    () => earnings.totalEarnings - earnings.withdrawn,
    [earnings],
  );
  const withdraw = useCallback(
    (amount, bank) => {
      if (!userId) return null;
      const record = {
        id: uid("w"),
        amount,
        bank,
        reference: `#WS${Math.floor(100_000 + Math.random() * 899_999)}`,
        date: new Date().toISOString(),
        status: "Processing",
      };
      setEarnings((current) => {
        const next = {
          ...current,
          withdrawn: current.withdrawn + amount,
          withdrawals: [record, ...current.withdrawals],
        };
        setDoc(doc(db, "users", userId, "earnings", "summary"), next, {
          merge: true,
        }).catch(() => setError("Unable to save withdrawal."));
        return next;
      });
      return record;
    },
    [userId],
  );

  const value = useMemo(
    () => ({
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
      error,
    }),
    [
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
      error,
    ],
  );
  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
}
export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be used inside <OrderProvider>");
  return ctx;
}
