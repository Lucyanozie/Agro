import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Camera, CreditCard, LogOut, Mail, MapPin, Phone, Settings, Sprout, Star, Trash2, User, } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useVerification } from '@/context/VerificationContext';
import { PageHeader } from '@/components/layout/Header';
import { RadialGauge, scoreCaption } from '@/components/ui/RadialGauge';
import { Button, LinkButton } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { clearAll } from '@/lib/storage';
function Detail({ icon, label, value, }) {
    return (<div className="flex min-w-0 items-start gap-2.5">
      <span className="mt-0.5 shrink-0 text-brand-500">{icon}</span>
      <span className="min-w-0">
        <span className="block text-[15px] text-ink-mute">{label}</span>
        <span className="block truncate text-[15px] font-bold text-ink">{value}</span>
      </span>
    </div>);
}
export function FarmerProfilePage() {
    const { user, logout } = useAuth();
    const { score, state } = useVerification();
    const { notify } = useToast();
    const navigate = useNavigate();
    const [confirmDelete, setConfirmDelete] = useState(false);
    if (!user)
        return null;
    // Prefer the live verification score once the flow has been completed.
    const displayScore = state.submitted ? score : (user.verificationScore ?? 0);
    const breakdown = [
        { label: 'Identity', value: state.identity.done || user.verified ? 100 : 0 },
        { label: 'Farm', value: state.farming.done || user.verified ? 95 : 0 },
        { label: 'Address', value: state.address.done || user.verified ? 100 : 0 },
        { label: 'Banking', value: state.bank.done || user.verified ? 100 : 0 },
    ];
    function handleLogout() {
        logout();
        navigate('/welcome', { replace: true });
    }
    function handleDelete() {
        clearAll();
        logout();
        navigate('/welcome', { replace: true });
    }
    return (<>
      <PageHeader title="My Profile" backTo="/farmer" right={<button type="button" onClick={() => navigate('/farmer/settings')} aria-label="Settings" className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition hover:bg-brand-50">
            <Settings className="h-5 w-5"/>
          </button>}/>

      <div className="mx-auto w-full max-w-3xl space-y-4 px-4 pb-12 lg:px-8">
        <section className="card flex items-center gap-4 p-4">
          <div className="relative shrink-0">
            <img src={user.avatar} alt="" className="h-[76px] w-[76px] rounded-full object-cover"/>
            <button type="button" onClick={() => notify('Photo updates are coming soon')} aria-label="Change profile photo" className="absolute -bottom-0.5 -right-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white ring-2 ring-white transition hover:bg-brand-700">
              <Camera className="h-4 w-4"/>
            </button>
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-[22px] font-bold text-ink">{user.name}</h1>
            {user.verified ? (<p className="mt-0.5 flex items-center gap-1.5 text-[15px] font-bold text-brand-600">
                <svg viewBox="0 0 20 20" className="h-[18px] w-[18px]">
                  <path fill="currentColor" d="m10 1.2 1.9 1.5 2.4-.3 1 2.2 2.2 1-.3 2.4L18.8 10l-1.6 1.9.3 2.4-2.2 1-1 2.2-2.4-.3L10 18.8l-1.9-1.6-2.4.3-1-2.2-2.2-1 .3-2.4L1.2 10l1.6-1.9-.3-2.4 2.2-1 1-2.2 2.4.3L10 1.2Z"/>
                  <path fill="#fff" d="m8.9 12.7-2.4-2.4 1.1-1.1 1.3 1.3 3.5-3.5 1.1 1.1-4.6 4.6Z"/>
                </svg>
                Verified Farmer
              </p>) : (<LinkButton to="/farmer/verify/profile" size="sm" variant="outline" className="mt-1">
                Complete verification
              </LinkButton>)}
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-brand-50 px-4 py-1.5 text-[15px] font-bold text-brand-700">
                Free Plan
              </span>
              <span className="flex items-center gap-1 text-[15px] text-ink">
                <Star className="h-4 w-4 fill-[#FFB800] text-[#FFB800]"/>
                <span className="font-bold">{user.rating ?? 4.8}</span>
                <span className="text-ink-soft">( 128 Reviews)</span>
              </span>
            </div>
          </div>
        </section>

        <section className="card p-4">
          <h2 className="flex items-center gap-2 text-[17px] font-bold text-brand-600">
            <User className="h-5 w-5"/>
            Personal Information
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Detail icon={<User className="h-[18px] w-[18px]"/>} label="Full Name" value={user.name}/>
            <Detail icon={<Mail className="h-[18px] w-[18px]"/>} label="Email Address" value={user.email}/>
            <Detail icon={<Phone className="h-[18px] w-[18px]"/>} label="Phone Number" value={user.phone}/>
            <Detail icon={<MapPin className="h-[18px] w-[18px]"/>} label="Farm Location" value={user.location}/>
            <Detail icon={<Sprout className="h-[18px] w-[18px]"/>} label="Farm Category" value={`${user.farmType ?? 'Mixed'} Farming`}/>
            <Detail icon={<CreditCard className="h-[18px] w-[18px]"/>} label="Member Since" value="15 march 2022"/>
          </div>
        </section>

        <section>
          <h2 className="mb-2 text-[15px] font-bold text-ink">Verification Score</h2>
          <div className="card flex flex-col items-center gap-6 p-6 sm:flex-row sm:justify-around">
            <div className="text-center">
              <RadialGauge value={displayScore} size={160} stroke={12}/>
              <p className="mt-2 text-[17px] font-bold text-ink">{scoreCaption(displayScore)}</p>
            </div>
            <dl className="w-full max-w-[220px] space-y-3">
              {breakdown.map((b) => (<div key={b.label} className="flex items-center justify-between gap-6">
                  <dt className="text-[15px] text-ink">{b.label}</dt>
                  <dd className="text-[15px] font-bold text-ink">{b.value}%</dd>
                </div>))}
            </dl>
          </div>
        </section>

        <section className="card divide-y divide-ink-line overflow-hidden">
          <button type="button" onClick={() => setConfirmDelete(true)} className="flex w-full items-center gap-4 px-4 py-4 text-left transition hover:bg-red-50/50">
            <Trash2 className="h-6 w-6 shrink-0 text-red-500"/>
            <span>
              <span className="block text-[17px] font-bold text-ink">Delete Account</span>
              <span className="block text-[15px] text-ink-soft">
                Permanently delete your account
              </span>
            </span>
          </button>
          <button type="button" onClick={handleLogout} className="flex w-full items-center gap-4 px-4 py-4 text-left transition hover:bg-red-50/50">
            <LogOut className="h-6 w-6 shrink-0 text-red-500"/>
            <span className="text-[17px] font-bold text-red-500">Log Out</span>
          </button>
        </section>

        <LinkButton to="/farmer/featured" variant="outline" block>
          <Building2 className="h-5 w-5"/>
          Choose a Featured Plan
        </LinkButton>
      </div>

      <Modal open={confirmDelete} onClose={() => setConfirmDelete(false)} title="Delete your account?" footer={<>
            <Button variant="outline" block size="md" onClick={() => setConfirmDelete(false)}>
              Keep account
            </Button>
            <Button variant="danger" block size="md" onClick={handleDelete}>
              Delete
            </Button>
          </>}>
        This clears your listings, orders and saved details from this device. It cannot be undone.
      </Modal>
    </>);
}
