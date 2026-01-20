"use client";
import { LogDataTable } from "@/components/data-table";
import { useLog } from "@/hooks/useLog";
import { useUser } from "@clerk/nextjs";
import React from "react";

const page = () => {
  const { user } = useUser();
  const { logs } = useLog(user?.id);
  return (
    <div className="mt-5">
      <LogDataTable data={logs} />
    </div>
  );
};

export default page;
