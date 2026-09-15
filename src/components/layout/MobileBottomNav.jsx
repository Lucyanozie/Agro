import { NavLink } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useChats } from '@/context/ChatContext';
import { cx } from '@/lib/utils';
import { navFor } from './navItems';
function Badge({ count }) {
    if (count <= 0)
        return null;
    return (<span className="absolute -right-2 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand-600 px-1 text-[11px] font-bold text-white ring-2 ring-brand-50">
      {count > 9 ? '9+' : count}
    </span>);
}
export function MobileBottomNav({ role }) {
    const { count: cartCount } = useCart();
    const { unreadCount } = useChats();
    const items = navFor(role);
    const counts = { cart: cartCount, chats: unreadCount };
    return (<nav className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-100 bg-brand-50 shadow-nav lg:hidden" aria-label="Primary">
      <ul className="mx-auto flex max-w-lg items-stretch justify-between px-2 pb-[env(safe-area-inset-bottom)] pt-2">
        {items.map((item) => (<li key={item.to} className="flex-1">
            <NavLink to={item.to} end={item.end} className={({ isActive }) => cx('flex flex-col items-center gap-1 rounded-xl px-1 pb-2 pt-1 transition', item.fab ? 'text-ink' : isActive ? 'text-brand-600' : 'text-ink')}>
              {({ isActive }) => (<>
                  <span className={cx('relative flex items-center justify-center', item.fab &&
                    'h-10 w-10 rounded-full bg-brand-600 text-white shadow-lift ring-4 ring-brand-50', !item.fab && isActive && 'text-brand-600')}>
                    {item.icon}
                    {item.badge ? <Badge count={counts[item.badge]}/> : null}
                  </span>
                  <span className={cx('text-[11px] leading-none', isActive && !item.fab ? 'font-bold text-brand-600' : 'font-medium text-ink')}>
                    {item.label}
                  </span>
                </>)}
            </NavLink>
          </li>))}
      </ul>
    </nav>);
}
