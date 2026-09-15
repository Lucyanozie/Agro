import { useLocation, useNavigate } from 'react-router-dom';
import { useOrders } from '@/context/OrderContext';
import { Button } from '@/components/ui/Button';
import { SuccessScreen } from '@/components/ui/SuccessMark';
import { longDate, money, shortTime } from '@/lib/utils';
export function WithdrawSuccessPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { earnings } = useOrders();
    const id = location.state?.withdrawalId;
    const record = earnings.withdrawals.find((w) => w.id === id) ?? earnings.withdrawals[0];
    return (<SuccessScreen title="Withdrawal Sucessful" description={<p className="font-bold text-ink-soft">Your withdrawal request has been submitted.</p>} actions={<Button block onClick={() => navigate('/farmer/earnings', { replace: true })}>
          Back to Earnings
        </Button>}>
      {record ? (<section className="rounded-xl border border-ink-line p-5 text-left">
          <h2 className="text-xl font-bold text-ink">Withdrawal Details</h2>
          <dl className="mt-4 space-y-3.5">
            <Row label="Amount">
              <span className="font-bold text-brand-600">{money(record.amount)}</span>
            </Row>
            <Row label="Bank">{record.bank}</Row>
            <Row label="Reference ID">{record.reference}</Row>
            <Row label="Date">
              {longDate(record.date)}-{shortTime(record.date)}
            </Row>
            <Row label="Status">
              <span className="rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-600">
                {record.status}
              </span>
            </Row>
          </dl>
        </section>) : null}
    </SuccessScreen>);
}
function Row({ label, children }) {
    return (<div className="flex items-center justify-between gap-4">
      <dt className="text-[17px] text-ink">{label}</dt>
      <dd className="truncate text-right text-[15px] font-semibold text-ink">{children}</dd>
    </div>);
}
