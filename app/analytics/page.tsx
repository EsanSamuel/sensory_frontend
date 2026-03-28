"use client";

import React, { useMemo } from "react";
import { LogActivityChart } from "@/components/chart-area-interactive";
import { LogStatsCards } from "@/components/log-stat-card";
import { useLog } from "@/hooks/useLog";
import { useUser } from "@clerk/nextjs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  IconAlertTriangle,
  IconCode,
  IconFileCode,
  IconInfoCircle,
  IconServer,
  IconTrendingUp,
  IconClock,
} from "@tabler/icons-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

interface ILog {
  _id: string;
  level: "INFO" | "ERROR" | "WARN" | "DEBUG";
  timestamp: string;
  project: { project_name: string } | string;
  project_id?: string;
  service: string;
  message: string;
  runtime: {
    file: string;
    line: number;
    fn: string;
  };
}

const LEVEL_COLORS = {
  ERROR: "hsl(0, 84%, 60%)",
  WARN: "hsl(38, 92%, 50%)",
  INFO: "hsl(221, 83%, 53%)",
  DEBUG: "hsl(271, 91%, 65%)",
};

const pieChartConfig = {
  error: { label: "Errors", color: LEVEL_COLORS.ERROR },
  warn: { label: "Warnings", color: LEVEL_COLORS.WARN },
  info: { label: "Info", color: LEVEL_COLORS.INFO },
  debug: { label: "Debug", color: LEVEL_COLORS.DEBUG },
} satisfies ChartConfig;

const barChartConfig = {
  count: { label: "Logs", color: "var(--primary)" },
} satisfies ChartConfig;

