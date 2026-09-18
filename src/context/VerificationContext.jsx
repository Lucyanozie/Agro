import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "./AuthContext";
const initial = {
  profile: {
    fullName: "",
    dob: "",
    gender: "",
    phone: "",
    address: "",
    state: "",
    lga: "",
    method: "NIN Verification",
    done: false,
  },
  identity: { nin: "", documentName: "", selfieName: "", done: false },
  address: {
    documentType: "Electricity Bill",
    frontName: "",
    backName: "",
    done: false,
  },
  farming: { farmType: "", crops: [], done: false },
  bank: {
    bankName: "",
    accountNumber: "",
    accountName: "",
    verified: false,
    done: false,
  },
  security: {
    passwordSet: false,
    pinSet: false,
    twoFactor: true,
    channel: "SMS",
    done: false,
  },
  submitted: false,
};
function emptyState() {
  return JSON.parse(JSON.stringify(initial));
}
/**
 * Each completed step is worth a share of the overall verification score.
 * `quality` is how much of that share a completed step actually earns — farm
 * details are self-reported, so they top out at 95% and a fully finished
 * profile scores 99 rather than a perfect 100.
 */
const WEIGHTS = [
  { key: "profile", label: "Profile setup", weight: 17, quality: 1 },
  { key: "identity", label: "Identity verification", weight: 20, quality: 1 },
  { key: "address", label: "Address verification", weight: 17, quality: 1 },
  { key: "farming", label: "Farming details", weight: 15, quality: 0.95 },
  { key: "bank", label: "Bank account", weight: 16, quality: 1 },
  { key: "security", label: "Security setup", weight: 15, quality: 1 },
];
const VerificationContext = createContext(null);
export function VerificationProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [state, setState] = useState(emptyState);
  const [error, setError] = useState("");
  useEffect(() => {
    let cancelled = false;
    setState(emptyState());
    setError("");
    if (!userId) return undefined;
    getDoc(doc(db, "users", userId, "verification", "state"))
      .then((snapshot) => {
        if (!cancelled && snapshot.exists())
          setState((current) => ({ ...current, ...snapshot.data() }));
      })
      .catch(() => {
        if (!cancelled) setError("Unable to load verification data.");
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);
  const update = useCallback(
    (step, patch) => {
      if (!userId) return;
      setState((s) => {
        const next = { ...s, [step]: { ...s[step], ...patch } };
        setDoc(doc(db, "users", userId, "verification", "state"), next, {
          merge: true,
        }).catch(() => setError("Unable to save verification data."));
        return next;
      });
    },
    [userId],
  );
  const updateState = useCallback(
    (patch) => {
      if (!userId) return;
      setState((s) => {
        const next = { ...s, ...patch };
        setDoc(doc(db, "users", userId, "verification", "state"), next, {
          merge: true,
        }).catch(() => setError("Unable to save verification data."));
        return next;
      });
    },
    [userId],
  );
  const submit = useCallback(
    () => updateState({ submitted: true }),
    [updateState],
  );
  const reset = useCallback(() => updateState(emptyState()), [updateState]);
  const breakdown = useMemo(
    () =>
      WEIGHTS.map((w) => ({
        label: w.label,
        weight: w.weight,
        quality: w.quality,
        done: state[w.key].done,
      })),
    [state],
  );
  const score = useMemo(
    () =>
      Math.round(
        breakdown.reduce(
          (sum, b) => (b.done ? sum + b.weight * b.quality : sum),
          0,
        ),
      ),
    [breakdown],
  );
  const completedSteps = useMemo(
    () => breakdown.filter((b) => b.done).length,
    [breakdown],
  );
  const value = useMemo(
    () => ({
      state,
      score,
      breakdown,
      completedSteps,
      totalSteps: WEIGHTS.length,
      update,
      submit,
      reset,
      error,
    }),
    [state, score, breakdown, completedSteps, update, submit, reset, error],
  );
  return (
    <VerificationContext.Provider value={value}>
      {children}
    </VerificationContext.Provider>
  );
}
export function useVerification() {
  const ctx = useContext(VerificationContext);
  if (!ctx)
    throw new Error(
      "useVerification must be used inside <VerificationProvider>",
    );
  return ctx;
}
