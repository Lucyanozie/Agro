import { useNavigate } from 'react-router-dom';
import { Bell, HelpCircle, Info, Landmark, LogOut, MapPin, Sparkles, User, } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { PageHeader } from '@/components/layout/Header';
function Row({ icon, title, subtitle, to, trailing, }) {
    return (<Link to={to} className="flex items-center gap-4 px-4 py-4 transition hover:bg-brand-50/50">
      <span className="shrink-0">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-[17px] font-bold text-ink">{title}</span>
        {subtitle ? <span className="block text-[15px] text-ink-soft">{subtitle}</span> : null}
      </span>
      <span className="flex shrink-0 items-center gap-2 text-[15px] text-ink-soft">
        {trailing}
        <Chevron />
      </span>
    </Link>);
}
function Chevron() {
    return (<svg viewBox="0 0 20 20" className="h-5 w-5 text-ink-soft" aria-hidden="true">
      <path d="M7.5 4.5 13 10l-5.5 5.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
    </svg>);
}
export function FarmerSettingsPage() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    return (<>
      <PageHeader title="Settings" backTo="/farmer/profile" right={<span className="flex h-10 w-10 items-center justify-center text-ink">
            <Bell className="h-5 w-5"/>
          </span>}/>

      <div className="mx-auto w-full max-w-2xl space-y-4 px-4 pb-12 lg:px-8">
        <section className="card divide-y divide-ink-line overflow-hidden">
          <Row icon={<User className="h-6 w-6 text-brand-500"/>} title="Profile Information" subtitle="Manage your personal informations" to="/farmer/profile"/>
          <Row icon={<LockIcon />} title="Change Password" subtitle="Chang password and security settings" to="/farmer/verify/security"/>
          <Row icon={<Bell className="h-6 w-6 text-brand-500"/>} title="Notification Settings" to="/farmer/settings"/>
          <Row icon={<MapPin className="h-6 w-6 text-brand-500"/>} title="Bank Details" to="/farmer/verify/bank"/>
        </section>

        <section className="card divide-y divide-ink-line overflow-hidden">
          <Row icon={<Landmark className="h-6 w-6 text-brand-500"/>} title="Language" to="/farmer/settings" trailing={<span>English</span>}/>
          <button type="button" onClick={() => {
            logout();
            navigate('/welcome', { replace: true });
        }} className="flex w-full items-center gap-4 px-4 py-4 text-left transition hover:bg-red-50/50">
            <LogOut className="h-6 w-6 shrink-0 text-red-500"/>
            <span className="text-[17px] font-bold text-red-500">Log Out</span>
          </button>
        </section>

        <section className="card divide-y divide-ink-line overflow-hidden">
          <Row icon={<HelpCircle className="h-6 w-6 text-ink"/>} title="Help & Support" subtitle="Get help and contact support" to="/farmer/settings"/>
          <Row icon={<Info className="h-6 w-6 text-ink"/>} title="About Agroconnect" subtitle="Learn more about our mission" to="/farmer/settings"/>
          <Row icon={<Sparkles className="h-6 w-6 text-brand-500"/>} title="Featured Plans" subtitle="Get your farm in front of more buyers" to="/farmer/featured"/>
        </section>
      </div>
    </>);
}
function LockIcon() {
    return (<span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-50">
      <svg viewBox="0 0 20 20" className="h-4 w-4 text-brand-600" aria-hidden="true">
        <path fill="currentColor" d="M6 8V6.5a4 4 0 1 1 8 0V8h.5A1.5 1.5 0 0 1 16 9.5v6A1.5 1.5 0 0 1 14.5 17h-9A1.5 1.5 0 0 1 4 15.5v-6A1.5 1.5 0 0 1 5.5 8H6Zm1.5 0h5V6.5a2.5 2.5 0 0 0-5 0V8Z"/>
      </svg>
    </span>);
}
