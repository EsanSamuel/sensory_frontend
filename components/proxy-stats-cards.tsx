"use client";

import {
  IconArrowUpRight,
  IconArrowDownRight,
  IconClock,
  IconAlertTriangle,
  IconTransfer,
  IconServer,
} from "@tabler/icons-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ProxyResponseLog } from "@/hooks/api/proxy-api";

interface ProxyStatsCardsProps {
  logs?: ProxyResponseLog[];
  projectCount?: number;
}

export function ProxyStatsCards({ logs, projectCount = 0 }: ProxyStatsCardsProps) {
  const totalRequests = logs?.length ?? 0;

  const avgDuration =
    totalRequests > 0
      ? Math.round(
          (logs?.reduce((sum, l) => sum + l.duration, 0) ?? 0) / totalRequests,
        )
      : 0;

  const errorCount =
    logs?.filter((l) => l.status_code >= 400).length ?? 0;

  const errorRate =
    totalRequests > 0 ? ((errorCount / totalRequests) * 100).toFixed(1) : "0.0";

  const totalBytes = logs?.reduce((sum, l) => sum + l.bytes_written, 0) ?? 0;

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const stats = [
    {
      title: "Total Requests",
      value: totalRequests.toLocaleString(),
      description: "All proxied requests",
      icon: IconTransfer,
      trend: null,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Avg Response Time",
      value: `${avgDuration}ms`,
      description: "Mean latency",
      icon: IconClock,
      trend: avgDuration > 500 ? "slow" : "fast",
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-500/10",
    },
    {
      title: "Error Rate",
      value: `${errorRate}%`,
      description: `${errorCount} errors of ${totalRequests}`,
      icon: IconAlertTriangle,
      trend: parseFloat(errorRate) > 5 ? "high" : "low",
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-500/10",
    },
    {
      title: "Data Transferred",
      value: formatBytes(totalBytes),
      description: `Across ${projectCount} project${projectCount !== 1 ? "s" : ""}`,
      icon: IconServer,
      trend: null,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
      {stats.map((stat) => (
        <Card key={stat.title} className="relative overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="flex items-center gap-1.5 text-xs font-medium">
                <div className={`rounded-md p-1.5 ${stat.bgColor}`}>
                  <stat.icon className={`size-3.5 ${stat.color}`} />
                </div>
                {stat.title}
              </CardDescription>
              {stat.trend === "high" || stat.trend === "slow" ? (
                <Badge
                  variant="outline"
                  className="border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 text-[10px] px-1.5"
                >
                  <IconArrowUpRight className="mr-0.5 size-3" />
                  {stat.trend === "high" ? "High" : "Slow"}
                </Badge>
              ) : stat.trend === "low" || stat.trend === "fast" ? (
                <Badge
                  variant="outline"
                  className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] px-1.5"
                >
                  <IconArrowDownRight className="mr-0.5 size-3" />
                  {stat.trend === "low" ? "Low" : "Fast"}
                </Badge>
              ) : null}
            </div>
            <CardTitle className="text-2xl font-bold tabular-nums tracking-tight">
              {stat.value}
            </CardTitle>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
