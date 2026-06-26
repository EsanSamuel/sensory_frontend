"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  IconArrowLeft,
  IconClock,
  IconCopy,
  IconKey,
  IconAlertTriangle,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LogDataTable } from "@/components/data-table";
import { LogExportButton } from "@/components/log-export";
import { LogStatsCards } from "@/components/log-stat-card";
import { useProject } from "@/hooks/useProject";
import { useLog } from "@/hooks/useLog";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

interface Project {
  _id: string;
  project_id: string;
  project_name: string;
  description: string;
  user_id: string;
  api_key: string;
  service: string;
  log_counts: number;
  created_at: string;
  updated_at: string;
}

export default function ProjectDetailsPage() {
  const { projectId } = useParams() as { projectId: string };
  const { user } = useUser();
  const { projects } = useProject("", user?.id);
  const { projectLogs, isLoading } = useLog(undefined, projectId);

  const project = projects?.find((p:any) => p.project_id === projectId);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMins < 60)
      return `${diffInMins} minute${diffInMins !== 1 ? "s" : ""} ago`;
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
    return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!project) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-12">
        <div className="text-center">
          <h2 className="text-lg font-semibold">Project not found</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The project you're looking for doesn't exist or has been deleted.
          </p>
          <Link href="/projects" className="mt-4 inline-block">
            <Button variant="outline">Back to Projects</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 py-6">
      {/* Header */}
      <div className="mx-auto w-full max-w-7xl px-4 lg:px-6">
        <div className="flex items-start gap-3">
          <Link href="/projects" className="mt-1">
            <Button variant="ghost" size="icon" className="size-8">
              <IconArrowLeft className="size-4" />
            </Button>
          </Link>
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold lg:text-3xl">{project.project_name}</h1>
              {project.api_key && (
                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                  Active
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {project.description || "No description provided"}
            </p>
          </div>
        </div>
      </div>

      {/* Details Card */}
      <div className="mx-auto w-full max-w-7xl px-4 lg:px-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Project Details</CardTitle>
            <CardDescription>Configuration and metadata</CardDescription>
          </CardHeader>

          <div className="space-y-4 px-6 pb-6">
            {/* Project ID */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">Project ID</p>
              <div className="flex items-center gap-2 rounded border border-border bg-muted px-3 py-2">
                <code className="flex-1 font-mono text-sm">{project.project_id}</code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  onClick={() => copyToClipboard(project.project_id)}
                >
                  <IconCopy className="size-3.5" />
                </Button>
              </div>
            </div>

            {/* API Key */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">API Key</p>
              {project.api_key ? (
                <div className="flex items-center gap-2 rounded border border-border bg-muted px-3 py-2">
                  <code className="flex-1 font-mono text-sm">
                    {project.api_key.slice(0, 12)}...{project.api_key.slice(-4)}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    onClick={() => copyToClipboard(project.api_key)}
                  >
                    <IconCopy className="size-3.5" />
                  </Button>
                </div>
              ) : (
                <div className="rounded border border-dashed border-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
                  No API key generated yet
                </div>
              )}
            </div>

            {/* Service */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">Service</p>
              <div className="rounded border border-border bg-muted px-3 py-2 text-sm">
                {project.service || "Not specified"}
              </div>
            </div>

            {/* Log Count */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">Total Logs</p>
              <div className="rounded border border-border bg-muted px-3 py-2 text-sm font-mono">
                {project.log_counts} log{project.log_counts !== 1 ? "s" : ""}
              </div>
            </div>

            {/* Timestamps */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground">Created</p>
                <div className="flex items-center gap-2 text-sm">
                  <IconClock className="size-3.5 text-muted-foreground" />
                  <span>{formatDate(project.created_at)}</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground">Last Updated</p>
                <div className="flex items-center gap-2 text-sm">
                  <IconClock className="size-3.5 text-muted-foreground" />
                  <span>{getTimeAgo(project.updated_at)}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Project Analysis Cards */}
      <div className="mx-auto w-full max-w-7xl px-4 lg:px-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold lg:text-2xl">Project Analysis</h2>
              <p className="text-sm text-muted-foreground">
                Dashboard-level metrics for this project
              </p>
            </div>
          </div>
          <div className="-mx-4 lg:-mx-6">
            <LogStatsCards logs={projectLogs} />
          </div>
        </div>
      </div>

      {/* Logs Section */}
      <div className="mx-auto w-full max-w-7xl px-4 lg:px-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold lg:text-2xl">Project Logs</h2>
              <p className="text-sm text-muted-foreground">
                All logs for this project
              </p>
            </div>
            {projectLogs && projectLogs.length > 0 && (
              <LogExportButton logs={projectLogs} />
            )}
          </div>

          {/* Logs Table */}
          <div className="-mx-4 lg:-mx-6">
            {projectLogs && projectLogs.length > 0 ? (
              <div className="overflow-x-auto">
                <LogDataTable data={projectLogs} />
              </div>
            ) : isLoading ? (
              <Card>
                <CardHeader>
                  <p className="text-sm text-muted-foreground">Loading logs...</p>
                </CardHeader>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <p className="text-sm text-muted-foreground">No logs found for this project</p>
                </CardHeader>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

