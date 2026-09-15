import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useVerification } from '@/context/VerificationContext';
import { Button } from '@/components/ui/Button';
import { RadialGauge, scoreCaption } from '@/components/ui/RadialGauge';
import { cx } from '@/lib/utils';
import { VerificationLayout } from './VerificationLayout';
function Tick({ done }) {
    return (<svg viewBox="0 0 20 20" className={cx('h-5 w-5', done ? 'text-brand-600' : 'text-ink-line')}>
      <path fill="currentColor" d="m10 1.2 1.9 1.5 2.4-.3 1 2.2 2.2 1-.3 2.4L18.8 10l-1.6 1.9.3 2.4-2.2 1-1 2.2-2.4-.3L10 18.8l-1.9-1.6-2.4.3-1-2.2-2.2-1 .3-2.4L1.2 10l1.6-1.9-.3-2.4 2.2-1 1-2.2 2.4.3L10 1.2Z"/>
      <path fill="#fff" d="m8.9 12.7-2.4-2.4 1.1-1.1 1.3 1.3 3.5-3.5 1.1 1.1-4.6 4.6Z"/>
    </svg>);
}
export function ReviewVerification() {
    const { state, score, submit } = useVerification();
    const { updateUser } = useAuth();
    const navigate = useNavigate();
    const checks = [
        { label: 'NIN Verification', done: state.identity.done },
        { label: 'Farm Verification', done: state.farming.done },
        { label: 'Address Verification', done: state.address.done },
        { label: 'Bank Verification', done: state.bank.done },
    ];
    const scores = [
        { label: 'Identity', value: state.identity.done ? 100 : 0 },
        { label: 'Farm', value: state.farming.done ? 95 : 0 },
        { label: 'Address', value: state.address.done ? 100 : 0 },
        { label: 'Banking', value: state.bank.done ? 100 : 0 },
    ];
    function approve() {
        submit();
        updateUser({ verified: true, verificationScore: score });
        navigate('/farmer/verify/approved', { replace: true });
    }
    return (<VerificationLayout title="Review Your Verifications" subtitle="Please review your details before submission" backTo="/farmer/verify/security" footer={<Button block onClick={approve}>
          Submit for Approval
        </Button>}>
      <div className="space-y-6">
        <ul className="space-y-3 rounded-xl bg-brand-50/60 p-4">
          {checks.map((c) => (<li key={c.label} className="flex items-center justify-between gap-3 rounded-lg border border-ink-line bg-white px-4 py-3">
              <span className="text-[15px] text-ink">{c.label}</span>
              <span className="flex items-center gap-2">
                <span className={cx('text-[15px] font-medium', c.done ? 'text-brand-600' : 'text-ink-mute')}>
                  {c.done ? 'Verified' : 'Pending'}
                </span>
                <Tick done={c.done}/>
              </span>
            </li>))}
        </ul>

        <section>
          <h2 className="mb-2 text-[15px] font-bold text-ink">Verification Score</h2>
          <div className="card flex flex-col items-center gap-6 p-6 sm:flex-row sm:justify-around">
            <div className="text-center">
              <RadialGauge value={score} size={160} stroke={12}/>
              <p className="mt-2 text-[17px] font-bold text-ink">{scoreCaption(score)}</p>
            </div>
            <dl className="w-full max-w-[220px] space-y-3">
              {scores.map((s) => (<div key={s.label} className="flex items-center justify-between gap-6">
                  <dt className="text-[15px] text-ink">{s.label}</dt>
                  <dd className="text-[15px] font-bold text-ink">{s.value}%</dd>
                </div>))}
            </dl>
          </div>
        </section>
      </div>
    </VerificationLayout>);
}
