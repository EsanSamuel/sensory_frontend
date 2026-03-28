"use client";

import React, { useState, useMemo } from "react";
import { useLog } from "@/hooks/useLog";
import { useUser } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  IconSearch,
  IconCommand,
  IconAlertTriangle,
  IconInfoCircle,
  IconCode,
  IconFileCode,
  IconX,
} from "@tabler/icons-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/use-mobile";

interface ILog {
  _id: string;
  level: "INFO" | "ERROR" | "WARN" | "DEBUG";
  timestamp: string;
  project: { project_name: string; _id: string } | string;
  project_id?: string;
  service: string;
  message: string;
  runtime: {
    file: string;
    line: number;
    fn: string;
  };
}

function LevelBadge({ level }: { level: ILog["level"] }) {
  const variants = {
    INFO: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 border-blue-500/30",
    ERROR:
      "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 border-red-500/30",
    WARN: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 border-amber-500/30",
    DEBUG:
      "bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 border-purple-500/30",
  };

  const icons = {
    INFO: <IconInfoCircle className="size-3" />,
    ERROR: <IconAlertTriangle className="size-3" />,
    WARN: <IconAlertTriangle className="size-3" />,
    DEBUG: <IconCode className="size-3" />,
  };

  return (
    <Badge
      variant="outline"
      className={`${variants[level]} gap-1 px-1.5 py-0 font-mono text-[10px] font-semibold`}
    >
      {icons[level]}
      {level}
    </Badge>
  );
}

