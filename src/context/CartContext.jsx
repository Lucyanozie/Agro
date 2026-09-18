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
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "./AuthContext";
export const DELIVERY_FEE = 1500;
const CartContext = createContext(null);
export function CartProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [lines, setLines] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    let cancelled = false;
    setLines([]);
    setError("");
    if (!userId) return undefined;
    getDocs(collection(db, "users", userId, "cart"))
      .then((snapshot) => {
        if (!cancelled)
          setLines(
            snapshot.docs.map((item) => ({
              productId: item.id,
              qty: item.data().qty,
            })),
          );
      })
      .catch(() => {
        if (!cancelled) setError("Unable to load your cart.");
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);
  const writeLine = useCallback(
    (productId, qty) => {
      if (!userId) return;
      const ref = doc(db, "users", userId, "cart", productId);
      const write = qty > 0 ? setDoc(ref, { productId, qty }) : deleteDoc(ref);
      write.catch(() => setError("Unable to save your cart."));
    },
    [userId],
  );
  const add = useCallback(
    (product, qty = 1) => {
      setLines((list) => {
        const existing = list.find((l) => l.productId === product.id);
        if (existing) {
          return list.map((l) =>
            l.productId === product.id ? { ...l, qty: l.qty + qty } : l,
          );
        }
        return [...list, { productId: product.id, qty }];
      });
      writeLine(
        product.id,
        (lines.find((item) => item.productId === product.id)?.qty ?? 0) + qty,
      );
    },
    [lines, writeLine],
  );
  const setQty = useCallback(
    (productId, qty) => {
      setLines((list) =>
        qty <= 0
          ? list.filter((l) => l.productId !== productId)
          : list.map((l) => (l.productId === productId ? { ...l, qty } : l)),
      );
      writeLine(productId, qty);
    },
    [writeLine],
  );
  const increment = useCallback(
    (productId) => {
      const qty =
        (lines.find((item) => item.productId === productId)?.qty ?? 0) + 1;
      setLines((list) =>
        list.map((item) =>
          item.productId === productId ? { ...item, qty } : item,
        ),
      );
      writeLine(productId, qty);
    },
    [lines, writeLine],
  );
  const decrement = useCallback(
    (productId) => {
      const qty =
        (lines.find((item) => item.productId === productId)?.qty ?? 1) - 1;
      setLines((list) =>
        list
          .map((item) =>
            item.productId === productId ? { ...item, qty } : item,
          )
          .filter((item) => item.qty > 0),
      );
      writeLine(productId, qty);
    },
    [lines, writeLine],
  );
  const remove = useCallback(
    (productId) => {
      setLines((list) => list.filter((item) => item.productId !== productId));
      writeLine(productId, 0);
    },
    [writeLine],
  );
  const clear = useCallback(() => {
    const previous = lines;
    setLines([]);
    if (userId)
      Promise.all(
        previous.map((item) =>
          deleteDoc(doc(db, "users", userId, "cart", item.productId)),
        ),
      ).catch(() => setError("Unable to clear your cart."));
  }, [lines, userId]);
  const has = useCallback(
    (productId) => lines.some((l) => l.productId === productId),
    [lines],
  );
  const qtyOf = useCallback(
    (productId) => lines.find((l) => l.productId === productId)?.qty ?? 0,
    [lines],
  );
  const count = useMemo(() => lines.length, [lines]);
  const totals = useCallback(
    (resolve) => {
      const subtotal = lines.reduce((sum, l) => {
        const p = resolve(l.productId);
        return p ? sum + p.price * l.qty : sum;
      }, 0);
      const deliveryFee = lines.length ? DELIVERY_FEE : 0;
      return {
        items: lines.length,
        subtotal,
        deliveryFee,
        total: subtotal + deliveryFee,
      };
    },
    [lines],
  );
  const value = useMemo(
    () => ({
      lines,
      count,
      add,
      setQty,
      increment,
      decrement,
      remove,
      clear,
      has,
      qtyOf,
      totals,
      error,
    }),
    [
      lines,
      count,
      add,
      setQty,
      increment,
      decrement,
      remove,
      clear,
      has,
      qtyOf,
      totals,
      error,
    ],
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
