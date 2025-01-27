"use client";

import CreateStudent from "@/components/shared/create-student";
import { Button } from "@mui/material";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const Page = () => {
  const router = useRouter();
  return (
    <div className="py-5 px-2 max-w-7xl w-full mx-auto">
      <Button
        className="mt-2"
        variant="text"
        onClick={() => router.push("/reports/student")}
      >
        <ChevronLeft className="h-5 w-5" /> Back
      </Button>
      <CreateStudent />
    </div>
  );
};

export default Page;
