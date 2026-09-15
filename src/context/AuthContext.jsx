import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { BUYER, FARMER } from '@/data/seed';
import { KEYS, load, save } from '@/lib/storage';
const initial = {
    user: null,
    role: null,
    pendingRole: 'farmer',
    pendingPhone: '07036303238',
};
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
    const [state, setState] = useState(() => load(KEYS.auth, initial));
    useEffect(() => {
        save(KEYS.auth, state);
    }, [state]);
    const setPendingRole = useCallback((role) => {
        setState((s) => ({ ...s, pendingRole: role }));
    }, []);
    const setPendingPhone = useCallback((phone) => {
        setState((s) => ({ ...s, pendingPhone: phone }));
    }, []);
    /** Signs in as the seeded demo account for a role. */
    const login = useCallback((role) => {
        const user = role === 'farmer' ? FARMER : BUYER;
        setState((s) => ({ ...s, user, role, pendingRole: role }));
        return user;
    }, []);
    /**
     * Registration keeps the seeded catalogue attached to the account so the new
     * user lands in a populated app rather than an empty one.
     */
    const register = useCallback((details) => {
        setState((s) => {
            const base = s.pendingRole === 'farmer' ? FARMER : BUYER;
            const user = {
                ...base,
                name: details.name || base.name,
                phone: details.phone || base.phone,
                email: details.email || base.email,
                ...(s.pendingRole === 'farmer' ? { verified: false, verificationScore: 0 } : {}),
            };
            return { ...s, user, role: s.pendingRole, pendingPhone: details.phone || s.pendingPhone };
        });
    }, []);
    const updateUser = useCallback((patch) => {
        setState((s) => (s.user ? { ...s, user: { ...s.user, ...patch } } : s));
    }, []);
    const logout = useCallback(() => {
        setState((s) => ({ ...initial, pendingRole: s.pendingRole }));
    }, []);
    const value = useMemo(() => ({
        ...state,
        isAuthed: Boolean(state.user),
        setPendingRole,
        setPendingPhone,
        login,
        register,
        updateUser,
        logout,
    }), [state, setPendingRole, setPendingPhone, login, register, updateUser, logout]);
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx)
        throw new Error('useAuth must be used inside <AuthProvider>');
    return ctx;
}
