"use client";
import React from "react";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { useGetCoursesQuery } from "@/store/api";
import { Chip } from "@mui/material";
import { FilePenLine, Loader2 } from "lucide-react";
import DeleteCourse from "@/components/shared/delete-course";
import { redirect } from "next/navigation";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 90 },
  { field: "name", headerName: "Course Name", width: 150 },
  {
    field: "duration",
    headerName: "Duration",
    width: 150,
    renderCell: (params) => (
      <div>
        {params.value} Semester{params.value > 1 && "s"}
      </div>
    ),
  },
  {
    field: "status",
    headerName: "Status",
    width: 120,
    renderCell: (params) => (
      <Chip
        label={params.value}
        sx={{
          backgroundColor: params.value === "PENDING" ? "#F7CB73" : "#077E8C",
          color: params.value === "PENDING" ? "black" : "white",
        }}
      />
    ),
  },
  {
    field: "_id",
    headerName: "Action",
    width: 120,
    renderCell: (params) => (
      <div className="flex justify-start items-center align-middle h-full gap-x-4">
        <DeleteCourse id={params.row._id} />
        <FilePenLine
          className="h-5 w-5  stroke-green-800 cursor-pointer"
          onClick={() => {
            redirect(`/reports/coursewise/${params.row._id}`);
          }}
        />
      </div>
    ),
  },
];

const CustomToolbar = () => (
  <GridToolbarContainer className="toolbar flex gap-2">
    <GridToolbarFilterButton />
    <GridToolbarExport />
  </GridToolbarContainer>
);

const Page = () => {
  const { data: courses, isLoading } = useGetCoursesQuery({});

  const coursesData = courses?.data?.map((row, index) => ({
    id: index + 1,
    ...row,
  }));

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="animate-spin h-5 w-5" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="h-[400px] w-full justify-center items-center flex">
        {coursesData && coursesData.length > 0 ? (
          <DataGrid
            rowSelection={false}
            rows={coursesData}
            columns={columns}
            getRowId={(row) => row.id}
            pagination
            slots={{
              toolbar: CustomToolbar,
            }}
          />
        ) : (
          <p className="text-center ">No Course Found</p>
        )}
      </div>
    </div>
  );
};

export default Page;
