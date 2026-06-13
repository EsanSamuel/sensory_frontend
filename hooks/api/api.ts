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
  baseURL: process.env.NEXT_PUBLIC_PROXY_URL,
  headers: {
    "Content-Type": "application/json",
    'X-API-KEY': '1dd6335419c72a1161856a4163f963f2efa5374eaa72840b942d8fc2ee11fe5f'
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
    return response.data;
  },
  getProject: async (projectId: string) => {
    const response = await api.get(`/project/${projectId}`);
    return response.data;
  },
};

export const logApi = {
  getLogs: async (userId: string) => {
    const response = await api.get(`/logs/${userId}`);
    return response.data;
  },
  getProjectLogs: async (projectId: string) => {
    const response = await api.get(`/logs/project/${projectId}`);
    return response.data;
  },
};
