import { useUser } from "@/hooks/useUser";
import { auth, clerkClient, Client } from "@clerk/nextjs/server";
import { error } from "console";
import { notFound } from "next/navigation";
import React from "react";

const Sync = async () => {
  const { userId } = await auth();
  const { createUser } = useUser();
  if (!userId) {
    throw new Error("User not found");
  }

  const client = clerkClient();
  const user = (await client).users.getUser(userId);
  if (!(await user).emailAddresses) {
    return notFound();
  }

  createUser({
    username: (await user).username,
    user_id: (await user).id,
    email: (await user).emailAddresses,
    avatar: (await user).imageUrl,
  });
};

export default Sync;