export default function Analytics() {
  const { user } = useUser();
  const { logs } = useLog(user?.id);

  const safeLogs: ILog[] = Array.isArray(logs) ? logs : [];

  // Log level distribution for pie chart
  const levelDistribution = useMemo(() => {
    const counts = { ERROR: 0, WARN: 0, INFO: 0, DEBUG: 0 };
    safeLogs.forEach((log) => {
      if (counts[log.level] !== undefined) counts[log.level]++;
    });
    return [
      { name: "Errors", value: counts.ERROR, fill: LEVEL_COLORS.ERROR },
      { name: "Warnings", value: counts.WARN, fill: LEVEL_COLORS.WARN },
      { name: "Info", value: counts.INFO, fill: LEVEL_COLORS.INFO },
      { name: "Debug", value: counts.DEBUG, fill: LEVEL_COLORS.DEBUG },
    ].filter((d) => d.value > 0);
  }, [safeLogs]);

  // Top services by log count
  const topServices = useMemo(() => {
    const serviceCounts: Record<string, number> = {};
    safeLogs.forEach((log) => {
      const svc = log.service || "unknown";
      serviceCounts[svc] = (serviceCounts[svc] || 0) + 1;
    });
    return Object.entries(serviceCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [safeLogs]);

  // Hourly distribution for bar chart
  const hourlyDistribution = useMemo(() => {
    const hours: Record<number, number> = {};
    for (let i = 0; i < 24; i++) hours[i] = 0;
    safeLogs.forEach((log) => {
      try {
        const hour = new Date(log.timestamp).getHours();
        hours[hour]++;
      } catch {}
    });
    return Object.entries(hours).map(([hour, count]) => ({
      hour: `${String(hour).padStart(2, "0")}:00`,
      count,
    }));
  }, [safeLogs]);

  // Most errored files
  const topErrorFiles = useMemo(() => {
    const fileCounts: Record<string, number> = {};
    safeLogs
      .filter((log) => log.level === "ERROR")
      .forEach((log) => {
        const fileName = log.runtime.file.split(/[/\\]/).pop() || log.runtime.file;
        fileCounts[fileName] = (fileCounts[fileName] || 0) + 1;
      });
    return Object.entries(fileCounts)
      .map(([file, count]) => ({ file, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [safeLogs]);

  // Recent errors
  const recentErrors = useMemo(() => {
    return safeLogs
      .filter((log) => log.level === "ERROR")
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      )
      .slice(0, 5);
  }, [safeLogs]);

  // Peak hour
  const peakHour = useMemo(() => {
    if (hourlyDistribution.length === 0) return null;
    return hourlyDistribution.reduce((max, curr) =>
      curr.count > max.count ? curr : max,
    );
  }, [hourlyDistribution]);

  // Avg logs per day
  const avgLogsPerDay = useMemo(() => {
    if (safeLogs.length === 0) return 0;
    const dates = new Set(
      safeLogs.map((l) => new Date(l.timestamp).toISOString().split("T")[0]),
    );
    return Math.round(safeLogs.length / Math.max(dates.size, 1));
  }, [safeLogs]);

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col gap-6 px-4 py-5 lg:px-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold lg:text-3xl">Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Deep insights into your application's logging patterns
          </p>
        </div>

        {/* Stat Cards */}
        <LogStatsCards logs={logs} />

        {/* Quick Insight Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1.5">
                <IconClock className="size-3.5" />
                Peak Activity
              </CardDescription>
              <CardTitle className="text-xl font-bold tabular-nums">
                {peakHour ? peakHour.hour : "—"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                {peakHour
                  ? `${peakHour.count} logs at this hour`
                  : "No data available"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1.5">
                <IconTrendingUp className="size-3.5" />
                Avg Logs / Day
              </CardDescription>
              <CardTitle className="text-xl font-bold tabular-nums">
                {avgLogsPerDay.toLocaleString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Across{" "}
                {
                  new Set(
                    safeLogs.map(
                      (l) =>
                        new Date(l.timestamp).toISOString().split("T")[0],
                    ),
                  ).size
                }{" "}
                active days
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1.5">
                <IconServer className="size-3.5" />
                Active Services
              </CardDescription>
              <CardTitle className="text-xl font-bold tabular-nums">
                {new Set(safeLogs.map((l) => l.service).filter(Boolean)).size}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                {topServices.length > 0
                  ? `Top: ${topServices[0].name}`
                  : "No services detected"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Activity Chart */}
        <LogActivityChart logs={logs} />

        {/* Two-Column: Pie Chart + Hourly Bar Chart */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Log Level Distribution Pie */}
          <Card>
            <CardHeader>
              <CardTitle>Log Level Distribution</CardTitle>
              <CardDescription>
                Breakdown of logs by severity level
              </CardDescription>
            </CardHeader>
            <CardContent>
              {levelDistribution.length > 0 ? (
                <div className="flex flex-col items-center gap-4 sm:flex-row">
                  <ChartContainer
                    config={pieChartConfig}
                    className="aspect-square h-[200px]"
                  >
                    <PieChart>
                      <Pie
                        data={levelDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                        strokeWidth={2}
                        stroke="var(--background)"
                      >
                        {levelDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ChartContainer>
                  <div className="flex flex-col gap-2">
                    {levelDistribution.map((d) => (
                      <div
                        key={d.name}
                        className="flex items-center gap-2 text-sm"
                      >
                        <span
                          className="inline-block size-3 rounded-full"
                          style={{ backgroundColor: d.fill }}
                        />
                        <span className="text-muted-foreground">{d.name}</span>
                        <span className="ml-auto font-mono font-semibold">
                          {d.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
                  No log data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Hourly Activity Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Hourly Activity</CardTitle>
              <CardDescription>
                Log volume distribution across hours of the day
              </CardDescription>
            </CardHeader>
            <CardContent>
              {safeLogs.length > 0 ? (
                <ChartContainer
                  config={barChartConfig}
                  className="h-[200px] w-full"
                >
                  <BarChart data={hourlyDistribution}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="hour"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={4}
                      tickFormatter={(v) => v.replace(":00", "h")}
                      fontSize={10}
                      interval={2}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={4}
                      fontSize={10}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="count"
                      fill="var(--color-count)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              ) : (
                <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
                  No log data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Two-Column: Top Services + Top Error Files */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Service Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconServer className="size-4 text-muted-foreground" />
                Top Services
              </CardTitle>
              <CardDescription>
                Services generating the most logs
              </CardDescription>
            </CardHeader>
            <CardContent>
              {topServices.length > 0 ? (
                <div className="space-y-3">
                  {topServices.map((svc, i) => {
                    const maxCount = topServices[0].count;
                    const pct = maxCount > 0 ? (svc.count / maxCount) * 100 : 0;
                    return (
                      <div key={svc.name} className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{svc.name}</span>
                          <span className="font-mono text-xs text-muted-foreground">
                            {svc.count.toLocaleString()}
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex h-[150px] items-center justify-center text-sm text-muted-foreground">
                  No service data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Error-Producing Files */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconFileCode className="size-4 text-muted-foreground" />
                Error Hotspots
              </CardTitle>
              <CardDescription>
                Files producing the most errors
              </CardDescription>
            </CardHeader>
            <CardContent>
              {topErrorFiles.length > 0 ? (
                <div className="space-y-2">
                  {topErrorFiles.map((f, i) => (
                    <div
                      key={f.file}
                      className="flex items-center gap-3 rounded-lg border px-3 py-2.5"
                    >
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-xs font-bold text-red-600 dark:text-red-400">
                        {i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-mono text-sm">{f.file}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className="shrink-0 border-red-500/30 text-red-600 dark:text-red-400"
                      >
                        {f.count} errors
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-[150px] items-center justify-center text-sm text-muted-foreground">
                  <div className="text-center">
                    <IconAlertTriangle className="mx-auto mb-2 size-8 text-green-500/50" />
                    <p>No errors found — great job!</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Errors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconAlertTriangle className="size-4 text-red-500" />
              Recent Errors
            </CardTitle>
            <CardDescription>
              The latest error events across all services
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentErrors.length > 0 ? (
              <div className="space-y-2">
                {recentErrors.map((log) => {
                  const projectName =
                    typeof log.project === "object" && log.project
                      ? log.project.project_name
                      : typeof log.project === "string"
                        ? log.project
                        : "—";
                  return (
                    <div
                      key={log._id}
                      className="flex items-start gap-3 rounded-lg border px-4 py-3"
                    >
                      <div className="mt-0.5 shrink-0">
                        <Badge
                          variant="outline"
                          className="border-red-500/30 bg-red-500/10 px-1.5 py-0 font-mono text-[10px] text-red-600 dark:text-red-400"
                        >
                          ERROR
                        </Badge>
                      </div>
                      <div className="min-w-0 flex-1 space-y-1">
                        <p className="line-clamp-1 text-sm">
                          {log.message}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span>{projectName}</span>
                          <span>·</span>
                          <span>{log.service || "—"}</span>
                          <span>·</span>
                          <span className="font-mono">
                            {log.runtime.file.split(/[/\\]/).pop()}:
                            {log.runtime.line}
                          </span>
                          <span>·</span>
                          <span>
                            {new Date(log.timestamp).toLocaleString("en-US", {
                              month: "short",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex h-[100px] items-center justify-center text-sm text-muted-foreground">
                No recent errors — your systems are healthy!
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
