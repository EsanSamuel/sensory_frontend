import {
  IconAlertTriangle,
  IconBug,
  IconFileText,
  IconInfoCircle,
  IconTrendingDown,
  IconTrendingUp,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface Project {
  _id: string;
  project_id: string;
  project_name: string;
  description: string;
  user_id: string;
  api_key: string;
  service: string;
  log_counts: number;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

// Use the ILog interface
export interface ILog {
  _id: string;
  level: "INFO" | "ERROR" | "WARN" | "DEBUG";
  timestamp: string;
  project: Project;
  project_id: string;
  service: string;
  message: string;
  runtime: {
    file: string;
    line: number;
    fn: string;
  };
}

interface LogStatsCardsProps {
  logs?: ILog[]; // Make optional
  previousPeriodLogs?: ILog[]; // Already optional
}

export function LogStatsCards({
  logs = [], // Default to empty array
  previousPeriodLogs,
}: LogStatsCardsProps) {
  // Safety check: ensure logs is an array
  const safeLogs = Array.isArray(logs) ? logs : [];
  const safePreviousLogs = Array.isArray(previousPeriodLogs)
    ? previousPeriodLogs
    : [];

  // Calculate current period stats with safe array operations
  const totalLogs = safeLogs.length;
  const errorCount = safeLogs.filter((log) => log?.level === "ERROR").length;
  const warningCount = safeLogs.filter((log) => log?.level === "WARN").length;
  const infoCount = safeLogs.filter((log) => log?.level === "INFO").length;
  const debugCount = safeLogs.filter((log) => log?.level === "DEBUG").length;

  // Calculate error rate with safety checks
  const errorRate =
    totalLogs > 0 ? ((errorCount / totalLogs) * 100).toFixed(1) : "0.0";

  // Calculate trends if previous period data is available
  const calculateTrend = (current: number, previous?: number) => {
    // Safety checks
    if (typeof current !== "number" || isNaN(current)) {
      return { percentage: "0", isUp: false };
    }
    if (!previous || previous === 0 || typeof previous !== "number") {
      return { percentage: "0", isUp: false };
    }

    const change = ((current - previous) / previous) * 100;
    return {
      percentage: Math.abs(change).toFixed(1),
      isUp: change > 0,
    };
  };

  // Calculate previous period stats with safety checks
  const prevErrorCount = safePreviousLogs.filter(
    (log) => log?.level === "ERROR",
  ).length;
  const prevWarningCount = safePreviousLogs.filter(
    (log) => log?.level === "WARN",
  ).length;
  const prevTotalLogs = safePreviousLogs.length;

  const errorTrend = calculateTrend(errorCount, prevErrorCount);
  const warningTrend = calculateTrend(warningCount, prevWarningCount);
  const totalLogsTrend = calculateTrend(totalLogs, prevTotalLogs);

  // Calculate average errors per hour (assuming logs span 24 hours)
  const avgErrorsPerHour = totalLogs > 0 ? (errorCount / 24).toFixed(1) : "0.0";

  // Parse error rate safely
  const errorRateValue = parseFloat(errorRate) || 0;

  // Show empty state if no logs
  if (totalLogs === 0) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {["Total Logs", "Error Events", "Warning Events", "Error Rate"].map(
          (title) => (
            <Card key={title} className="@container/card">
              <CardHeader>
                <CardDescription>{title}</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  0
                </CardTitle>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="text-muted-foreground">No data available</div>
              </CardFooter>
            </Card>
          ),
        )}
      </div>
    );
  }

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Total Logs */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Logs</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalLogs.toLocaleString()}
          </CardTitle>
          <CardAction>
            {safePreviousLogs.length > 0 && (
              <Badge variant="outline">
                {totalLogsTrend.isUp ? (
                  <IconTrendingUp />
                ) : (
                  <IconTrendingDown />
                )}
                {totalLogsTrend.isUp ? "+" : "-"}
                {totalLogsTrend.percentage}%
              </Badge>
            )}
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            <IconFileText className="size-4" />
            {infoCount.toLocaleString()} INFO · {debugCount.toLocaleString()}{" "}
            DEBUG
          </div>
          <div className="text-muted-foreground">
            Activity over the last 24 hours
          </div>
        </CardFooter>
      </Card>

      {/* Error Count */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Error Events</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {errorCount.toLocaleString()}
          </CardTitle>
          <CardAction>
            {safePreviousLogs.length > 0 && (
              <Badge
                variant="outline"
                className={
                  errorTrend.isUp
                    ? "border-red-500/30 text-red-600 dark:text-red-400"
                    : ""
                }
              >
                {errorTrend.isUp ? <IconTrendingUp /> : <IconTrendingDown />}
                {errorTrend.isUp ? "+" : "-"}
                {errorTrend.percentage}%
              </Badge>
            )}
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          {safePreviousLogs.length > 0 ? (
            <div className="line-clamp-1 flex gap-2 font-medium">
              {errorTrend.isUp ? (
                <>
                  Error rate increased{" "}
                  <IconTrendingUp className="size-4 text-red-500" />
                </>
              ) : (
                <>
                  Error rate decreased{" "}
                  <IconTrendingDown className="size-4 text-green-500" />
                </>
              )}
            </div>
          ) : (
            <div className="line-clamp-1 flex gap-2 font-medium">
              <IconAlertTriangle className="size-4" />
              {errorCount === 0 ? "No errors" : `${errorCount} total errors`}
            </div>
          )}
          <div className="text-muted-foreground">
            {avgErrorsPerHour} errors/hour average
          </div>
        </CardFooter>
      </Card>

      {/* Warning Count */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Warning Events</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {warningCount.toLocaleString()}
          </CardTitle>
          <CardAction>
            {safePreviousLogs.length > 0 && (
              <Badge
                variant="outline"
                className={
                  warningTrend.isUp
                    ? "border-amber-500/30 text-amber-600 dark:text-amber-400"
                    : ""
                }
              >
                {warningTrend.isUp ? <IconTrendingUp /> : <IconTrendingDown />}
                {warningTrend.isUp ? "+" : "-"}
                {warningTrend.percentage}%
              </Badge>
            )}
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          {safePreviousLogs.length > 0 ? (
            <div className="line-clamp-1 flex gap-2 font-medium">
              {warningTrend.isUp ? (
                <>
                  Warnings increased{" "}
                  <IconAlertTriangle className="size-4 text-amber-500" />
                </>
              ) : (
                <>
                  Warnings decreased{" "}
                  <IconAlertTriangle className="size-4 text-green-500" />
                </>
              )}
            </div>
          ) : (
            <div className="line-clamp-1 flex gap-2 font-medium">
              <IconAlertTriangle className="size-4" />
              {warningCount === 0
                ? "No warnings"
                : `${warningCount} total warnings`}
            </div>
          )}
          <div className="text-muted-foreground">
            {warningCount > 0 ? "Requires attention" : "System stable"}
          </div>
        </CardFooter>
      </Card>

      {/* Error Rate */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Error Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {errorRate}%
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className={
                errorRateValue > 5
                  ? "border-red-500/30 text-red-600 dark:text-red-400"
                  : errorRateValue > 2
                    ? "border-amber-500/30 text-amber-600 dark:text-amber-400"
                    : "border-green-500/30 text-green-600 dark:text-green-400"
              }
            >
              {errorRateValue > 5 ? (
                <IconAlertTriangle className="size-3.5" />
              ) : (
                <IconInfoCircle className="size-3.5" />
              )}
              {errorRateValue > 5
                ? "Critical"
                : errorRateValue > 2
                  ? "Warning"
                  : "Healthy"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {errorRateValue < 2 ? (
              <>
                System health excellent{" "}
                <IconTrendingUp className="size-4 text-green-500" />
              </>
            ) : errorRateValue < 5 ? (
              <>
                Monitoring recommended{" "}
                <IconAlertTriangle className="size-4 text-amber-500" />
              </>
            ) : (
              <>
                Immediate attention needed{" "}
                <IconAlertTriangle className="size-4 text-red-500" />
              </>
            )}
          </div>
          <div className="text-muted-foreground">Target: &lt;2% error rate</div>
        </CardFooter>
      </Card>
    </div>
  );
}