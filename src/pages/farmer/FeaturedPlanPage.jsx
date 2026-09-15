import { useState } from 'react';
import { BadgeCheck, Sprout } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { PageHeader } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { cx } from '@/lib/utils';
const PLANS = [
    {
        id: 'starter',
        name: 'Featured Starter',
        monthly: 7500,
        blurb: 'Get started and get noticed',
        perks: [
            'Featured on homepage',
            'Showcase your farm',
            'Priority in search results.',
            'Dedicated support',
        ],
        highlight: false,
    },
    {
        id: 'premium',
        name: 'Featured Premium',
        monthly: 12500,
        blurb: 'Get started and get noticed',
        perks: [
            'Top dashboard placement',
            'Featured badge on listings',
            'Social media promotion',
            'Priority in search results',
            'Dedicated account manager',
        ],
        highlight: true,
    },
];
export function FeaturedPlanPage() {
    const { notify } = useToast();
    const [yearly, setYearly] = useState(false);
    function price(monthly) {
        // A year up front saves 20%.
        return yearly ? Math.round(monthly * 12 * 0.8) : monthly;
    }
    return (<>
      <PageHeader title="Choose a Featured Plan" backTo="/farmer/profile" align="left"/>

      <div className="mx-auto w-full max-w-4xl px-4 pb-12 lg:px-8">
        <p className="text-[15px] font-bold text-ink-soft lg:text-center">
          Subscribe to be the first few featured.
        </p>

        <div className="mx-auto mt-5 grid max-w-md grid-cols-2 rounded-xl border border-ink-line p-1" role="tablist" aria-label="Billing period">
          <button role="tab" aria-selected={!yearly} onClick={() => setYearly(false)} className={cx('rounded-lg py-3 text-[17px] font-bold transition', !yearly ? 'bg-white text-ink shadow-card' : 'text-ink-soft')}>
            Monthly
          </button>
          <button role="tab" aria-selected={yearly} onClick={() => setYearly(true)} className={cx('flex items-center justify-center gap-3 rounded-lg py-3 text-[17px] font-bold transition', yearly ? 'bg-white text-ink shadow-card' : 'bg-brand-50/70 text-ink-soft')}>
            Yearly
            <span className="rounded-full bg-brand-100 px-3 py-1 text-sm font-bold text-brand-700">
              Saved 20%
            </span>
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {PLANS.map((plan) => (<article key={plan.id} className={cx('flex flex-col rounded-2xl border p-5', plan.highlight ? 'border-brand-200 bg-brand-50/70' : 'border-ink-line bg-white')}>
              <h2 className="text-[17px] font-bold text-ink">{plan.name}</h2>
              <p className="mt-1.5 text-[22px] font-bold text-ink">
                ₦ {price(plan.monthly).toLocaleString('en-NG')}
                <span className="text-[15px] font-medium text-ink-soft">
                  /{yearly ? 'year' : 'month'}
                </span>
              </p>
              <p className="mt-2 text-[15px] text-ink-soft">{plan.blurb}</p>

              <ul className="mt-5 flex-1 space-y-3">
                {plan.perks.map((perk, i) => (<li key={perk} className="flex items-start gap-3">
                    <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-600"/>
                    <span className={cx('text-[15px] text-ink', i === 0 && plan.highlight && 'font-bold', i === 0 && !plan.highlight && 'font-bold')}>
                      {perk}
                    </span>
                  </li>))}
              </ul>

              <Button className="mt-6" variant={plan.highlight ? 'primary' : 'outline'} size="md" block onClick={() => notify(`${plan.name} selected — billing is not wired up in this demo`)}>
                Choose Plan
              </Button>
            </article>))}
        </div>

        <p className="mt-6 flex items-center gap-4 rounded-xl bg-brand-50/70 p-4 text-[15px] text-ink-soft">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-600">
            <Sprout className="h-6 w-6"/>
          </span>
          You will be among the first few farms featured on AgroConnect after subscription.
        </p>
      </div>
    </>);
}
