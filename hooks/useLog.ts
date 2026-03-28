"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { logApi, projectApi, userApi } from "./api/api";

export interface ILog {
  _id: string;
  level: "INFO" | "ERROR" | "WARN" | "DEBUG";
  timestamp: string;
  project: string;
  service: string;
  message: string;
  runtime: {
    file: string;
    line: number;
    fn: string;
  };
}

export const useLog = (
  userId?: string,
  projectId?: string,
  refetchInterval: number | false = 5000,
) => {
  const logs = useQuery({
    queryKey: ["logs", userId],
    queryFn: () => logApi.getLogs(userId as string),
    enabled: !!userId,
    refetchInterval,
  });
  const projectLogs = useQuery({
    queryKey: ["logs", projectId],
    queryFn: () => logApi.getProjectLogs(projectId as string),
    enabled: !!projectId,
    refetchInterval,
  });
  return {
    logs: logs.data,
    projectLogs: projectLogs.data,
    isLoading: logs.isLoading || projectLogs.isLoading,
    isError: logs.isError || projectLogs.isError,
  };
};
