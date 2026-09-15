import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useChats } from '@/context/ChatContext';
import { Logo } from '@/components/ui/Bits';
import { cx } from '@/lib/utils';
import { BUYER_NAV, FARMER_SIDEBAR } from './navItems';
function Count({ n }) {
    if (n <= 0)
        return null;
    return (<span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand-600 px-1.5 text-[11px] font-bold text-white">
      {n}
    </span>);
}
/**
 * Two sidebar treatments, matching the designs:
 * buyers get a pale-green panel of white cards, farmers a plain white rail.
 */
export function DesktopSidebar({ role }) {
    const { logout } = useAuth();
    const { count: cartCount } = useCart();
    const { unreadCount } = useChats();
    const navigate = useNavigate();
    const counts = { cart: cartCount, chats: unreadCount };
    const isBuyer = role === 'buyer';
    const items = isBuyer ? BUYER_NAV : FARMER_SIDEBAR;
    function handleLogout() {
        logout();
        navigate('/welcome', { replace: true });
    }
    return (<aside className={cx('sticky top-0 hidden h-[100dvh] w-[264px] shrink-0 flex-col overflow-y-auto lg:flex', isBuyer ? 'bg-brand-50 p-5' : 'border-r border-ink-line bg-white p-5')}>
      <div className={cx('mb-6 flex justify-center', isBuyer ? 'pt-4' : 'pt-2')}>
        <Logo className={isBuyer ? 'w-[140px]' : 'w-[110px]'}/>
      </div>

      <nav aria-label="Primary" className="flex-1">
        <ul className={cx('flex flex-col', isBuyer ? 'gap-2' : 'gap-1.5')}>
          {items.map((item) => (<li key={item.to}>
              <NavLink to={item.to} end={item.end} className={({ isActive }) => cx('flex items-center gap-3 font-bold transition', isBuyer
                ? cx('rounded-lg px-5 py-4 text-[17px]', isActive
                    ? 'bg-brand-700 text-white shadow-card'
                    : 'bg-white text-brand-600 hover:bg-brand-100/70')
                : cx('rounded-full px-4 py-3 text-[15px]', isActive
                    ? 'bg-brand-700 text-white'
                    : 'text-ink hover:bg-brand-50 hover:text-brand-700'))}>
                {item.icon}
                <span className={isBuyer ? 'flex-1 text-center' : ''}>{item.label}</span>
                {item.badge ? <Count n={counts[item.badge]}/> : null}
              </NavLink>
            </li>))}
        </ul>
      </nav>

      <button type="button" onClick={handleLogout} className="mt-6 flex items-center gap-3 rounded-full px-4 py-3 text-[15px] font-bold text-ink transition hover:bg-brand-50 hover:text-brand-700">
        <LogOut className="h-5 w-5"/>
        Log out
      </button>
    </aside>);
}
