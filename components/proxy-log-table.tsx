"use client";

import { useMemo, useState } from "react";
import {
  IconFilter,
  IconArrowUp,
  IconArrowDown,
  IconChevronDown,
  IconChevronRight,
  IconAlertTriangle,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ProxyResponseLog } from "@/hooks/api/proxy-api";

interface ProxyLogTableProps {
  logs?: ProxyResponseLog[];
  isLoading?: boolean;
  isError?: boolean;
}

type SortField = "timestamp" | "status_code" | "duration" | "method";
type SortDir = "asc" | "desc";

const METHOD_COLORS: Record<string, string> = {
  GET: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30",
  POST: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
  PUT: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
  PATCH: "bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/30",
  DELETE: "bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/30",
};

function getStatusColor(code: number) {
  if (code >= 200 && code < 300) return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30";
  if (code >= 300 && code < 400) return "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30";
  if (code >= 400 && code < 500) return "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30";
  if (code >= 500) return "bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/30";
  return "bg-muted text-muted-foreground";
}

function formatDuration(ms: number) {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function formatTimestamp(ts: string) {
  const d = new Date(ts);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export function ProxyLogTable({ logs, isLoading, isError }: ProxyLogTableProps) {
  const [methodFilters, setMethodFilters] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<SortField>("timestamp");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const allMethods = useMemo(() => {
    const methods = new Set<string>();
    logs?.forEach((l) => methods.add(l.method));
    return Array.from(methods).sort();
  }, [logs]);

  const toggleMethod = (method: string) => {
    setMethodFilters((prev) => {
      const next = new Set(prev);
      if (next.has(method)) next.delete(method);
      else next.add(method);
      return next;
    });
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field)
      return <IconArrowUp className="size-3 opacity-0 group-hover:opacity-30" />;
    return sortDir === "asc" ? (
      <IconArrowUp className="size-3" />
    ) : (
      <IconArrowDown className="size-3" />
    );
  };

  const filteredAndSorted = useMemo(() => {
    let result = logs ?? [];
    if (methodFilters.size > 0) {
      result = result.filter((l) => methodFilters.has(l.method));
    }
    return [...result].sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortField === "timestamp")
        return (new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()) * dir;
      if (sortField === "status_code") return (a.status_code - b.status_code) * dir;
      if (sortField === "duration") return (a.duration - b.duration) * dir;
      if (sortField === "method") return a.method.localeCompare(b.method) * dir;
      return 0;
    });
  }, [logs, methodFilters, sortField, sortDir]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading request logs...</p>
        </div>
      </div>
    );
  }

  if (isError && (!logs || logs.length === 0)) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="size-12 rounded-full bg-red-500/10 flex items-center justify-center">
            <IconAlertTriangle className="size-6 text-red-500" />
          </div>
          <div>
            <h3 className="font-semibold">Unable to load logs</h3>
            <p className="text-sm text-muted-foreground max-w-[250px]">
              The reverse proxy could not be reached. Check your connection or proxy status.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 lg:px-6">
      {/* Filter Bar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5">
                <IconFilter className="size-3.5" />
                Method
                {methodFilters.size > 0 && (
                  <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-[10px]">
                    {methodFilters.size}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {allMethods.map((method) => (
                <DropdownMenuCheckboxItem
                  key={method}
                  checked={methodFilters.has(method)}
                  onCheckedChange={() => toggleMethod(method)}
                >
                  <Badge variant="outline" className={`${METHOD_COLORS[method] ?? ""} mr-2`}>
                    {method}
                  </Badge>
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {methodFilters.size > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMethodFilters(new Set())}
              className="text-xs text-muted-foreground"
            >
              Clear filters
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {filteredAndSorted.length} request{filteredAndSorted.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-8" />
              <TableHead
                className="group cursor-pointer select-none"
                onClick={() => toggleSort("method")}
              >
                <div className="flex items-center gap-1">
                  Method <SortIcon field="method" />
                </div>
              </TableHead>
              <TableHead>Path</TableHead>
              <TableHead
                className="group cursor-pointer select-none"
                onClick={() => toggleSort("status_code")}
              >
                <div className="flex items-center gap-1">
                  Status <SortIcon field="status_code" />
                </div>
              </TableHead>
              <TableHead
                className="group cursor-pointer select-none hidden sm:table-cell"
                onClick={() => toggleSort("duration")}
              >
                <div className="flex items-center gap-1">
                  Duration <SortIcon field="duration" />
                </div>
              </TableHead>
              <TableHead className="hidden md:table-cell">Bytes</TableHead>
              <TableHead className="hidden lg:table-cell">Client IP</TableHead>
              <TableHead
                className="group cursor-pointer select-none"
                onClick={() => toggleSort("timestamp")}
              >
                <div className="flex items-center gap-1">
                  Timestamp <SortIcon field="timestamp" />
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSorted.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center pointer-events-none">
                  <p className="text-sm text-muted-foreground">No request logs found</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSorted.map((log) => (
                <>
                  <TableRow
                    key={log.response_log_id}
                    className="cursor-pointer transition-colors"
                    onClick={() =>
                      setExpandedRow(
                        expandedRow === log.response_log_id ? null : log.response_log_id,
                      )
                    }
                  >
                    <TableCell className="w-8 pr-0">
                      {expandedRow === log.response_log_id ? (
                        <IconChevronDown className="size-3.5 text-muted-foreground" />
                      ) : (
                        <IconChevronRight className="size-3.5 text-muted-foreground" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`font-mono text-xs ${METHOD_COLORS[log.method] ?? ""}`}
                      >
                        {log.method}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[100px] sm:max-w-[200px] md:max-w-none truncate font-mono text-xs">
                      {log.url_path}
                      {log.query_params && (
                        <span className="text-muted-foreground">?{log.query_params}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`font-mono text-xs ${getStatusColor(log.status_code)}`}>
                        {log.status_code}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell font-mono text-xs tabular-nums">
                      {formatDuration(log.duration)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell font-mono text-xs tabular-nums">
                      {formatBytes(log.bytes_written)}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell font-mono text-xs text-muted-foreground">
                      {log.client_ip}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatTimestamp(log.timestamp)}
                    </TableCell>
                  </TableRow>
                  {expandedRow === log.response_log_id && (
                    <TableRow key={`${log.response_log_id}-detail`} className="bg-muted/30 hover:bg-muted/30">
                      <TableCell colSpan={8}>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-4 py-3 text-xs md:grid-cols-4">
                          <div>
                            <span className="font-medium text-muted-foreground">Host</span>
                            <p className="font-mono mt-0.5">{log.host}</p>
                          </div>
                          <div>
                            <span className="font-medium text-muted-foreground">Protocol</span>
                            <p className="font-mono mt-0.5">{log.protocol}</p>
                          </div>
                          <div className="sm:hidden">
                            <span className="font-medium text-muted-foreground">Duration</span>
                            <p className="font-mono mt-0.5">{formatDuration(log.duration)}</p>
                          </div>
                          <div className="md:hidden">
                            <span className="font-medium text-muted-foreground">Bytes</span>
                            <p className="font-mono mt-0.5">{formatBytes(log.bytes_written)}</p>
                          </div>
                          <div className="lg:hidden">
                            <span className="font-medium text-muted-foreground">Client IP</span>
                            <p className="font-mono mt-0.5">{log.client_ip}</p>
                          </div>
                          <div>
                            <span className="font-medium text-muted-foreground">Content-Type</span>
                            <p className="font-mono mt-0.5">{log.content_type || "—"}</p>
                          </div>
                          <div>
                            <span className="font-medium text-muted-foreground">Referer</span>
                            <p className="font-mono mt-0.5 truncate">{log.referer || "—"}</p>
                          </div>
                          <div className="col-span-2 md:col-span-4 border-t pt-2 mt-1">
                            <span className="font-medium text-muted-foreground">User Agent</span>
                            <p className="font-mono mt-0.5 break-all">{log.user_agent || "—"}</p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
