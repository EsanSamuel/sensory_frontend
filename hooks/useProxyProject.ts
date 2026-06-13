"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  proxyProjectApi,
  type IProxyProject,
} from "./api/proxy-api";

export const useProxyProject = (userId?: string) => {
  const queryClient = useQueryClient();

  const createProject = useMutation({
    mutationFn: (projectData: IProxyProject) =>
      proxyProjectApi.createProject(projectData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proxy-projects", userId] });
    },
  });

  const projects = useQuery({
    queryKey: ["proxy-projects", userId],
    queryFn: () => proxyProjectApi.getProjects(userId as string),
    enabled: !!userId,
  });

  const generateApiKey = useMutation({
    mutationFn: (projectId: string) =>
      proxyProjectApi.generateApiKey(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proxy-projects", userId] });
    },
  });

  return {
    createProject: createProject.mutateAsync,
    isCreating: createProject.isPending,
    projects: projects.data,
    isLoadingProjects: projects.isLoading,
    generateApiKey: generateApiKey.mutateAsync,
    isGeneratingKey: generateApiKey.isPending,
  };
};
