import { useDeleteStudentMutation } from "@/store/api";
import { Box, Button, Modal } from "@mui/material";
import { Trash2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

const DeleteStudent = ({ id }: { id: string }) => {
  const [open, setOpen] = useState(false);
  const [deleteStudent, { isLoading }] = useDeleteStudentMutation();
  const deleteStudentHandler = async (id: string) => {
    const res = await deleteStudent(id);
    if (res.data?.success) {
      toast.success("Student deleted successfully");
    }
    if (res.error) {
      toast.error("Error in Student course");
    }
    setOpen(false);
  };
  return (
    <>
      <Trash2
        className="h-5 w-5 stroke-red-700 cursor-pointer"
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
            Are your sure you want to delete this student ?
          </h2>
          <div className="flex justify-end items-center gap-3 mt-3">
            <Button type="button" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              disabled={isLoading}
              type="button"
              onClick={() => deleteStudentHandler(id)}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default DeleteStudent;
