import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bird, Fish, Rabbit, Sprout, Trees } from 'lucide-react';
import { useVerification } from '@/context/VerificationContext';
import { Button } from '@/components/ui/Button';
import { ChoiceChip } from '@/components/ui/Bits';
import { cx } from '@/lib/utils';
import { VerificationLayout } from './VerificationLayout';
const FARM_TYPES = [
    { label: 'Crop', icon: Sprout, tint: 'bg-brand-50 text-brand-600' },
    { label: 'Livestock', icon: Rabbit, tint: 'bg-ink-line/50 text-ink' },
    { label: 'Fisheries', icon: Fish, tint: 'bg-[#E4F0FB] text-[#2F8FD8]' },
    { label: 'Poultry', icon: Bird, tint: 'bg-brand-50 text-ink' },
    { label: 'Mixed', icon: Trees, tint: 'bg-brand-50 text-brand-600' },
];
const CROPS = ['Maize', 'Rice', 'Tomatoes', 'Vegetables', 'Fruits', 'Others'];
export function FarmingDetails() {
    const { state, update } = useVerification();
    const navigate = useNavigate();
    const form = state.farming;
    const [error, setError] = useState('');
    function toggleCrop(crop) {
        const crops = form.crops.includes(crop)
            ? form.crops.filter((c) => c !== crop)
            : [...form.crops, crop];
        update('farming', { crops });
        if (crops.length)
            setError('');
    }
    function submit(e) {
        e.preventDefault();
        if (!form.farmType) {
            setError('Select the type of farming you do');
            return;
        }
        if (!form.crops.length) {
            setError('Select at least one crop');
            return;
        }
        update('farming', { done: true });
        navigate('/farmer/verify/bank');
    }
    return (<VerificationLayout step={5} title="Tell us about your farming" subtitle="Help buyers know what you produce" backTo="/farmer/verify/address" footer={<Button block type="submit" form="farming-form">
          Continue
        </Button>}>
      <form id="farming-form" onSubmit={submit} className="space-y-6">
        <fieldset>
          <legend className="mb-3 text-[22px] font-bold text-ink">Farm Type</legend>
          <div className="grid grid-cols-3 gap-3">
            {FARM_TYPES.map(({ label, icon: Icon, tint }) => {
            const active = form.farmType === label;
            return (<button key={label} type="button" aria-pressed={active} onClick={() => {
                    update('farming', { farmType: label });
                    setError('');
                }} className={cx('flex flex-col items-center gap-2 rounded-xl border-2 px-2 py-4 transition', active
                    ? 'border-brand-600 bg-white'
                    : 'border-ink-line bg-white hover:bg-brand-50/40')}>
                  <span className={cx('flex h-11 w-11 items-center justify-center rounded-full', tint)}>
                    <Icon className="h-6 w-6"/>
                  </span>
                  <span className={cx('text-[15px] font-bold', active ? 'text-brand-600' : 'text-ink')}>
                    {label}
                  </span>
                </button>);
        })}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-3 text-[22px] font-bold text-ink">
            Crop Details{' '}
            <span className="text-[17px] font-medium text-ink-soft">(Select all that apply)</span>
          </legend>
          <div className="flex flex-wrap gap-3">
            {CROPS.map((crop) => (<ChoiceChip key={crop} active={form.crops.includes(crop)} onClick={() => toggleCrop(crop)}>
                {crop}
              </ChoiceChip>))}
          </div>
        </fieldset>

        {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
      </form>
    </VerificationLayout>);
}