function SearchResultItem({ log }: { log: ILog }) {
  const isMobile = useIsMobile();
  const projectName =
    typeof log.project === "object" && log.project
      ? log.project.project_name
      : typeof log.project === "string"
        ? log.project
        : "—";
  const messagePreview =
    log.message.length > 120 ? log.message.slice(0, 120) + "..." : log.message;

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <button className="group w-full rounded-lg border border-transparent px-4 py-3 text-left transition-all hover:border-border hover:bg-accent/50">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 shrink-0">
              <LevelBadge level={log.level} />
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <p className="line-clamp-2 text-sm leading-relaxed">
                {messagePreview}
              </p>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="font-medium">{projectName}</span>
                <span>·</span>
                <span>{log.service || "—"}</span>
                <span>·</span>
                <span className="font-mono">
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
        </button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="gap-1">
          <DrawerTitle className="flex items-center gap-2">
            <LevelBadge level={log.level} />
            Log Details
          </DrawerTitle>
          <DrawerDescription className="font-mono text-xs">
            {new Date(log.timestamp).toLocaleString()}
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 pb-4">
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Message
              </Label>
              <div className="mt-2 rounded-md border bg-muted/30 p-3">
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {log.message}
                </p>
              </div>
            </div>
            <Separator />
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Project
                </Label>
                <p className="mt-1.5 text-sm font-medium">{projectName}</p>
              </div>
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Service
                </Label>
                <p className="mt-1.5 text-sm font-medium">
                  {log.service || "—"}
                </p>
              </div>
            </div>
            <Separator />
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Runtime Information
              </Label>
              <div className="mt-2 space-y-2 rounded-md border bg-muted/30 p-3">
                <div className="flex items-center gap-2">
                  <IconFileCode className="size-3.5 text-muted-foreground" />
                  <span className="font-mono text-xs">{log.runtime.file}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Line {log.runtime.line} in{" "}
                  <span className="font-mono">{log.runtime.fn}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default function SearchPage() {
  const { user } = useUser();
  const { logs } = useLog(user?.id);
  const [query, setQuery] = useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Focus on mount
  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Keyboard shortcut
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // Search results
  const results = useMemo(() => {
    if (!query.trim() || !logs) return [];
    const q = query.toLowerCase();
    return (logs as ILog[]).filter((log) => {
      const projectName =
        typeof log.project === "object" && log.project
          ? log.project.project_name
          : typeof log.project === "string"
            ? log.project
            : "";
      return (
        log.message.toLowerCase().includes(q) ||
        log.runtime.file.toLowerCase().includes(q) ||
        log.runtime.fn.toLowerCase().includes(q) ||
        projectName.toLowerCase().includes(q) ||
        (log.service || "").toLowerCase().includes(q) ||
        log.level.toLowerCase().includes(q)
      );
    });
  }, [query, logs]);

  // Group results by project
  const groupedResults = useMemo(() => {
    const groups: Record<string, ILog[]> = {};
    results.forEach((log) => {
      const projectName =
        typeof log.project === "object" && log.project
          ? log.project.project_name
          : typeof log.project === "string"
            ? log.project
            : "Unknown";
      if (!groups[projectName]) groups[projectName] = [];
      groups[projectName].push(log);
    });
    return groups;
  }, [results]);

  const hasQuery = query.trim().length > 0;

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-3xl px-4 py-6 lg:px-6">
        {/* Search Header */}
        <div
          className={`transition-all duration-300 ${hasQuery ? "pt-0" : "pt-[15vh]"}`}
        >
          <div className="mb-2 text-center">
            <h1
              className={`font-bold transition-all duration-300 ${hasQuery ? "text-xl" : "text-3xl"}`}
            >
              Search Logs
            </h1>
            {!hasQuery && (
              <p className="mt-2 text-sm text-muted-foreground">
                Search across all your log messages, files, and services
              </p>
            )}
          </div>

          {/* Search Input */}
          <div className="relative mt-4">
            <IconSearch className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={inputRef}
              placeholder="Search by message, file, function, project, or service..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-12 pl-12 pr-24 text-base"
            />
            <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
              {hasQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuery("")}
                  className="size-7"
                >
                  <IconX className="size-4" />
                </Button>
              )}
              <Badge
                variant="outline"
                className="hidden gap-1 font-mono text-[10px] sm:flex"
              >
                <IconCommand className="size-3" />K
              </Badge>
            </div>
          </div>
        </div>

        {/* Results */}
        {hasQuery && (
          <div className="mt-6 space-y-6">
            {/* Result count */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>
                {results.length} result{results.length !== 1 ? "s" : ""} found
              </span>
              {results.length > 0 && (
                <>
                  <span>·</span>
                  <span>
                    {Object.keys(groupedResults).length} project
                    {Object.keys(groupedResults).length !== 1 ? "s" : ""}
                  </span>
                </>
              )}
            </div>

            {/* No results */}
            {results.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <IconSearch className="mb-4 size-12 text-muted-foreground/40" />
                <h3 className="mb-1 text-lg font-semibold">No results found</h3>
                <p className="text-sm text-muted-foreground">
                  Try a different search term or check your spelling
                </p>
              </div>
            )}

            {/* Grouped results */}
            {Object.entries(groupedResults).map(
              ([projectName, projectLogs]) => (
                <div key={projectName} className="space-y-1">
                  <div className="flex items-center gap-2 px-4 py-2">
                    <h3 className="text-sm font-semibold">{projectName}</h3>
                    <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">
                      {projectLogs.length}
                    </Badge>
                  </div>
                  <div className="space-y-0.5 rounded-lg border bg-card">
                    {projectLogs.slice(0, 20).map((log) => (
                      <SearchResultItem key={log._id} log={log} />
                    ))}
                    {projectLogs.length > 20 && (
                      <div className="px-4 py-2 text-center text-xs text-muted-foreground">
                        +{projectLogs.length - 20} more results
                      </div>
                    )}
                  </div>
                </div>
              ),
            )}
          </div>
        )}

        {/* Empty state hint */}
        {!hasQuery && logs && (logs as ILog[]).length > 0 && (
          <div className="mt-8 text-center text-xs text-muted-foreground">
            {(logs as ILog[]).length} logs available to search
          </div>
        )}
      </div>
    </div>
  );
}
