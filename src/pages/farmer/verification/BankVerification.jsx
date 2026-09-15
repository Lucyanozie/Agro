import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BadgeCheck, CreditCard, Landmark, Loader2, User } from 'lucide-react';
import { useVerification } from '@/context/VerificationContext';
import { Button } from '@/components/ui/Button';
import { SelectField } from '@/components/ui/Field';
import { NIGERIAN_BANKS } from '@/data/seed';
import { cx } from '@/lib/utils';
import { VerificationLayout } from './VerificationLayout';
/**
 * Stand-in for a bank name-enquiry call. Derives a stable, plausible account
 * name from the digits so the same number always resolves the same way.
 */
const NAME_POOL = ['Aliu Musa', 'Musa Aliu Ibrahim', 'A. M. Aliu'];
function resolveAccountName(accountNumber) {
    const sum = accountNumber.split('').reduce((total, d) => total + Number(d), 0);
    return NAME_POOL[sum % NAME_POOL.length];
}
export function BankVerification() {
    const { state, update } = useVerification();
    const navigate = useNavigate();
    const form = state.bank;
    const [checking, setChecking] = useState(false);
    const [error, setError] = useState('');
    const canVerify = Boolean(form.bankName) && /^\d{10}$/.test(form.accountNumber);
    function verify() {
        if (!form.bankName) {
            setError('Select your bank first');
            return;
        }
        if (!/^\d{10}$/.test(form.accountNumber)) {
            setError('Enter a valid 10-digit account number');
            return;
        }
        setError('');
        setChecking(true);
        window.setTimeout(() => {
            update('bank', { accountName: resolveAccountName(form.accountNumber), verified: true });
            setChecking(false);
        }, 1100);
    }
    function submit() {
        if (!form.verified) {
            setError('Verify your account before continuing');
            return;
        }
        update('bank', { done: true });
        navigate('/farmer/verify/security');
    }
    return (<VerificationLayout title="Verify your Bank Account" subtitle="This account will receive your payment" backTo="/farmer/verify/farming" footer={<Button block onClick={submit} disabled={!form.verified}>
          Continue
        </Button>}>
      <div className="space-y-5">
        <section className="space-y-3 rounded-xl border border-brand-100 bg-brand-50/60 p-4">
          <SelectField shape="pill" label="Bank Name" placeholder="Select your Bank" options={NIGERIAN_BANKS} value={form.bankName} onChange={(e) => {
            update('bank', { bankName: e.target.value, verified: false, accountName: '' });
            setError('');
        }}/>
          <div>
            <label htmlFor="account" className="mb-1.5 block text-[15px] font-semibold text-ink">
              Account Number
            </label>
            <input id="account" inputMode="numeric" maxLength={10} placeholder="Enter Account Number" value={form.accountNumber} onChange={(e) => {
            update('bank', {
                accountNumber: e.target.value.replace(/\D/g, '').slice(0, 10),
                verified: false,
                accountName: '',
            });
            setError('');
        }} className={cx('field', error && !form.verified && 'border-red-300')}/>
            <p className="mt-1 text-[11px] text-ink-soft">Enter the 10-digit account number</p>
          </div>
        </section>

        {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

        <Button block onClick={verify} disabled={!canVerify || checking}>
          {checking ? (<>
              <Loader2 className="h-5 w-5 animate-spin"/>
              Verifying…
            </>) : (<>
              <BadgeCheck className="h-5 w-5"/>
              Verify Account
            </>)}
        </Button>

        {form.verified ? (<section className="rounded-xl border border-brand-100 bg-brand-50/60 p-4 animate-slide-up">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-700 text-white">
                <BadgeCheck className="h-5 w-5"/>
              </span>
              <div>
                <h2 className="text-[17px] font-bold text-brand-600">
                  Account Verified Successfully
                </h2>
                <p className="text-xs text-ink-soft">
                  The account details below will recieve your payments.
                </p>
              </div>
            </div>

            <dl className="mt-4 space-y-3 text-[15px]">
              <Row icon={<User className="h-5 w-5 text-brand-600"/>} label="Account Name">
                {form.accountName}
              </Row>
              <Row icon={<Landmark className="h-5 w-5 text-brand-600"/>} label="Bank">
                {form.bankName}
              </Row>
              <Row icon={<CreditCard className="h-5 w-5 text-brand-600"/>} label="Account Number">
                {form.accountNumber}
              </Row>
            </dl>
          </section>) : null}
      </div>
    </VerificationLayout>);
}
function Row({ icon, label, children, }) {
    return (<div className="flex items-center justify-between gap-4">
      <dt className="flex items-center gap-2 font-medium text-ink">
        {icon}
        {label}
      </dt>
      <dd className="truncate text-right font-semibold text-ink">{children}</dd>
    </div>);
}
