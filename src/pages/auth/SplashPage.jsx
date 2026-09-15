import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Logo } from '@/components/ui/Bits';
/** Brand splash. Returning users skip straight to their dashboard. */
export function SplashPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    useEffect(() => {
        const id = window.setTimeout(() => {
            if (user)
                navigate(user.role === 'farmer' ? '/farmer' : '/buyer', { replace: true });
            else
                navigate('/welcome', { replace: true });
        }, 2100);
        return () => window.clearTimeout(id);
    }, [navigate, user]);
    return (<button type="button" onClick={() => navigate(user ? (user.role === 'farmer' ? '/farmer' : '/buyer') : '/welcome', { replace: true })} className="relative flex min-h-[100dvh] w-full items-center justify-center overflow-hidden text-left" aria-label="Continue to AgroConnect">
      <img src="/img/splash-field.jpg" alt="" className="absolute inset-0 h-full w-full object-cover"/>
      <span className="absolute inset-0 bg-gradient-to-b from-brand-900/25 via-brand-900/30 to-brand-900/55"/>

      <div className="relative flex flex-col items-center px-8 text-center animate-fade-in">
        <Logo variant="white" className="w-[260px] drop-shadow-lg sm:w-[320px]"/>
        <p className="mt-8 text-lg font-bold text-white drop-shadow sm:text-xl">
          Connecting Farmers Directly to Buyers........
        </p>
        <span className="mt-10 flex gap-2" aria-hidden="true">
          {[0, 1, 2].map((i) => (<span key={i} className="h-2.5 w-2.5 animate-pulse rounded-full bg-white/85" style={{ animationDelay: `${i * 180}ms` }}/>))}
        </span>
      </div>
      <h1 className="sr-only">AgroConnect — connecting farmers directly to buyers</h1>
    </button>);
}
