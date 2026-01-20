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

export const useLog = (userId?: string, projectId?: string) => {
  const logs = useQuery({
    queryKey: ["logs", userId],
    queryFn: () => logApi.getLogs(userId as string),
    enabled: !!userId,
  });
  const projectLogs = useQuery({
    queryKey: ["logs", projectId],
    queryFn: () => logApi.getProjectLogs(projectId as string),
    enabled: !!projectId,
  });
  return {
    logs: logs.data,
    projectLogs: projectLogs.data,
  };
};
