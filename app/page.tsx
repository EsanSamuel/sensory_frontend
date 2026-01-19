import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { LogDataTable, LogEntry } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { sampleLogs } from "@/components/log";
import { LogStatsCards } from "@/components/log-stat-card";
import { currentPeriodLogs, previousPeriodLogs } from "./data";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <LogStatsCards
            logs={currentPeriodLogs}
            previousPeriodLogs={previousPeriodLogs}
          />
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive />
          </div>
          <LogDataTable data={sampleLogs} />
        </div>
      </div>
    </div>
  );
}
