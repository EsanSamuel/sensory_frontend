import axios from "axios";

interface IUser {
  username: string;
  user_id: string;
  email: string;
  avatar: string;
}

interface IProject {
  project_name: string;
  description: string;
  user_id: string;
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const userApi = {
  createUser: async (userData: IUser) => {
    const response = await api.post("/register", {
      userData,
    });
    return response;
  },
  getUser: async (userId: string) => {
    const response = await api.get(`/user/${userId}`);
    return response.data.user;
  },
};

export const projectApi = {
  createProject: async (projectData: IProject) => {
    const response = await api.post("/project", projectData, {
      headers: { "Content-Type": "application/json" },
    });
    return response;
  },
  getProjects: async (userId: string) => {
    const response = await api.get(`/projects/${userId}`);
    console.log(response);
    return response.data;
  },
  getProject: async (projectId: string) => {
    const response = await api.get(`/project/${projectId}`);
    console.log(response);
    return response.data;
  },
};

export const logApi = {
  getLogs: async (userId: string) => {
    const id = "clrk123";
    const response = await api.get(`/logs/${userId}`);
    console.log(response);
    return response.data;
  },
  getProjectLogs: async (projectId: string) => {
    const response = await api.get(`/logs/project/${projectId}`);
    console.log(response);
    return response.data;
  },
};
