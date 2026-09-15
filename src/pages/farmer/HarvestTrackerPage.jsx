import { Link } from 'react-router-dom';
import { useProducts } from '@/context/ProductContext';
import { PageHeader } from '@/components/layout/Header';
import { HarvestCalendar } from '@/components/farmer/HarvestCalendar';
import { WeatherWidget } from '@/components/farmer/WeatherWidget';
import { HARVESTS } from '@/data/seed';
import { longDate } from '@/lib/utils';
export function HarvestTrackerPage() {
    const { products } = useProducts();
    const upcoming = HARVESTS[0];
    const rest = HARVESTS.slice(1);
    function productLink(name) {
        const match = products.find((p) => p.name.toLowerCase().includes(name.toLowerCase().split(' ')[0]));
        return match ? `/farmer/products/${match.id}` : '/farmer/marketplace';
    }
    return (<>
      <PageHeader title="Harvest Tracker" backTo="/farmer"/>

      <div className="mx-auto w-full max-w-3xl space-y-4 px-4 pb-12 lg:px-8">
        <section className="rounded-xl border border-brand-100 bg-brand-50/70 p-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-[15px] font-bold text-ink">Upcoming Harvest</h2>
            <Link to="#calendar" className="text-[15px] font-semibold text-brand-600 hover:underline">
              View Calendar
            </Link>
          </div>

          <div className="mt-3 flex items-center gap-4">
            <img src={upcoming.image} alt="" className="h-[72px] w-[92px] shrink-0 rounded-lg bg-white object-contain p-1"/>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-bold text-ink">{upcoming.productName}</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white">
                  <div className="h-full rounded-full bg-brand-600 transition-[width] duration-700" style={{ width: `${upcoming.progress}%` }}/>
                </div>
                <span className="shrink-0 text-[15px] font-bold text-ink">
                  {upcoming.progress}%
                </span>
              </div>
            </div>
          </div>
        </section>

        <div id="calendar">
          <HarvestCalendar harvestDates={HARVESTS.map((h) => h.date)} initialMonth={new Date(upcoming.date)}/>
        </div>

        <WeatherWidget />

        <section>
          <h2 className="mb-3 text-[17px] font-bold text-ink">Next up</h2>
          <ul className="space-y-3">
            {rest.map((h) => (<li key={h.id}>
                <Link to={productLink(h.productName)} className="flex items-center gap-4 rounded-xl border border-ink-line p-3 transition hover:border-brand-300">
                  <img src={h.image} alt="" className="h-[62px] w-[78px] shrink-0 rounded-lg object-contain"/>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[17px] font-bold text-ink">{h.productName}</p>
                    <p className="mt-0.5 text-[15px] text-ink-mute">{longDate(h.date)}</p>
                  </div>
                  <span className="shrink-0 text-[15px] font-bold text-brand-600">
                    {h.progress}%
                  </span>
                </Link>
              </li>))}
          </ul>
        </section>
      </div>
    </>);
}
