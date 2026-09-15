import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays } from 'lucide-react';
import { useVerification } from '@/context/VerificationContext';
import { Button } from '@/components/ui/Button';
import { SelectField, TextField } from '@/components/ui/Field';
import { LGAS, NIGERIAN_STATES } from '@/data/seed';
import { cx } from '@/lib/utils';
import { VerificationLayout } from './VerificationLayout';
const METHODS = [
    { value: 'NIN Verification', recommended: true },
    { value: 'International Passport', recommended: false },
    { value: "Driver's License", recommended: false },
];
export function ProfileSetup() {
    const { state, update } = useVerification();
    const navigate = useNavigate();
    const form = state.profile;
    const [errors, setErrors] = useState({});
    function submit(e) {
        e.preventDefault();
        const next = {};
        if (form.fullName.trim().length < 2)
            next.fullName = 'Enter your full name as it appears on your NIN';
        if (!form.dob)
            next.dob = 'Select your date of birth';
        if (!form.gender)
            next.gender = 'Select your gender';
        if (!/^\d{10}$/.test(form.phone.replace(/\D/g, '').replace(/^0/, '')))
            next.phone = 'Enter a valid 10-digit number';
        if (form.address.trim().length < 5)
            next.address = 'Enter your residential address';
        if (!form.state)
            next.state = 'Select your state';
        if (!form.lga)
            next.lga = 'Select your LGA';
        setErrors(next);
        if (Object.keys(next).length)
            return;
        update('profile', { done: true });
        navigate('/farmer/verify/identity');
    }
    const lgaOptions = LGAS[form.state] ?? ['Central', 'North', 'South', 'East', 'West'];
    return (<VerificationLayout step={2} title="Let's set up your profile" subtitle="Your information is safe with us" backTo="/farmer" footer={<Button block type="submit" form="profile-form">
          Continue
        </Button>}>
      <form id="profile-form" onSubmit={submit} noValidate className="space-y-4">
        <TextField shape="pill" label={<>
              Full Name <span className="text-sm font-normal text-ink-soft">(as on NIN)</span>
            </>} placeholder="Enter full Name" value={form.fullName} onChange={(e) => update('profile', { fullName: e.target.value })} error={errors.fullName}/>

        <div className="grid grid-cols-2 gap-4">
          <TextField shape="pill" type="date" label={<span className="flex items-center gap-1.5">
                Date of Birth <CalendarDays className="h-4 w-4 text-ink-soft"/>
              </span>} value={form.dob} onChange={(e) => update('profile', { dob: e.target.value })} error={errors.dob}/>
          <SelectField shape="pill" label="Gender" placeholder="Select Gender" options={['Female', 'Male', 'Prefer not to say']} value={form.gender} onChange={(e) => update('profile', { gender: e.target.value })} error={errors.gender}/>
        </div>

        <div>
          <label htmlFor="phone" className="mb-1.5 block text-[15px] font-semibold text-ink">
            Phone Number
          </label>
          <div className="flex gap-3">
            <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-ink-line px-4 text-[15px] font-medium text-ink">
              <span className="flex h-4 w-6 overflow-hidden rounded-[2px]" aria-hidden="true">
                <span className="h-full w-1/3 bg-[#008751]"/>
                <span className="h-full w-1/3 bg-white"/>
                <span className="h-full w-1/3 bg-[#008751]"/>
              </span>
              +234
            </span>
            <div className="min-w-0 flex-1">
              <input id="phone" type="tel" inputMode="numeric" placeholder="Enter Phone Number" value={form.phone} onChange={(e) => update('profile', { phone: e.target.value })} className={cx('field', errors.phone && 'border-red-300')}/>
              {errors.phone ? (<p className="mt-1 text-xs font-medium text-red-600">{errors.phone}</p>) : null}
            </div>
          </div>
        </div>

        <TextField shape="pill" label="Residential Address" placeholder="Enter Address" value={form.address} onChange={(e) => update('profile', { address: e.target.value })} error={errors.address}/>

        <div className="grid grid-cols-2 gap-4">
          <SelectField shape="pill" label="State" placeholder="Enter State" options={NIGERIAN_STATES} value={form.state} onChange={(e) => update('profile', { state: e.target.value, lga: '' })} error={errors.state}/>
          <SelectField shape="pill" label="LGA" placeholder="Select LGA" options={lgaOptions} value={form.lga} onChange={(e) => update('profile', { lga: e.target.value })} error={errors.lga}/>
        </div>

        <fieldset>
          <legend className="text-[19px] font-bold text-ink">Verification Method</legend>
          <p className="mt-0.5 text-[15px] text-ink-soft">
            Choose preferred means of identification
          </p>
          <div className="mt-3 space-y-2.5">
            {METHODS.map((m) => (<label key={m.value} className={cx('flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition', form.method === m.value
                ? 'border-brand-400 bg-brand-50/50'
                : 'border-ink-line hover:bg-brand-50/30')}>
                <input type="radio" name="method" checked={form.method === m.value} onChange={() => update('profile', { method: m.value })} className="h-5 w-5 accent-brand-600"/>
                <span className="flex-1 text-[15px] font-medium text-ink">{m.value}</span>
                {m.recommended ? (<span className="rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600">
                    Recommended
                  </span>) : null}
              </label>))}
          </div>
        </fieldset>
      </form>
    </VerificationLayout>);
}
