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
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uid } from "@/lib/utils";
import { useAuth } from "./AuthContext";
const ProductContext = createContext(null);
export function ProductProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [products, setProducts] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    let cancelled = false;
    setProducts([]);
    setFavourites([]);
    setError("");
    async function loadData() {
      try {
        const productsSnapshot = await getDocs(collection(db, "products"));
        const nextProducts = productsSnapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));
        const favouriteSnapshot = userId
          ? await getDocs(collection(db, "users", userId, "favourites"))
          : { docs: [] };
        if (cancelled) return;
        setProducts(nextProducts);
        setFavourites(favouriteSnapshot.docs.map((item) => item.id));
      } catch {
        if (!cancelled) {
          setProducts([]);
          setFavourites([]);
          setError("Unable to load marketplace data.");
        }
      }
    }
    loadData();
    return () => {
      cancelled = true;
    };
  }, [userId]);
  const byId = useCallback(
    (id) => products.find((p) => p.id === id),
    [products],
  );
  const byCategory = useCallback(
    (slug) => products.filter((p) => p.category === slug),
    [products],
  );
  const search = useCallback(
    (query, category = "all") => {
      const q = query.trim().toLowerCase();
      return products.filter((p) => {
        const matchesCategory = category === "all" || p.category === category;
        const matchesQuery =
          !q ||
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q);
        return matchesCategory && matchesQuery;
      });
    },
    [products],
  );
  const bestSellers = useMemo(
    () => products.filter((p) => p.inStock).slice(0, 4),
    [products],
  );
  const addProduct = useCallback(
    (input) => {
      const product = {
        ...input,
        id: doc(collection(db, "products")).id,
        farmerId: user?.id ?? "",
        farmName: user?.farmName ?? user?.name ?? "",
        location: user?.location ?? "",
        inStock: true,
        rating: 0,
        reviews: [],
        createdAt: new Date().toISOString(),
      };
      setProducts((list) => [product, ...list]);
      setDoc(doc(db, "products", product.id), product).catch(() => {
        setProducts((list) => list.filter((item) => item.id !== product.id));
        setError("Unable to publish product.");
      });
      return product;
    },
    [user],
  );
  const updateProduct = useCallback(
    (id, patch) => {
      const existing = products.find((item) => item.id === id);
      if (!existing || existing.farmerId !== userId) return;
      setProducts((list) =>
        list.map((p) => (p.id === id ? { ...p, ...patch } : p)),
      );
      updateDoc(doc(db, "products", id), patch).catch(() => {
        setError("Unable to update product.");
      });
    },
    [products, userId],
  );
  const toggleStock = useCallback(
    (id) => {
      setProducts((list) =>
        list.map((p) =>
          p.id === id && p.farmerId === userId
            ? { ...p, inStock: !p.inStock }
            : p,
        ),
      );
      const product = products.find(
        (item) => item.id === id && item.farmerId === userId,
      );
      if (product)
        updateDoc(doc(db, "products", id), { inStock: !product.inStock }).catch(
          () => setError("Unable to update product stock."),
        );
    },
    [products, userId],
  );
  const removeProduct = useCallback(
    (id) => {
      const product = products.find(
        (item) => item.id === id && item.farmerId === userId,
      );
      if (!product) return;
      setProducts((list) => list.filter((p) => p.id !== id));
      deleteDoc(doc(db, "products", id)).catch(() => {
        setProducts((list) => [product, ...list]);
        setError("Unable to delete product.");
      });
    },
    [products, userId],
  );
  const addReview = useCallback(
    (productId, review) => {
      const product = products.find((item) => item.id === productId);
      if (!product) return;
      const reviews = [
        { ...review, id: uid("r"), date: new Date().toISOString() },
        ...(product.reviews ?? []),
      ];
      const rating =
        reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length;
      const patch = { reviews, rating: Math.round(rating * 10) / 10 };
      setProducts((list) =>
        list.map((p) => {
          if (p.id !== productId) return p;
          return { ...p, ...patch };
        }),
      );
      updateDoc(doc(db, "products", productId), patch).catch(() =>
        setError("Unable to save review."),
      );
    },
    [products],
  );
  const toggleFavourite = useCallback(
    (id) => {
      if (!userId) return;
      const favouriteRef = doc(db, "users", userId, "favourites", id);
      if (favourites.includes(id)) {
        setFavourites((list) => list.filter((f) => f !== id));
        deleteDoc(favouriteRef).catch(() =>
          setError("Unable to remove favourite."),
        );
      } else {
        setFavourites((list) => [...list, id]);
        setDoc(favouriteRef, {
          productId: id,
          createdAt: new Date().toISOString(),
        }).catch(() => setError("Unable to save favourite."));
      }
    },
    [favourites, userId],
  );
  const isFavourite = useCallback(
    (id) => favourites.includes(id),
    [favourites],
  );
  const value = useMemo(
    () => ({
      products,
      favourites,
      error,
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
    }),
    [
      products,
      favourites,
      error,
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
    ],
  );
  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
}
export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx)
    throw new Error("useProducts must be used inside <ProductProvider>");
  return ctx;
}
