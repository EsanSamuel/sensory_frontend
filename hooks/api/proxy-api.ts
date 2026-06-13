import axios from "axios";

export interface IProxyProject {
  project_name: string;
  description: string;
  user_id: string;
  backend_urls: string[];
}

export interface ProxyProject {
  _id: string;
  project_id: string;
  project_name: string;
  description: string;
  user_id: string;
  api_key: string;
  backend_urls: string[];
  created_at: string;
  updated_at: string;
}

export interface ProxyResponseLog {
  _id: string;
  response_log_id: string;
  project_id: string;
  user_id: string;
  host: string;
  method: string;
  url_path: string;
  status_code: number;
  bytes_written: number;
  duration: number;
  client_ip: string;
  user_agent: string;
  query_params: string;
  referer: string;
  timestamp: string;
  protocol: string;
  content_type: string;
}

export const proxyAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_PROXY_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const proxyProjectApi = {
  createProject: async (projectData: IProxyProject) => {
    const response = await proxyAxios.post("/_proxy/project", projectData);
    return response.data;
  },

  getProjects: async (userId: string) => {
    const response = await proxyAxios.get("/_proxy/projects", {
      params: { userId },
    });
    return response.data.projects as ProxyProject[];
  },

  generateApiKey: async (projectId: string) => {
    const response = await proxyAxios.put("/_proxy/api_key", null, {
      params: { projectId },
    });
    return response.data.api_key as string;
  },

  getProjectLogs: async (projectId: string) => {
    const response = await proxyAxios.get("/_proxy/projects/logs", {
      params: { projectId },
    });
    return response.data.logs as ProxyResponseLog[];
  },
};
