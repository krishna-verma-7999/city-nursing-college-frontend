import { useDeleteCoursesMutation } from "@/store/api";
import { ErrorMessage } from "@/types";
import { Box, Button, Modal } from "@mui/material";
import { Trash2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

const DeleteCourse = ({ id }: { id: string }) => {
  const [open, setOpen] = useState(false);
  const [deleteCourse, { isLoading }] = useDeleteCoursesMutation();
  const deleteCourseHandler = async (id: string) => {
    const res = await deleteCourse(id);
    if (res.data?.success) {
      toast.success("Course deleted successfully");
    }

    if (res.error) {
      const error = res.error as ErrorMessage;
      toast.error(error.data.message);
    }
    setOpen(false);
  };
  return (
    <>
      <Trash2
        className="h-5 w-5  stroke-red-700 cursor-pointer"
        onClick={() => setOpen(true)}
      />
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: 600,
            padding: "14px 36px",
            background: "white",
          }}
        >
          <h2 className="text-base font-medium">
            Are your sure you want to delete this course?
          </h2>
          <div className="flex justify-end items-center gap-3 mt-3">
            <Button type="button" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              disabled={isLoading}
              type="button"
              onClick={() => deleteCourseHandler(id)}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default DeleteCourse;
