import axios from "axios";

interface IUser {
  username: string;
  user_id: string;
  email: string;
  avatar: string;
}

export const userApi = {
  createUser: async (userData: IUser) => {
    const response = await axios.post("http://localhost:8000/register", {
      userData,
    });
    return response;
  },
};
