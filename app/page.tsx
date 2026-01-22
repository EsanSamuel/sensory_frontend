"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { LogActivityChart } from "@/components/chart-area-interactive";
import { LogDataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { LogStatsCards } from "@/components/log-stat-card";
import { currentPeriodLogs, previousPeriodLogs } from "./data";
import { useUser } from "@clerk/nextjs";
import { useLog } from "@/hooks/useLog";

export interface ILog {
  _id: string;
  level: "INFO" | "ERROR" | "WARN" | "DEBUG";
  timestamp: string;
  project: string;
  service: string;
  message: string;
  runtime: {
    file: string;
    line: number;
    fn: string;
  };
}

export default function Page() {
  const { user } = useUser();
  const { logs } = useLog(user?.id);
  console.log("logs:", logs);
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <LogStatsCards logs={logs} />
          <div className="px-4 lg:px-6">
            <LogActivityChart logs={logs} />
          </div>
          <LogDataTable data={logs} />
        </div>
      </div>
    </div>
  );
}
