"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { projectApi, userApi } from "./api/api";

interface IProject {
  project_name: string;
  description: string;
  user_id: string;
}

export const useProject = (projectId?: string, userId?: string) => {
  const createProject = useMutation({
    mutationFn: (projectData: IProject) =>
      projectApi.createProject(projectData),
  });
  const projects = useQuery({
    queryKey: ["products", userId],
    queryFn: () => projectApi.getProjects(userId as string),
    enabled: !!userId,
  });
  const project = useQuery({
    queryKey: ["product", projectId],
    queryFn: () => projectApi.getProject(projectId as string),
    enabled: !!projectId,
  });
  return {
    createProject: createProject.mutate,
    projects: projects.data,
    project: project.data,
  };
};
