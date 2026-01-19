import {
  IconAlertTriangle,
  IconBug,
  IconFileText,
  IconInfoCircle,
  IconTrendingDown,
  IconTrendingUp,
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { type LogEntry } from "./data-table"

interface LogStatsCardsProps {
  logs: LogEntry[]
  previousPeriodLogs?: LogEntry[] // For comparison
}

export function LogStatsCards({ logs, previousPeriodLogs }: LogStatsCardsProps) {
  // Calculate current period stats
  const totalLogs = logs.length
  const errorCount = logs.filter((log) => log.level === "ERROR").length
  const warningCount = logs.filter((log) => log.level === "WARN").length
  const infoCount = logs.filter((log) => log.level === "INFO").length
  const debugCount = logs.filter((log) => log.level === "DEBUG").length

  // Calculate error rate
  const errorRate = totalLogs > 0 ? ((errorCount / totalLogs) * 100).toFixed(1) : "0.0"

  // Calculate trends if previous period data is available
  const calculateTrend = (current: number, previous?: number) => {
    if (!previous || previous === 0) return { percentage: 0, isUp: false }
    const change = ((current - previous) / previous) * 100
    return {
      percentage: Math.abs(change).toFixed(1),
      isUp: change > 0,
    }
  }

  const prevErrorCount = previousPeriodLogs?.filter((log) => log.level === "ERROR").length
  const prevWarningCount = previousPeriodLogs?.filter((log) => log.level === "WARN").length
  const prevTotalLogs = previousPeriodLogs?.length

  const errorTrend = calculateTrend(errorCount, prevErrorCount)
  const warningTrend = calculateTrend(warningCount, prevWarningCount)
  const totalLogsTrend = calculateTrend(totalLogs, prevTotalLogs)

  // Calculate average errors per hour (assuming logs span 24 hours)
  const avgErrorsPerHour = (errorCount / 24).toFixed(1)

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
            {previousPeriodLogs && (
              <Badge variant="outline">
                {totalLogsTrend.isUp ? <IconTrendingUp /> : <IconTrendingDown />}
                {totalLogsTrend.isUp ? "+" : "-"}
                {totalLogsTrend.percentage}%
              </Badge>
            )}
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            <IconFileText className="size-4" />
            {infoCount.toLocaleString()} INFO · {debugCount.toLocaleString()} DEBUG
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
            {previousPeriodLogs && (
              <Badge 
                variant="outline"
                className={errorTrend.isUp ? "border-red-500/30 text-red-600 dark:text-red-400" : ""}
              >
                {errorTrend.isUp ? <IconTrendingUp /> : <IconTrendingDown />}
                {errorTrend.isUp ? "+" : "-"}
                {errorTrend.percentage}%
              </Badge>
            )}
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {errorTrend.isUp ? (
              <>
                Error rate increased <IconTrendingUp className="size-4 text-red-500" />
              </>
            ) : (
              <>
                Error rate decreased <IconTrendingDown className="size-4 text-green-500" />
              </>
            )}
          </div>
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
            {previousPeriodLogs && (
              <Badge 
                variant="outline"
                className={warningTrend.isUp ? "border-amber-500/30 text-amber-600 dark:text-amber-400" : ""}
              >
                {warningTrend.isUp ? <IconTrendingUp /> : <IconTrendingDown />}
                {warningTrend.isUp ? "+" : "-"}
                {warningTrend.percentage}%
              </Badge>
            )}
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {warningTrend.isUp ? (
              <>
                Warnings increased <IconAlertTriangle className="size-4 text-amber-500" />
              </>
            ) : (
              <>
                Warnings decreased <IconAlertTriangle className="size-4 text-green-500" />
              </>
            )}
          </div>
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
                parseFloat(errorRate) > 5 
                  ? "border-red-500/30 text-red-600 dark:text-red-400" 
                  : parseFloat(errorRate) > 2
                  ? "border-amber-500/30 text-amber-600 dark:text-amber-400"
                  : "border-green-500/30 text-green-600 dark:text-green-400"
              }
            >
              {parseFloat(errorRate) > 5 ? (
                <IconAlertTriangle className="size-3.5" />
              ) : (
                <IconInfoCircle className="size-3.5" />
              )}
              {parseFloat(errorRate) > 5 ? "Critical" : parseFloat(errorRate) > 2 ? "Warning" : "Healthy"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {parseFloat(errorRate) < 2 ? (
              <>
                System health excellent <IconTrendingUp className="size-4 text-green-500" />
              </>
            ) : parseFloat(errorRate) < 5 ? (
              <>
                Monitoring recommended <IconAlertTriangle className="size-4 text-amber-500" />
              </>
            ) : (
              <>
                Immediate attention needed <IconAlertTriangle className="size-4 text-red-500" />
              </>
            )}
          </div>
          <div className="text-muted-foreground">
            Target: &lt;2% error rate
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}