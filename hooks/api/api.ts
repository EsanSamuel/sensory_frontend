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

export const userApi = {
  createUser: async (userData: IUser) => {
    const response = await axios.post("http://localhost:8000/register", {
      userData,
    });
    return response;
  },
  getUser: async (userId: string) => {
    const response = await axios.get(`http://localhost:8000/user/${userId}`);
    return response.data.user;
  },
};

export const projectApi = {
  createProject: async (projectData: IProject) => {
    const response = await axios.post(
      "http://localhost:8000/project",

      projectData,

      { headers: { "Content-Type": "application/json" } },
    );
    return response;
  },
  getProjects: async (userId: string) => {
    const response = await axios.get(
      `http://localhost:8000/projects/${userId}`,
    );
    console.log(response);
    return response.data;
  },
};
