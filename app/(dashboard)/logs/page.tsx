"use client";

import React, { useState, useMemo } from "react";
import { LogDataTable } from "@/components/data-table";
import { LogExportButton } from "@/components/log-export";
import { useLog } from "@/hooks/useLog";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  IconActivity,
  IconCalendar,
  IconPlayerPlay,
  IconPlayerStop,
  IconX,
} from "@tabler/icons-react";

export default function LogsPage() {
  const { user } = useUser();
  const [isLiveTail, setIsLiveTail] = useState(false);
  const { logs } = useLog(user?.id, undefined, isLiveTail ? 2000 : 5000);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Filter logs by date range
  const filteredLogs = useMemo(() => {
    if (!logs) return [];
    let result = [...logs];

    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      result = result.filter((log: any) => new Date(log.timestamp) >= start);
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      result = result.filter((log: any) => new Date(log.timestamp) <= end);
    }

    return result;
  }, [logs, startDate, endDate]);

  const hasDateFilter = startDate || endDate;

  const clearDateFilter = () => {
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="flex flex-1 flex-col">
      {/* Page Header */}
      <div className="flex flex-col gap-4 px-4 py-5 lg:px-6">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold lg:text-3xl">Logs</h1>
            <p className="text-sm text-muted-foreground">
              View, filter, and export your application logs
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Live Tail Toggle */}
            <Button
              variant={isLiveTail ? "default" : "outline"}
              size="sm"
              onClick={() => setIsLiveTail(!isLiveTail)}
              className={
                isLiveTail
                  ? "bg-green-600 text-white hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700"
                  : ""
              }
            >
              {isLiveTail ? (
                <>
                  <IconPlayerStop className="size-4" />
                  <span className="hidden sm:inline">Stop</span>
                  <Badge
                    variant="secondary"
                    className="ml-1 animate-pulse bg-green-500/20 px-1.5 py-0 text-[10px] text-green-100"
                  >
                    <span className="mr-1 inline-block size-1.5 animate-pulse rounded-full bg-green-300" />
                    LIVE
                  </Badge>
                </>
              ) : (
                <>
                  <IconPlayerPlay className="size-4" />
                  <span className="hidden sm:inline">Live Tail</span>
                </>
              )}
            </Button>

            {/* Export */}
            <LogExportButton logs={filteredLogs} />
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
            <IconCalendar className="size-4" />
            <span>Date Range:</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <Label htmlFor="start-date" className="text-xs text-muted-foreground">
                From
              </Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-8 w-auto text-xs"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <Label htmlFor="end-date" className="text-xs text-muted-foreground">
                To
              </Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-8 w-auto text-xs"
              />
            </div>
            {hasDateFilter && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearDateFilter}
                className="h-8 gap-1 text-xs text-muted-foreground"
              >
                <IconX className="size-3.5" />
                Clear
              </Button>
            )}
          </div>
          {hasDateFilter && (
            <Badge variant="secondary" className="text-xs">
              {filteredLogs.length} logs in range
            </Badge>
          )}
        </div>
      </div>

      {/* Live Tail Banner */}
      {isLiveTail && (
        <div className="mx-4 mb-3 flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/5 px-4 py-2.5 lg:mx-6">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-green-500" />
          </span>
          <span className="text-sm font-medium text-green-700 dark:text-green-400">
            Live tail is active
          </span>
          <span className="text-xs text-green-600/70 dark:text-green-400/60">
            — New logs will appear automatically
          </span>
        </div>
      )}

      {/* Data Table */}
      <LogDataTable data={filteredLogs} />
    </div>
  );
}
