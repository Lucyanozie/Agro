import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  Bell,
  HelpCircle,
  Info,
  LogOut,
  MapPin,
  ShoppingBag,
  User,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useOrders } from "@/context/OrderContext";
import { PageHeader } from "@/components/layout/Header";
function Row({ icon, title, subtitle, to }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-4 px-4 py-4 transition hover:bg-brand-50/50"
    >
      <span className="shrink-0">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-[17px] font-bold text-ink">{title}</span>
        {subtitle ? (
          <span className="block text-[15px] text-ink-soft">{subtitle}</span>
        ) : null}
      </span>
      <svg
        viewBox="0 0 20 20"
        className="h-5 w-5 shrink-0 text-ink-soft"
        aria-hidden="true"
      >
        <path
          d="M7.5 4.5 13 10l-5.5 5.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    </Link>
  );
}
function LockIcon() {
  return (
    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50">
      <svg
        viewBox="0 0 20 20"
        className="h-[18px] w-[18px] text-brand-600"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M6 8V6.5a4 4 0 1 1 8 0V8h.5A1.5 1.5 0 0 1 16 9.5v6A1.5 1.5 0 0 1 14.5 17h-9A1.5 1.5 0 0 1 4 15.5v-6A1.5 1.5 0 0 1 5.5 8H6Zm1.5 0h5V6.5a2.5 2.5 0 0 0-5 0V8Z"
        />
      </svg>
    </span>
  );
}
export function BuyerAccountPage() {
  const { user, logout } = useAuth();
  const { buyerOrders } = useOrders();
  const navigate = useNavigate();
  if (!user) return null;
  const active = buyerOrders(user.id).find(
    (o) =>
      o.status === "in-transit" ||
      o.status === "processing" ||
      o.status === "pending",
  );
  return (
    <>
      <PageHeader
        title="Account"
        backTo="/buyer"
        right={
          <span className="flex h-10 w-10 items-center justify-center text-ink">
            <Bell className="h-5 w-5" />
          </span>
        }
      />

      <div className="mx-auto w-full max-w-2xl space-y-4 px-4 pb-12 lg:px-8">
        <section className="card flex items-center gap-4 p-4">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt=""
              className="h-[76px] w-[76px] shrink-0 rounded-full object-cover"
            />
          ) : null}
          <div className="min-w-0">
            <h1 className="truncate text-[22px] font-bold text-ink">
              {user.name}
            </h1>
            <p className="mt-1 text-[17px] font-medium text-ink-soft">
              Lagos,Nigeria
            </p>
            <p className="mt-0.5 text-[17px] font-medium text-ink-soft">
              {user.phone}
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <div className="card overflow-hidden">
            <Row
              icon={<User className="h-6 w-6 text-brand-500" />}
              title="Profile Settings"
              subtitle="Manage your personal informations"
              to="/buyer/account/profile"
            />
          </div>
          <div className="card overflow-hidden">
            <Row
              icon={<LockIcon />}
              title="Login & Security"
              subtitle="Chang password and security settings"
              to="/buyer/account/profile"
            />
          </div>
          <div className="card overflow-hidden">
            <Row
              icon={<ShoppingBag className="h-6 w-6 text-brand-500" />}
              title="My Orders"
              subtitle="Track and manage your order"
              to="/buyer/orders"
            />
          </div>
          <div className="card overflow-hidden">
            <Row
              icon={<MapPin className="h-6 w-6 text-brand-500" />}
              title="Track Order"
              subtitle="Track your current order in real time"
              to={active ? `/buyer/track/${active.id}` : "/buyer/orders"}
            />
          </div>
        </section>

        <section className="card divide-y divide-ink-line overflow-hidden">
          <Row
            icon={<HelpCircle className="h-6 w-6 text-ink" />}
            title="Help & Support"
            subtitle="Get help and contact support"
            to="/buyer/account"
          />
          <Row
            icon={<Info className="h-6 w-6 text-ink" />}
            title="About Agroconnect"
            subtitle="Learn more about our mission"
            to="/buyer/account"
          />
        </section>

        <section className="card overflow-hidden">
          <button
            type="button"
            onClick={() => {
              logout();
              navigate("/welcome", { replace: true });
            }}
            className="flex w-full items-center gap-4 px-4 py-4 text-left transition hover:bg-red-50/50"
          >
            <LogOut className="h-6 w-6 shrink-0 text-red-500" />
            <span className="text-[17px] font-bold text-red-500">Log Out</span>
          </button>
        </section>
      </div>
    </>
  );
}
