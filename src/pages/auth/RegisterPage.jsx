import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, Phone, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/Field';
import { cx } from '@/lib/utils';
import { AuthSplit } from './AuthSplit';
export function RegisterPage() {
    const { pendingRole, setPendingPhone } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [agreed, setAgreed] = useState(false);
    const [errors, setErrors] = useState({});
    function validate() {
        const next = {};
        if (name.trim().length < 2)
            next.name = 'Enter your name';
        if (!/^(\+?234|0)\d{9,10}$/.test(phone.replace(/\s/g, '')))
            next.phone = 'Enter a valid Nigerian phone number';
        if (email && !/^\S+@\S+\.\S+$/.test(email))
            next.email = 'Enter a valid email address';
        if (password.length < 6)
            next.password = 'Use at least 6 characters';
        if (confirm !== password)
            next.confirm = 'Passwords do not match';
        if (!agreed)
            next.terms = 'Please accept the terms to continue';
        return next;
    }
    function submit(e) {
        e.preventDefault();
        const next = validate();
        setErrors(next);
        if (Object.keys(next).length)
            return;
        setPendingPhone(phone);
        navigate('/otp', { state: { name, phone, email } });
    }
    return (<AuthSplit image={pendingRole === 'farmer' ? '/img/auth-farm.jpg' : '/img/auth-handoff.jpg'} imageAlt={pendingRole === 'farmer'
            ? 'Farmers standing between rows of leafy vegetables'
            : 'A buyer receiving fresh greens from a farmer at a market stall'} backTo="/role">
      <div className="text-center">
        <h1 className="text-[34px] font-extrabold leading-tight text-ink">Create Account</h1>
        <p className="mt-1 text-[17px] text-ink-soft">Fill in your details to get started</p>
      </div>

      <form onSubmit={submit} noValidate className="mt-7 space-y-4">
        <TextField shape="pill" placeholder="User Name" autoComplete="name" icon={<User className="h-[18px] w-[18px]"/>} value={name} onChange={(e) => setName(e.target.value)} error={errors.name} aria-label="User name"/>
        <TextField shape="pill" type="tel" placeholder="Phone Number" autoComplete="tel" icon={<Phone className="h-[18px] w-[18px]"/>} value={phone} onChange={(e) => setPhone(e.target.value)} error={errors.phone} aria-label="Phone number"/>
        <TextField shape="pill" type="email" placeholder="Email (optional)" autoComplete="email" icon={<Mail className="h-[18px] w-[18px]"/>} value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} aria-label="Email"/>
        <TextField shape="pill" type="password" placeholder="Password" autoComplete="new-password" icon={<Lock className="h-[18px] w-[18px]"/>} value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} aria-label="Password"/>
        <TextField shape="pill" type="password" placeholder="Confirm Password" autoComplete="new-password" icon={<Lock className="h-[18px] w-[18px]"/>} value={confirm} onChange={(e) => setConfirm(e.target.value)} error={errors.confirm} aria-label="Confirm password"/>

        <div>
          <label className="flex cursor-pointer items-center gap-2.5 text-[17px] text-ink">
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className={cx('h-5 w-5 shrink-0 cursor-pointer rounded border-2 accent-brand-600', errors.terms ? 'border-red-400' : 'border-brand-400')}/>
            <span>
              I agree to the{' '}
              <span className="font-medium text-brand-600 underline-offset-2 hover:underline">
                Terms and Conditions
              </span>
            </span>
          </label>
          {errors.terms ? (<p className="mt-1 text-xs font-medium text-red-600">{errors.terms}</p>) : null}
        </div>

        <Button type="submit" block className="!mt-8">
          Create Account
        </Button>

        <p className="text-center text-[17px] text-ink">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-brand-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </AuthSplit>);
}
