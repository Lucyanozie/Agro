import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useVerification } from '@/context/VerificationContext';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/Field';
import { Toggle } from '@/components/ui/Bits';
import { cx } from '@/lib/utils';
import { VerificationLayout } from './VerificationLayout';
const RULES = [
    { label: 'At least 8 characters', test: (v) => v.length >= 8 },
    { label: 'Include uppercase & lowercase', test: (v) => /[a-z]/.test(v) && /[A-Z]/.test(v) },
    { label: 'Include numbers', test: (v) => /\d/.test(v) },
];
export function SecuritySetup() {
    const { state, update } = useVerification();
    const navigate = useNavigate();
    const security = state.security;
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [pin, setPin] = useState('');
    const [errors, setErrors] = useState({});
    const passwordOk = RULES.every((r) => r.test(password));
    function submit(e) {
        e.preventDefault();
        const next = {};
        if (!passwordOk)
            next.password = 'Your password does not meet all the requirements yet';
        if (confirm !== password)
            next.confirm = 'Passwords do not match';
        if (!/^\d{4}$/.test(pin))
            next.pin = 'Enter a 4-digit pin';
        setErrors(next);
        if (Object.keys(next).length)
            return;
        update('security', { passwordSet: true, pinSet: true, done: true });
        navigate('/farmer/verify/review');
    }
    return (<VerificationLayout title="Secure your Account" subtitle="Set up security to protect your account" backTo="/farmer/verify/bank" footer={<Button block type="submit" form="security-form">
          Complete Setup
        </Button>}>
      <form id="security-form" onSubmit={submit} noValidate className="space-y-6">
        <section className="space-y-3 rounded-xl border border-brand-100 bg-brand-50/60 p-4">
          <TextField shape="pill" type="password" label="Create Password" placeholder="Enter Password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password}/>

          <ul className="space-y-1.5">
            {RULES.map((rule) => {
            const met = rule.test(password);
            return (<li key={rule.label} className={cx('flex items-center gap-2 text-[15px] transition', met ? 'text-ink' : 'text-ink-soft')}>
                  <Check className={cx('h-4 w-4 shrink-0', met ? 'text-brand-600' : 'text-ink-mute')} strokeWidth={3}/>
                  {rule.label}
                </li>);
        })}
          </ul>

          <TextField shape="pill" type="password" label="Confirm Password" placeholder="Confirm Password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} error={errors.confirm}/>

          <TextField shape="pill" type="password" inputMode="numeric" maxLength={4} label="Create Pin" placeholder="Enter 4-digit pin" value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))} error={errors.pin}/>
        </section>

        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[17px] font-bold text-ink">Enable Two-Factor Authentication</p>
            <p className="text-xs text-ink-soft">We&apos;ll send a code to your phone</p>
          </div>
          <Toggle checked={security.twoFactor} onChange={(v) => update('security', { twoFactor: v })} label="Enable two-factor authentication"/>
        </div>

        {security.twoFactor ? (<fieldset className="animate-slide-up">
            <legend className="mb-2 text-[17px] font-bold text-ink">Preferred 2FA Channel</legend>
            <div className="grid grid-cols-2 gap-4">
              {['SMS', 'Email'].map((channel) => (<label key={channel} className={cx('flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-[15px] font-medium transition', security.channel === channel
                    ? 'border-brand-400 bg-brand-50/60 text-ink'
                    : 'border-ink-line bg-white text-ink hover:bg-brand-50/30')}>
                  <input type="radio" name="channel" checked={security.channel === channel} onChange={() => update('security', { channel })} className="h-5 w-5 accent-brand-600"/>
                  {channel}
                </label>))}
            </div>
          </fieldset>) : null}
      </form>
    </VerificationLayout>);
}
