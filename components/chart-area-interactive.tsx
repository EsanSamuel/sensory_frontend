"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export interface ILog {
  _id: string;
  level: "INFO" | "ERROR" | "WARN" | "DEBUG";
  timestamp: string;
  project_id: string;
  service: string;
  message: string;
  runtime: {
    file: string;
    line: number;
    fn: string;
  };
}

interface LogChartData {
  date: string;
  error: number;
  warn: number;
  info: number;
  debug: number;
  total: number;
}

interface LogActivityChartProps {
  logs?: ILog[];
}

const chartConfig = {
  total: {
    label: "Total Logs",
    color: "var(--primary)",
  },
  error: {
    label: "Errors",
    color: "hsl(0, 84%, 60%)", // Red
  },
  warn: {
    label: "Warnings",
    color: "hsl(38, 92%, 50%)", // Amber
  },
  info: {
    label: "Info",
    color: "hsl(221, 83%, 53%)", // Blue
  },
  debug: {
    label: "Debug",
    color: "hsl(271, 91%, 65%)", // Purple
  },
} satisfies ChartConfig;

export function LogActivityChart({ logs }: LogActivityChartProps) {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("7d");
  const [viewMode, setViewMode] = React.useState<"total" | "levels">("total");

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  // Process logs into chart data
  const chartData = React.useMemo(() => {
    if (!logs || logs.length === 0) return [];

    // Group logs by date and level
    const groupedByDate = logs.reduce(
      (acc, log) => {
        try {
          const date = new Date(log.timestamp);
          const dateKey = date.toISOString().split("T")[0]; // YYYY-MM-DD

          if (!acc[dateKey]) {
            acc[dateKey] = {
              date: dateKey,
              error: 0,
              warn: 0,
              info: 0,
              debug: 0,
              total: 0,
            };
          }

          const level = log.level.toLowerCase() as
            | "error"
            | "warn"
            | "info"
            | "debug";
          acc[dateKey][level]++;
          acc[dateKey].total++;
        } catch (error) {
          console.error("Error processing log:", error);
        }

        return acc;
      },
      {} as Record<string, LogChartData>,
    );

    // Convert to array and sort by date
    return Object.values(groupedByDate).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
  }, [logs]);

  // Filter data based on time range
  const filteredData = React.useMemo(() => {
    if (chartData.length === 0) return [];

    const now = new Date();
    let daysToSubtract = 7;

    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "90d") {
      daysToSubtract = 90;
    }

    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - daysToSubtract);

    return chartData.filter((item) => {
      const date = new Date(item.date);
      return date >= startDate;
    });
  }, [chartData, timeRange]);

  // Calculate total logs in the filtered period
  const totalLogsInPeriod = React.useMemo(() => {
    return filteredData.reduce((sum, item) => sum + item.total, 0);
  }, [filteredData]);

  // Format time range description
  const timeRangeDescription = React.useMemo(() => {
    if (timeRange === "7d") return "Last 7 days";
    if (timeRange === "30d") return "Last 30 days";
    return "Last 3 months";
  }, [timeRange]);

  if (!logs || logs.length === 0) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Log Activity</CardTitle>
          <CardDescription>No log data available</CardDescription>
        </CardHeader>
        <CardContent className="flex h-[250px] items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Start sending logs to see activity trends
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle className="">Log Activity</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            {totalLogsInPeriod.toLocaleString()} logs in {timeRangeDescription}
          </span>
          <span className="@[540px]/card:hidden">
            {totalLogsInPeriod.toLocaleString()} logs
          </span>
        </CardDescription>
        <CardAction>
          <div className="flex xl:flex-row flex-col items-center gap-2">
            {/* View Mode Toggle */}
            <Select value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
              <SelectTrigger className="w-32" size="sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="">
                <SelectItem value="total">Total</SelectItem>
                <SelectItem value="levels">By Level</SelectItem>
              </SelectContent>
            </Select>

            {/* Time Range Toggle - Desktop */}
            <ToggleGroup
              type="single"
              value={timeRange}
              onValueChange={setTimeRange}
              variant="outline"
              className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
            >
              <ToggleGroupItem value="7d">7 days</ToggleGroupItem>
              <ToggleGroupItem value="30d">30 days</ToggleGroupItem>
              <ToggleGroupItem value="90d">90 days</ToggleGroupItem>
            </ToggleGroup>

            {/* Time Range Select - Mobile */}
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger
                className="flex w-32 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
                size="sm"
                aria-label="Select time range"
              >
                <SelectValue placeholder="Last 7 days" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="7d" className="rounded-lg">
                  Last 7 days
                </SelectItem>
                <SelectItem value="30d" className="rounded-lg">
                  Last 30 days
                </SelectItem>
                <SelectItem value="90d" className="rounded-lg">
                  Last 90 days
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              {/* Gradients for each log level */}
              <linearGradient id="fillError" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-error)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-error)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillWarn" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-warn)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-warn)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillInfo" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-info)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-info)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillDebug" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-debug)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-debug)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-total)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-total)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />

            {/* Render based on view mode */}
            {viewMode === "total" ? (
              <Area
                dataKey="total"
                type="monotone"
                fill="url(#fillTotal)"
                stroke="var(--color-total)"
                strokeWidth={2}
              />
            ) : (
              <>
                <Area
                  dataKey="error"
                  type="monotone"
                  fill="url(#fillError)"
                  stroke="var(--color-error)"
                  strokeWidth={2}
                  stackId="levels"
                />
                <Area
                  dataKey="warn"
                  type="monotone"
                  fill="url(#fillWarn)"
                  stroke="var(--color-warn)"
                  strokeWidth={2}
                  stackId="levels"
                />
                <Area
                  dataKey="info"
                  type="monotone"
                  fill="url(#fillInfo)"
                  stroke="var(--color-info)"
                  strokeWidth={2}
                  stackId="levels"
                />
                <Area
                  dataKey="debug"
                  type="monotone"
                  fill="url(#fillDebug)"
                  stroke="var(--color-debug)"
                  strokeWidth={2}
                  stackId="levels"
                />
              </>
            )}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}