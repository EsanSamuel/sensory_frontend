import { useMutation } from "@tanstack/react-query";
import { userApi } from "./api/userApi";

interface IUser {
  username: string | null;
  user_id: string;
  email: string | any;
  avatar: string;
}

export const useUser = (userId?: string) => {
  const createUser = useMutation({
    mutationFn: (userData: IUser) => userApi.createUser(userData),
  });
  return {
    createUser: createUser.mutate,
  };
};
