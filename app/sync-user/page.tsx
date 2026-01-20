import { useUser } from "@/hooks/useUser";
import { auth, clerkClient, Client } from "@clerk/nextjs/server";
import axios from "axios";
import { error } from "console";
import { notFound } from "next/navigation";
import React from "react";

const Sync = async () => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not found");
  }

  const client = clerkClient();
  const user = (await client).users.getUser(userId);
  if (!(await user).emailAddresses) {
    return notFound();
  }

    console.log((await user).username, (await user).emailAddresses);
  const data = {
    username: (await user).fullName,
    user_id: (await user).id,
    email: (await user).primaryEmailAddress?.emailAddress,
    avatar: (await user).imageUrl,
  };

  const response = await axios.post("http:localhost:8000/register", data);
  console.log(response);

};

export default Sync;
