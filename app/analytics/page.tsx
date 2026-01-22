"use client";
import { LogActivityChart } from "@/components/chart-area-interactive";
import { LogStatsCards } from "@/components/log-stat-card";
import { useLog } from "@/hooks/useLog";
import { useUser } from "@clerk/nextjs";
import React from "react";
import { currentPeriodLogs, previousPeriodLogs } from "../data";

const Analytics = () => {
  const { user } = useUser();
  const { logs } = useLog(user?.id);
  return (
    <div className="p-4 lg:px-6 w-full">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <LogActivityChart logs={logs} />
        </div>
        <div className="grid grid-row-4 w-full">
          <LogStatsCards logs={logs} />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
