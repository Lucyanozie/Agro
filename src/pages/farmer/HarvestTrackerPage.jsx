import { CalendarDays } from "lucide-react";
import { PageHeader } from "@/components/layout/Header";
import { EmptyState } from "@/components/ui/Bits";
export function HarvestTrackerPage() {
  return (
    <>
      <PageHeader title="Harvest Tracker" backTo="/farmer" />
      <div className="mx-auto w-full max-w-3xl px-4 pb-12 lg:px-8">
        <EmptyState
          icon={<CalendarDays className="h-7 w-7" />}
          title="No harvests recorded"
          description="Add a harvest to see it on your calendar."
        />
      </div>
    </>
  );
}
