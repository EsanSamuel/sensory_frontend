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
    refetchOnWindowFocus: false, // Prevent redundant requests when switching tabs
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 429) return false;
      return failureCount < 2;
    },
  });

  return {
    logs: logs.data,
    isLoading: logs.isLoading,
    isError: logs.isError,
    refetch: logs.refetch,
  };
};
