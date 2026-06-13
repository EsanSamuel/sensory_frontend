"use client";

import { useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import {
  IconArrowRight,
  IconArrowsTransferDown,
  IconClock,
  IconPlus,
  IconServer,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProxyStatsCards } from "@/components/proxy-stats-cards";
import { useProxyProject } from "@/hooks/useProxyProject";
import { useProxyLogs } from "@/hooks/useProxyLogs";
import type { ProxyProject, ProxyResponseLog } from "@/hooks/api/proxy-api";

export default function ProxyDashboard() {
  const { user } = useUser();
  const { projects, isLoadingProjects } = useProxyProject(user?.id);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null,
  );

  // Aggregate all logs from all projects for the stats overview
  // We'll fetch logs for display from individual project pages
  // For the dashboard overview, use an empty array if no project is selected
  const { logs: allLogs } = useProxyLogs(
    projects?.[0]?.project_id,
    10000,
  );

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMins < 60)
      return `${diffInMins}m ago`;
    if (diffInHours < 24)
      return `${diffInHours}h ago`;
    return `${diffInDays}d ago`;
  };

  return (
    <div className="flex flex-1 flex-col gap-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div>
          <h1 className="flex items-center gap-2.5 text-2xl font-bold lg:text-3xl">
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 shadow-md shadow-violet-500/25">
              <IconArrowsTransferDown className="size-4.5 text-white" />
            </div>
            Reverse Proxy
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your proxy projects, monitor traffic, and view request logs
          </p>
        </div>
        <Link href="/proxy/projects">
          <Button>
            <IconPlus className="size-4" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Stats Overview */}
      <ProxyStatsCards logs={allLogs} projectCount={projects?.length ?? 0} />

      {/* Recent Projects */}
      <div className="px-4 lg:px-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Projects</h2>
          <Link href="/proxy/projects">
            <Button variant="ghost" size="sm" className="gap-1 text-xs">
              View all
              <IconArrowRight className="size-3.5" />
            </Button>
          </Link>
        </div>

        {isLoadingProjects ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-5 w-2/3 rounded bg-muted" />
                  <div className="mt-2 h-4 w-1/2 rounded bg-muted" />
                  <div className="mt-4 h-3 w-full rounded bg-muted" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : projects?.length === 0 ? (
          <Card className="border-2 border-dashed">
            <CardHeader className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-violet-500/10">
                <IconServer className="size-6 text-violet-500" />
              </div>
              <CardTitle className="text-lg">No proxy projects yet</CardTitle>
              <CardDescription className="mb-4 max-w-sm">
                Create your first reverse proxy project to start routing and
                monitoring traffic to your backend services
              </CardDescription>
              <Link href="/proxy/projects">
                <Button>
                  <IconPlus className="size-4" />
                  Create Project
                </Button>
              </Link>
            </CardHeader>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {projects?.slice(0, 6).map((project: ProxyProject) => (
              <Link
                key={project.project_id}
                href={`/proxy/logs/${project.project_id}`}
              >
                <Card className="group cursor-pointer transition-all duration-200 hover:shadow-md hover:border-violet-500/30">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2 text-base">
                          {project.project_name}
                          {project.api_key ? (
                            <Badge
                              variant="outline"
                              className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px]"
                            >
                              Active
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px]"
                            >
                              No Key
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="mt-1 line-clamp-2 text-xs">
                          {project.description || "No description"}
                        </CardDescription>
                      </div>
                      <IconArrowRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t pt-3">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <IconServer className="size-3.5" />
                        <span>
                          {project.backend_urls?.length ?? 0} backend
                          {(project.backend_urls?.length ?? 0) !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <IconClock className="size-3.5" />
                        <span>{getTimeAgo(project.updated_at)}</span>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
