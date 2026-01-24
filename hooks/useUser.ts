"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { userApi } from "./api/api";

interface IUser {
  username: string | null;
  user_id: string;
  email: string | any;
  avatar: string;
}

export const useUser = (userId?: string) => {
  const createUser = useMutation({
    mutationFn: (userData: IUser) => userApi.createUser(userData as any),
  });
  const user = useQuery({
    queryKey: ["jobs", userId],
    queryFn: () => userApi.getUser(userId as any),
    enabled: !!userId,
  });
  return {
    createUser: createUser.mutate,
    user: user.data,
  };
};
