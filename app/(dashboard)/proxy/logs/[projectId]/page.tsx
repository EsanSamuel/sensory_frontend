"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  IconArrowLeft, 
  IconPlayerPlay, 
  IconPlayerStop, 
  IconRefresh,
  IconActivity
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProxyLogTable } from "@/components/proxy-log-table";
import { useProxyLogs } from "@/hooks/useProxyLogs";
import { useProxyProject } from "@/hooks/useProxyProject";
import { useUser } from "@clerk/nextjs";

export default function ProjectLogsPage() {
  const { projectId } = useParams() as { projectId: string };
  const { user } = useUser();
  const { projects } = useProxyProject(user?.id);
  
  const [isLiveTail, setIsLiveTail] = useState(true);
  
  const { logs, isLoading, refetch } = useProxyLogs(
    projectId, 
    isLiveTail ? 5000 : false
  );

  const project = projects?.find((p) => p.project_id === projectId);

  return (
    <div className="flex flex-1 flex-col py-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <Link href="/proxy/projects">
            <Button variant="ghost" size="icon" className="size-8">
              <IconArrowLeft className="size-4" />
            </Button>
          </Link>
          <div className="flex flex-1 items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{project?.project_name || "Project Logs"}</h1>
                <Badge variant="outline" className="bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/30">
                  Proxy Logs
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Monitoring traffic for project ID: <code className="text-[11px] bg-muted px-1 rounded">{projectId}</code>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={isLiveTail ? "default" : "outline"}
                size="sm"
                onClick={() => setIsLiveTail(!isLiveTail)}
                className={isLiveTail ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}
              >
                {isLiveTail ? (
                  <>
                    <IconPlayerStop className="size-4" />
                    Stop Live
                    <Badge variant="secondary" className="ml-1 animate-pulse bg-emerald-500/20 px-1 py-0 text-[10px] text-emerald-100 border-none">
                      LIVE
                    </Badge>
                  </>
                ) : (
                  <>
                    <IconPlayerPlay className="size-4" />
                    Live Tail
                  </>
                )}
              </Button>
              <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isLoading}>
                <IconRefresh className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Live Tail Status Banner */}
      {isLiveTail && (
        <div className="mx-4 mb-4 flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-4 py-2 lg:mx-6">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
            Live tailing active — Refreshing every 5 seconds
          </span>
        </div>
      )}

      {/* Logs Table */}
      <ProxyLogTable logs={logs} isLoading={isLoading} />
    </div>
  );
}
