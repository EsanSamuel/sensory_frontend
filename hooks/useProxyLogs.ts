"use client";
import { useQuery } from "@tanstack/react-query";
import { proxyProjectApi } from "./api/proxy-api";

export const useProxyLogs = (
  projectId?: string,
  refetchInterval: number | false = 5000,
) => {
  const logs = useQuery({
    queryKey: ["proxy-logs", projectId],
    queryFn: () => proxyProjectApi.getProjectLogs(projectId as string),
    enabled: !!projectId,
    refetchInterval,
  });

  return {
    logs: logs.data,
    isLoading: logs.isLoading,
    isError: logs.isError,
    refetch: logs.refetch,
  };
};
