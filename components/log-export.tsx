"use client";

import { Button } from "@/components/ui/button";
import { IconDownload } from "@tabler/icons-react";

export interface ILogExport {
  _id: string;
  level: "INFO" | "ERROR" | "WARN" | "DEBUG";
  timestamp: string;
  project?: { project_name: string } | string;
  project_id?: string;
  service: string;
  message: string;
  runtime: {
    file: string;
    line: number;
    fn: string;
  };
}

function escapeCSV(value: string): string {
  if (
    value.includes(",") ||
    value.includes('"') ||
    value.includes("\n") ||
    value.includes("\r")
  ) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function exportLogsToCSV(logs: ILogExport[], filename?: string) {
  if (!logs || logs.length === 0) return;

  const headers = [
    "Timestamp",
    "Level",
    "Project",
    "Service",
    "Message",
    "File",
    "Line",
    "Function",
  ];

  const rows = logs.map((log) => {
    const projectName =
      typeof log.project === "object" && log.project
        ? log.project.project_name
        : typeof log.project === "string"
          ? log.project
          : "—";

    return [
      new Date(log.timestamp).toISOString(),
      log.level,
      projectName,
      log.service || "—",
      escapeCSV(log.message),
      escapeCSV(log.runtime.file),
      String(log.runtime.line),
      escapeCSV(log.runtime.fn),
    ].join(",");
  });

  const csvContent = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const date = new Date().toISOString().split("T")[0];
  const downloadName = filename || `sensory-logs-${date}.csv`;

  const link = document.createElement("a");
  link.href = url;
  link.download = downloadName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

interface ExportButtonProps {
  logs: ILogExport[];
  filename?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function LogExportButton({
  logs,
  filename,
  variant = "outline",
  size = "sm",
  className,
}: ExportButtonProps) {
  const handleExport = () => {
    exportLogsToCSV(logs, filename);
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleExport}
      disabled={!logs || logs.length === 0}
      className={className}
    >
      <IconDownload className="size-4" />
      <span className="hidden lg:inline">Export CSV</span>
    </Button>
  );
}
