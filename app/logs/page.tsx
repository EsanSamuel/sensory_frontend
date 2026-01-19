import { LogDataTable } from "@/components/data-table";
import { sampleLogs } from "@/components/log";
import React from "react";

const page = () => {
  return (
    <div>
      <LogDataTable data={sampleLogs} />
    </div>
  );
};

export default page;
