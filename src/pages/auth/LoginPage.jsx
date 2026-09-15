import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Phone, Sprout, ShoppingBasket } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/Field';
import { AuthSplit } from './AuthSplit';
export function LoginPage() {
    const { login } = useAuth();
    const { notify } = useToast();
    const navigate = useNavigate();
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [errors, setErrors] = useState({});
    function enter(role, name) {
        login(role);
        notify(`Signed in as ${name}`);
        navigate(role === 'farmer' ? '/farmer' : '/buyer', { replace: true });
    }
    function submit(e) {
        e.preventDefault();
        const next = {};
        if (!/^(\+?234|0)\d{9,10}$/.test(phone.replace(/\s/g, '')))
            next.phone = 'Enter a valid Nigerian phone number';
        if (password.length < 6)
            next.password = 'Use at least 6 characters';
        setErrors(next);
        if (Object.keys(next).length)
            return;
        // Musa's seeded number signs in as the farmer; anything else as the buyer.
        const isFarmer = phone.replace(/\D/g, '').endsWith('7036303238');
        enter(isFarmer ? 'farmer' : 'buyer', isFarmer ? 'Musa' : 'Sarah');
    }
    return (<AuthSplit image="/img/auth-farm.jpg" imageAlt="Two farmers harvesting vegetables on their farm" backTo="/welcome" leaves>
      <h1 className="text-center text-[34px] font-extrabold text-ink">Welcome Back!</h1>
      <p className="mt-1 text-center text-[17px] text-ink-soft">Login to Continue</p>

      <form onSubmit={submit} noValidate className="mt-8 space-y-4">
        <TextField shape="pill" type="tel" placeholder="Phone Number" autoComplete="tel" icon={<Phone className="h-[18px] w-[18px]"/>} value={phone} onChange={(e) => setPhone(e.target.value)} error={errors.phone} aria-label="Phone number"/>
        <TextField shape="pill" type="password" placeholder="Password" autoComplete="current-password" icon={<Lock className="h-[18px] w-[18px]"/>} value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} aria-label="Password"/>

        <div className="flex items-center justify-between gap-4">
          <label className="flex cursor-pointer items-center gap-2.5 text-[15px] font-bold text-ink">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-5 w-5 cursor-pointer rounded-full border-2 border-brand-400 accent-brand-600"/>
            Remember Me
          </label>
          <button type="button" className="text-[15px] font-bold text-brand-600 hover:underline">
            Forgot Password
          </button>
        </div>

        <Button type="submit" block className="!mt-7">
          Login
        </Button>

        <p className="text-center text-[15px] font-medium text-ink">
          Don&apos;t have an account?{' '}
          <Link to="/role" className="font-bold text-brand-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </form>

      <div className="relative mt-8">
        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-ink-line"/>
          <span className="text-xs font-semibold uppercase tracking-wide text-ink-mute">
            Or try a demo account
          </span>
          <span className="h-px flex-1 bg-ink-line"/>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Button variant="outline" size="md" aria-label="Log in with the demo farmer account" onClick={() => enter('farmer', 'Musa')} className="flex-col !gap-0.5 !py-2 h-auto">
            <Sprout className="h-5 w-5"/>
            <span className="text-sm">Login as Farmer</span>
          </Button>
          <Button variant="outline" size="md" aria-label="Log in with the demo buyer account" onClick={() => enter('buyer', 'Sarah')} className="flex-col !gap-0.5 !py-2 h-auto">
            <ShoppingBasket className="h-5 w-5"/>
            <span className="text-sm">Login as Buyer</span>
          </Button>
        </div>
      </div>
    </AuthSplit>);
}
