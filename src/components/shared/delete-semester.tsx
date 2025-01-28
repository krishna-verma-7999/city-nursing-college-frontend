import { useDeleteSemesterMutation } from "@/store/api";
import { Trash2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import LoadingPage from "./loadingPage";
import { ErrorMessage } from "@/types";

const DeleteSemester = ({ id }: { id: string }) => {
  const [deleteSemesters, { isLoading }] = useDeleteSemesterMutation();

  if (isLoading) {
    return <LoadingPage />;
  }
  const deleteSemesterHandler = async (id: string) => {
    const res = await deleteSemesters(id);
    if (res.data?.success) {
      toast.success("Course deleted successfully");
    }
    if (res.error) {
      const error = res.error as ErrorMessage;
      toast.error(error.data.message);
    }
  };
  return (
    <>
      <Trash2
        onClick={() => deleteSemesterHandler(id)}
        className="h-5 w-5  stroke-red-700 cursor-pointer"
      />
    </>
  );
};

export default DeleteSemester;
