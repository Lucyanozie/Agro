import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  RecaptchaVerifier,
  onAuthStateChanged,
  signInWithPhoneNumber,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

// Normalizes a Nigerian phone number to strict E.164 format.
// This MUST produce a string that is character-for-character identical
// to whatever you typed into Firebase Console > Authentication >
// Sign-in method > Phone > Phone numbers for testing.
function normalizePhone(rawPhone) {
  // strip spaces, dashes, and parentheses — keep only digits and a leading "+"
  const cleaned = rawPhone.trim().replace(/[\s\-()]/g, "");

  if (cleaned.startsWith("+")) return cleaned; // already E.164, leave as-is
  if (cleaned.startsWith("234")) return `+${cleaned}`; // "234801..." -> "+234801..."
  if (cleaned.startsWith("0")) return `+234${cleaned.slice(1)}`; // "0801..." -> "+234801..."

  return cleaned; // fallback: pass through unchanged
}

const initial = {
  user: null,
  role: null,
  pendingRole: null,
  pendingPhone: "",
  pendingDetails: null,
  pendingMode: null,
};

export function authErrorMessage(error) {
  switch (error?.code) {
    case "auth/invalid-verification-code":
      return "The verification code is incorrect.";
    case "auth/code-expired":
      return "This verification code has expired. Request a new code.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait and try again later.";
    case "auth/operation-not-allowed":
      return "Phone authentication is not enabled for this project.";
    case "auth/invalid-phone-number":
      return "Enter a valid phone number.";
    case "auth/quota-exceeded":
      return "SMS quota exceeded. Please try again later.";
    default:
      return error?.message || "Unable to complete authentication.";
  }
}

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const confirmationRef = useRef(null);
  const recaptchaRef = useRef(null);
  const isSendingOtpRef = useRef(false);
  // While true, confirmPhoneOtp is actively resolving register/login and
  // is the sole authority over auth state — onAuthStateChanged defers to
  // it instead of racing to fetch/clear the profile itself.
  const authFlowInProgressRef = useRef(false);
  // Tracks the in-flight confirmPhoneOtp attempt, if any. A second call
  // that arrives while one is still running (double-tap on Verify, a
  // retry after a slow network) reuses this same promise instead of
  // calling confirm()/register() a second time — see confirmPhoneOtp
  // below for why that matters.
  const confirmOtpPromiseRef = useRef(null);
  const [state, setState] = useState(initial);
  const [loading, setLoading] = useState(true);

  // Firebase Authentication is the ONLY source of truth for whether anyone
  // is signed in, and Firestore is the ONLY source of truth for who that
  // person is. This listener re-derives both on every auth change instead
  // of trusting whatever was cached in localStorage from a previous
  // session — that's what prevents one browser user's cached profile from
  // ever appearing as another user's data.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (authFlowInProgressRef.current) return; // confirmPhoneOtp owns this update

      if (!firebaseUser) {
        // No active Firebase session — there is nothing to be "logged in"
        // as, regardless of what's sitting in localStorage.
        setState((s) => ({ ...initial, pendingRole: s.pendingRole }));
        setLoading(false);
        return;
      }

      try {
        const snapshot = await getDoc(doc(db, "users", firebaseUser.uid));
        if (!snapshot.exists()) {
          // Signed into Firebase but no Agricconnect profile exists yet
          // (e.g. an abandoned registration). Not a valid app session.
          setState((s) => ({ ...initial, pendingRole: s.pendingRole }));
          await signOut(auth).catch(() => {});
          setLoading(false);
          return;
        }
        const profile = snapshot.data();
        const user = { id: firebaseUser.uid, ...profile };
        setState((s) => ({
          ...s,
          user,
          role: user.role,
          pendingRole: user.role,
        }));
      } catch {
        setState((s) => ({ ...initial, pendingRole: s.pendingRole }));
        await signOut(auth).catch(() => {});
      } finally {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(
    () => () => {
      recaptchaRef.current?.clear();
      recaptchaRef.current = null;
      confirmationRef.current = null;
      confirmOtpPromiseRef.current = null;
    },
    [],
  );

  const setPendingRole = useCallback((role) => {
    setState((s) => ({ ...s, pendingRole: role }));
  }, []);
  const setPendingPhone = useCallback((phone) => {
    setState((s) => ({ ...s, pendingPhone: phone }));
  }, []);

  // Existing (already-registered) user completing OTP sign-in.
  // The application profile lives ONLY in Firestore under users/{uid} —
  // we never fabricate one here. If no document exists for this uid,
  // there is no Agricconnect account for this phone number, and we
  // throw a clear error instead of silently creating a blank profile.
  const login = useCallback(async (firebaseUser) => {
    const snapshot = await getDoc(doc(db, "users", firebaseUser.uid));
    if (!snapshot.exists()) {
      await signOut(auth).catch(() => {});
      throw new Error(
        "No Agricconnect account exists for this phone number. Please sign up first.",
      );
    }
    const profile = snapshot.data();
    const user = { id: firebaseUser.uid, ...profile }; // profile.name wins — never the phone number
    setState((s) => ({ ...s, user, role: user.role, pendingRole: user.role }));
    return user;
  }, []);

  const sendPhoneOtp = useCallback(async (phone, details = null) => {
    // Guard against double-clicks / rapid re-calls racing on the same
    // reCAPTCHA container, which is what causes "reCAPTCHA has already
    // been rendered in this element".
    if (isSendingOtpRef.current) return;
    isSendingOtpRef.current = true;
    try {
      const normalizedPhone = normalizePhone(phone);
      const container = document.getElementById("recaptcha-container");
      if (!container)
        throw new Error("The reCAPTCHA container is not available yet.");

      // Always start from a fresh verifier. Reusing one bound to a container
      // that React has since unmounted/remounted (or that was already used
      // for a previous attempt) causes "reCAPTCHA client element has been
      // removed" errors.
      if (recaptchaRef.current) {
        recaptchaRef.current.clear();
        recaptchaRef.current = null;
      }
      // Belt-and-suspenders: make sure no leftover widget markup remains
      // in the container before rendering a new one into it.
      container.innerHTML = "";

      recaptchaRef.current = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
        },
      );

      const confirmation = await signInWithPhoneNumber(
        auth,
        normalizedPhone,
        recaptchaRef.current,
      );
      confirmationRef.current = confirmation;
      // A fresh code invalidates any previous in-flight verification.
      confirmOtpPromiseRef.current = null;
      // Explicit mode, decided once, up front — confirmPhoneOtp branches
      // on this rather than re-inferring intent from pendingDetails later.
      setState((s) => ({
        ...s,
        pendingPhone: normalizedPhone,
        pendingDetails: details,
        pendingMode: details ? "register" : "login",
      }));
    } catch (error) {
      throw new Error(authErrorMessage(error));
    } finally {
      isSendingOtpRef.current = false;
    }
  }, []);

  // New user completing OTP sign-in for the first time. Writes the
  // application profile to Firestore under users/{firebaseUser.uid} —
  // never a generated id, always the real Firebase Auth uid.
  const register = useCallback(
    async (details, firebaseUser) => {
      const role = state.pendingRole;

      const existing = await getDoc(doc(db, "users", firebaseUser.uid));
      if (existing.exists()) {
        await signOut(auth);
        throw new Error(
          "This phone number is already registered. Please log in.",
        );
      }

      const profile = {
        name: details.name,
        role,
        phone: details.phone,
        email: details.email ?? "",
        avatar: "",
        location: "",
        createdAt: new Date().toISOString(),
        rating: 0,
        reviewCount: 0,
        ...(role === "farmer" ? { verified: false, verificationScore: 0 } : {}),
      };

      await setDoc(doc(db, "users", firebaseUser.uid), profile, {
        merge: true,
      });

      const user = { id: firebaseUser.uid, ...profile };
      setState((s) => ({
        ...s,
        user,
        role,
        pendingPhone: details.phone,
      }));

      return user;
    },
    [state.pendingRole],
  );

  // Verifies the OTP and completes registration or login. If a second
  // call arrives while one is already resolving — a double-tap on
  // Verify, or a retry triggered by a slow network — it reuses the same
  // in-flight promise instead of calling confirm()/register() again.
  // Without this, a duplicate call would re-run register(), find the
  // Firestore doc the first call just created, throw "already
  // registered", and sign the user back out of the session the first
  // call had just successfully established.
  const confirmPhoneOtp = useCallback(
    async (code) => {
      if (confirmOtpPromiseRef.current) return confirmOtpPromiseRef.current;

      if (!confirmationRef.current)
        throw new Error(
          "Your verification session has expired. Request a new code.",
        );

      // From here until we've fully resolved register/login, this attempt
      // is the sole authority over auth state — see the note above
      // onAuthStateChanged for why that matters.
      const attempt = (async () => {
        authFlowInProgressRef.current = true;
        try {
          const result = await confirmationRef.current.confirm(code);
          const firebaseUser = result.user;
          const mode =
            state.pendingMode ?? (state.pendingDetails ? "register" : "login");

          // Return the app profile (with .role) — not the raw Firebase
          // user, which has no .role and previously broke farmer/buyer
          // dashboard routing after login.
          const appUser =
            mode === "register"
              ? await register(
                  {
                    ...state.pendingDetails,
                    phone:
                      firebaseUser.phoneNumber ?? state.pendingDetails?.phone,
                  },
                  firebaseUser,
                )
              : await login(firebaseUser);

          confirmationRef.current = null;
          return appUser;
        } finally {
          authFlowInProgressRef.current = false;
          confirmOtpPromiseRef.current = null;
        }
      })();

      confirmOtpPromiseRef.current = attempt;
      return attempt;
    },
    [login, register, state.pendingDetails, state.pendingMode],
  );

  // Keeps the Firestore document as the source of truth: every patch is
  // written through, not just held in memory.
  const updateUser = useCallback(async (patch) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    setState((s) => {
      if (!s.user) return s;
      return { ...s, user: { ...s.user, ...patch } };
    });
    await setDoc(doc(db, "users", uid), patch, { merge: true });
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
    setState((s) => ({ ...initial, pendingRole: s.pendingRole }));
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      isAuthed: Boolean(state.user),
      loading,
      setPendingRole,
      setPendingPhone,
      login,
      register,
      sendPhoneOtp,
      confirmPhoneOtp,
      updateUser,
      logout,
    }),
    [
      state,
      loading,
      setPendingRole,
      setPendingPhone,
      login,
      register,
      sendPhoneOtp,
      confirmPhoneOtp,
      updateUser,
      logout,
    ],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}