"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { LogActivityChart } from "@/components/chart-area-interactive";
import { LogDataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { LogStatsCards } from "@/components/log-stat-card";
import { currentPeriodLogs, previousPeriodLogs } from "../../data";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useProject } from "@/hooks/useProject";
import { useLog } from "@/hooks/useLog";

export default function Page() {
  const { projectId } = useParams();
  const { project } = useProject(projectId as string);
  const { projectLogs } = useLog("", projectId as string);
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex justify-between items-center  pt-5 px-5">
        {" "}
        <h1 className="font-bold  text-2xl">{project?.project_name}</h1>
      </div>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <LogStatsCards
            logs={projectLogs}
            //previousPeriodLogs={previousPeriodLogs}
          />
          <div className="px-4 lg:px-6">
            <LogActivityChart logs={projectLogs} />
          </div>
          <LogDataTable data={projectLogs} />
        </div>
      </div>
    </div>
  );
}
