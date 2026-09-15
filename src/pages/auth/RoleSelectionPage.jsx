import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { cx } from '@/lib/utils';
import { AuthSplit } from './AuthSplit';
const OPTIONS = [
    {
        role: 'farmer',
        title: 'Farmer',
        blurb: 'Sell produce directly to buyers',
        image: '/img/role-farmer.jpg',
    },
    {
        role: 'buyer',
        title: 'Buyer',
        blurb: 'Purchase fresh agricultural product',
        image: '/img/role-buyer.jpg',
    },
];
export function RoleSelectionPage() {
    const { pendingRole, setPendingRole } = useAuth();
    const navigate = useNavigate();
    return (<AuthSplit image="/img/auth-market.jpg" imageAlt="A buyer and a farmer trading fresh vegetables at a farm stall" showBack={false}>
      <h1 className="text-[32px] font-extrabold leading-tight text-ink">
        How would you like
        <br />
        to use AgroConnect?
      </h1>
      <p className="mt-4 text-[17px] text-ink-soft">Select an option to conitinue</p>

      <div className="mt-7 space-y-3" role="radiogroup" aria-label="Account type">
        {OPTIONS.map((option) => {
            const active = pendingRole === option.role;
            return (<button key={option.role} type="button" role="radio" aria-checked={active} onClick={() => setPendingRole(option.role)} onDoubleClick={() => navigate('/register')} className={cx('flex w-full items-center gap-4 rounded-xl border p-3 text-left transition', active
                    ? 'border-brand-300 bg-brand-50/70 shadow-card'
                    : 'border-transparent hover:bg-brand-50/40')}>
              <img src={option.image} alt="" className="h-[68px] w-[104px] shrink-0 rounded-lg object-cover"/>
              <span className="min-w-0">
                <span className="block text-[17px] font-bold text-ink">{option.title}</span>
                <span className="mt-0.5 block text-[15px] leading-snug text-ink-soft">
                  {option.blurb}
                </span>
              </span>
            </button>);
        })}
      </div>

      <div className="mt-10 space-y-3">
        <Button block onClick={() => navigate('/register')}>
          Continue as {pendingRole === 'farmer' ? 'Farmer' : 'Buyer'}
        </Button>
        <Button variant="outline" block onClick={() => navigate('/welcome')}>
          Back
        </Button>
      </div>
    </AuthSplit>);
}
