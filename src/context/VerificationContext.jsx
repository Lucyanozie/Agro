import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { KEYS, load, save } from '@/lib/storage';
const initial = {
    profile: {
        fullName: '',
        dob: '',
        gender: '',
        phone: '',
        address: '',
        state: '',
        lga: '',
        method: 'NIN Verification',
        done: false,
    },
    identity: { nin: '', documentName: '', selfieName: '', done: false },
    address: { documentType: 'Electricity Bill', frontName: '', backName: '', done: false },
    farming: { farmType: '', crops: [], done: false },
    bank: { bankName: '', accountNumber: '', accountName: '', verified: false, done: false },
    security: { passwordSet: false, pinSet: false, twoFactor: true, channel: 'SMS', done: false },
    submitted: false,
};
/**
 * Each completed step is worth a share of the overall verification score.
 * `quality` is how much of that share a completed step actually earns — farm
 * details are self-reported, so they top out at 95% and a fully finished
 * profile scores 99 rather than a perfect 100.
 */
const WEIGHTS = [
    { key: 'profile', label: 'Profile setup', weight: 17, quality: 1 },
    { key: 'identity', label: 'Identity verification', weight: 20, quality: 1 },
    { key: 'address', label: 'Address verification', weight: 17, quality: 1 },
    { key: 'farming', label: 'Farming details', weight: 15, quality: 0.95 },
    { key: 'bank', label: 'Bank account', weight: 16, quality: 1 },
    { key: 'security', label: 'Security setup', weight: 15, quality: 1 },
];
const VerificationContext = createContext(null);
export function VerificationProvider({ children }) {
    const [state, setState] = useState(() => load(KEYS.verification, initial));
    useEffect(() => {
        save(KEYS.verification, state);
    }, [state]);
    const update = useCallback((step, patch) => {
        setState((s) => ({ ...s, [step]: { ...s[step], ...patch } }));
    }, []);
    const submit = useCallback(() => setState((s) => ({ ...s, submitted: true })), []);
    const reset = useCallback(() => setState(initial), []);
    const breakdown = useMemo(() => WEIGHTS.map((w) => ({
        label: w.label,
        weight: w.weight,
        quality: w.quality,
        done: state[w.key].done,
    })), [state]);
    const score = useMemo(() => Math.round(breakdown.reduce((sum, b) => (b.done ? sum + b.weight * b.quality : sum), 0)), [breakdown]);
    const completedSteps = useMemo(() => breakdown.filter((b) => b.done).length, [breakdown]);
    const value = useMemo(() => ({
        state,
        score,
        breakdown,
        completedSteps,
        totalSteps: WEIGHTS.length,
        update,
        submit,
        reset,
    }), [state, score, breakdown, completedSteps, update, submit, reset]);
    return <VerificationContext.Provider value={value}>{children}</VerificationContext.Provider>;
}
export function useVerification() {
    const ctx = useContext(VerificationContext);
    if (!ctx)
        throw new Error('useVerification must be used inside <VerificationProvider>');
    return ctx;
}
