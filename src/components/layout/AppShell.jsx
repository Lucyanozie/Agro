import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { DesktopSidebar } from './DesktopSidebar';
import { MobileBottomNav } from './MobileBottomNav';
/** Restores scroll position on navigation, like a native screen push. */
function ScrollReset() {
    const { pathname } = useLocation();
    useEffect(() => {
        document.getElementById('app-scroll')?.scrollTo({ top: 0 });
        window.scrollTo({ top: 0 });
    }, [pathname]);
    return null;
}
/**
 * Role-aware chrome: a sidebar from `lg` up, a bottom bar below it.
 * Visiting the wrong role's area redirects rather than rendering broken nav.
 */
export function AppShell({ role }) {
    const { user, isAuthed } = useAuth();
    const location = useLocation();
    if (!isAuthed) {
        return <Navigate to="/login" replace state={{ from: location.pathname }}/>;
    }
    if (user && user.role !== role) {
        return <Navigate to={user.role === 'farmer' ? '/farmer' : '/buyer'} replace/>;
    }
    return (<div className="flex min-h-[100dvh] bg-white">
      <ScrollReset />
      <DesktopSidebar role={role}/>
      <div id="app-scroll" className="flex min-w-0 flex-1 flex-col pb-[76px] lg:pb-0">
        <Outlet />
      </div>
      <MobileBottomNav role={role}/>
    </div>);
}
