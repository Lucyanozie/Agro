import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BadgeCheck, Droplet, Trash2, UploadCloud, Zap } from 'lucide-react';
import { useVerification } from '@/context/VerificationContext';
import { Button } from '@/components/ui/Button';
import { UploadBox } from '@/components/ui/UploadBox';
import { cx } from '@/lib/utils';
import { VerificationLayout } from './VerificationLayout';
const DOC_TYPES = [
    { label: 'Electricity Bill', icon: Zap, tint: 'text-[#3BBF4A]' },
    { label: 'Water Bill', icon: Droplet, tint: 'text-[#3BA9F5]' },
    { label: 'Waste Bill', icon: Trash2, tint: 'text-ink' },
];
const REQUIREMENTS = [
    'Must contain your full name',
    'Must show your residential address',
    'Bill not older than 3 months',
];
export function AddressVerification() {
    const { state, update } = useVerification();
    const navigate = useNavigate();
    const form = state.address;
    const [error, setError] = useState('');
    function submit(e) {
        e.preventDefault();
        if (!form.frontName) {
            setError('Upload the front of your utility bill to continue');
            return;
        }
        update('address', { done: true });
        navigate('/farmer/verify/farming');
    }
    return (<VerificationLayout step={4} title="Verify your Address" backTo="/farmer/verify/identity" footer={<Button block type="submit" form="address-form">
          Continue
        </Button>}>
      <form id="address-form" onSubmit={submit} className="space-y-5">
        <p className="text-[15px] text-ink">Upload a recent utility bill</p>

        <section className="rounded-xl border border-brand-100 bg-brand-50/70 p-4">
          <h2 className="flex items-center gap-2 text-[15px] font-bold text-ink">
            <span className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-brand-600">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-600"/>
            </span>
            Requirements
          </h2>
          <ul className="mt-2 space-y-1.5">
            {REQUIREMENTS.map((r) => (<li key={r} className="flex items-center gap-2 text-[15px] text-ink">
                <BadgeCheck className="h-[18px] w-[18px] shrink-0 text-brand-500"/>
                {r}
              </li>))}
          </ul>
        </section>

        <fieldset>
          <legend className="mb-2 text-[15px] font-bold text-ink">Select Document Type</legend>
          <div className="grid grid-cols-3 gap-3">
            {DOC_TYPES.map(({ label, icon: Icon, tint }) => {
            const active = form.documentType === label;
            return (<button key={label} type="button" aria-pressed={active} onClick={() => update('address', { documentType: label })} className={cx('flex flex-col items-center gap-2 rounded-xl border px-2 py-4 text-center transition', active
                    ? 'border-brand-400 bg-brand-50'
                    : 'border-ink-line bg-white hover:bg-brand-50/40')}>
                  <Icon className={cx('h-7 w-7', tint)}/>
                  <span className="text-[15px] font-medium text-ink">{label}</span>
                </button>);
        })}
          </div>
        </fieldset>

        <div>
          <h2 className="text-[15px] font-bold text-brand-600">Upload Document</h2>

          <p className="mt-3 text-[15px] font-medium text-ink">Front Image</p>
          <UploadBox className="mt-1.5" tone="green" icon={<UploadCloud className="h-9 w-9 text-ink" strokeWidth={1.5}/>} title="Upload front of bill" subtitle="PNG,JPG or PDF (Max 5MB)" value={form.frontName} onChange={(name) => {
            update('address', { frontName: name });
            if (name)
                setError('');
        }}/>
          {error ? <p className="mt-1 text-xs font-medium text-red-600">{error}</p> : null}

          <p className="mt-4 text-[15px] font-medium text-ink">
            Back Image <span className="text-ink-soft">(Optional)</span>
          </p>
          <UploadBox className="mt-1.5" tone="green" icon={<UploadCloud className="h-9 w-9 text-ink" strokeWidth={1.5}/>} title="Upload back (if any)" subtitle="PNG,JPG or PDF (Max 5MB)" value={form.backName} onChange={(name) => update('address', { backName: name })}/>
        </div>
      </form>
    </VerificationLayout>);
}
