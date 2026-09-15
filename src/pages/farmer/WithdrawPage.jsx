import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useOrders } from '@/context/OrderContext';
import { useVerification } from '@/context/VerificationContext';
import { Button } from '@/components/ui/Button';
import { cx, money } from '@/lib/utils';
const QUICK = [5000, 10000, 20000];
export function WithdrawPage() {
    const { user } = useAuth();
    const { earnings, availableBalance, withdraw } = useOrders();
    const { state } = useVerification();
    const navigate = useNavigate();
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');
    const bankName = state.bank.verified ? state.bank.bankName : (user?.bank?.name ?? 'Providus Bank');
    const accountNumber = state.bank.verified
        ? state.bank.accountNumber
        : (user?.bank?.accountNumber ?? '1234567890');
    function submit(e) {
        e.preventDefault();
        const value = Number(amount);
        if (!value) {
            setError('Enter an amount to withdraw');
            return;
        }
        if (value < 1000) {
            setError('The minimum withdrawal is ₦1,000');
            return;
        }
        if (value > availableBalance) {
            setError(`You can withdraw up to ${money(availableBalance)}`);
            return;
        }
        const record = withdraw(value, bankName);
        navigate('/farmer/earnings/withdraw/success', {
            replace: true,
            state: { withdrawalId: record.id },
        });
    }
    return (<form onSubmit={submit} className="mx-auto w-full max-w-2xl px-5 pb-12 pt-6 lg:px-8">
      <h1 className="text-[26px] font-extrabold text-ink">Withdraw Earnings</h1>
      <p className="mt-1 text-[17px] font-medium text-ink-soft">
        Withdraw earnings to your bank account
      </p>

      <section className="mt-5 rounded-xl border border-ink-line p-4">
        <h2 className="text-[15px] font-bold text-ink">Available Balance</h2>
        <p className="mt-1 text-[22px] font-bold text-brand-600">{money(availableBalance)}</p>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-[15px] text-ink-soft">Total Earnings</p>
            <p className="mt-0.5 text-[15px] font-bold text-ink">{money(earnings.totalEarnings)}</p>
          </div>
          <div>
            <p className="text-[15px] text-ink-soft">Total Withdrawn</p>
            <p className="mt-0.5 text-[15px] font-bold text-ink">{money(earnings.withdrawn)}</p>
          </div>
        </div>
      </section>

      <div className="mt-6">
        <label htmlFor="amount" className="block text-[15px] font-bold text-ink">
          Withdrawal Amount
        </label>
        <div className="relative mt-2">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[17px] font-bold text-ink">
            ₦
          </span>
          <input id="amount" inputMode="numeric" placeholder="Enter Amount to withdraw" value={amount ? Number(amount).toLocaleString('en-NG') : ''} onChange={(e) => {
            setAmount(e.target.value.replace(/\D/g, ''));
            setError('');
        }} className={cx('field-box pl-10 text-center', error && 'border-red-300')}/>
        </div>
        {error ? <p className="mt-1 text-xs font-medium text-red-600">{error}</p> : null}

        <div className="mt-3 grid grid-cols-4 gap-3">
          {QUICK.map((q) => (<button key={q} type="button" onClick={() => {
                setAmount(String(q));
                setError('');
            }} className={cx('rounded-lg border py-3 text-[15px] font-bold transition', Number(amount) === q
                ? 'border-brand-600 bg-brand-50 text-brand-700'
                : 'border-ink-line bg-white text-ink hover:bg-brand-50/50')}>
              ₦ {q.toLocaleString('en-NG')}
            </button>))}
          <button type="button" onClick={() => {
            setAmount(String(availableBalance));
            setError('');
        }} className="rounded-lg border border-ink-line py-3 text-[15px] font-bold text-ink transition hover:bg-brand-50/50">
            All
          </button>
        </div>
      </div>

      <section className="mt-6">
        <h2 className="text-[15px] font-bold text-ink">Bank Account</h2>
        <div className="mt-2 flex items-center gap-4 rounded-xl border border-ink-line p-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink-line/50 text-ink-soft">
            <Lock className="h-5 w-5"/>
          </span>
          <div className="min-w-0">
            <p className="truncate text-[15px] font-bold text-ink">{bankName}</p>
            <p className="mt-0.5 text-[15px] tracking-wider text-ink-soft">
              **** **** **** {accountNumber.slice(-4)}
            </p>
          </div>
        </div>
      </section>

      <p className="mt-6 rounded-lg bg-brand-50/70 px-4 py-3 text-center text-[15px] text-ink">
        Withdrawals are processed within 24 hours
      </p>

      <Button type="submit" block className="mt-6">
        withdraw Now
      </Button>
      <Button variant="ghost" block className="mt-2" onClick={() => navigate('/farmer/earnings')}>
        Back
      </Button>
    </form>);
}
