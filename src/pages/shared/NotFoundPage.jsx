import { Sprout } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { LinkButton } from '@/components/ui/Button';
export function NotFoundPage() {
    const { user } = useAuth();
    const home = user ? (user.role === 'farmer' ? '/farmer' : '/buyer') : '/welcome';
    return (<div className="flex min-h-[100dvh] flex-col items-center justify-center px-6 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-600">
        <Sprout className="h-8 w-8"/>
      </span>
      <p className="mt-6 text-[15px] font-bold uppercase tracking-wide text-brand-600">Error 404</p>
      <h1 className="mt-2 text-[32px] font-extrabold text-ink">This field is empty</h1>
      <p className="mt-3 max-w-sm text-[15px] text-ink-soft">
        We couldn&apos;t find the page you were looking for. It may have been moved or harvested.
      </p>
      <LinkButton to={home} className="mt-8">
        Back to safety
      </LinkButton>
    </div>);
}
