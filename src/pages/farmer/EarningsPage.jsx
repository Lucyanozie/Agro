import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrders } from "@/context/OrderContext";
import { Button } from "@/components/ui/Button";
import { money } from "@/lib/utils";
import { MetricLayout } from "./MetricLayout";
export function seriesFor(period) {
  return [];
}
export function EarningsPage() {
  const { earnings, availableBalance } = useOrders();
  const navigate = useNavigate();
  const [period, setPeriod] = useState("This Month");
  const data = useMemo(() => seriesFor(period), [period]);
  return (
    <MetricLayout
      title="Earnings"
      backTo="/farmer"
      period={period}
      onPeriodChange={setPeriod}
      metricLabel="Total Earnings"
      metricValue={money(earnings.totalEarnings)}
      delta={0}
      data={data}
      footer={
        <div className="space-y-3">
          <Button block onClick={() => navigate("/farmer/earnings/withdraw")}>
            Withdraw Earnings
          </Button>
          <p className="text-center text-[15px] text-ink-soft">
            Available to withdraw:{" "}
            <span className="font-bold text-ink">
              {money(availableBalance)}
            </span>
          </p>
        </div>
      }
    />
  );
}
