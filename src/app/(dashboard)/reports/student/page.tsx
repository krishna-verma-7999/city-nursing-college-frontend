"use client";
import React from "react";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { useGetStudentsQuery } from "@/store/api";
import { FilePenLine, Loader2 } from "lucide-react";
import DeleteStudent from "@/components/shared/delete-student";
import { redirect } from "next/navigation";
import { calculateTotalFees, formatCurrency } from "@/utils";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 90 },
  { field: "registrationNumber", headerName: "Registration Number", width: 90 },
  { field: "name", headerName: "Student Name", width: 150 },
  { field: "fatherName", headerName: "Father's Name", width: 150 },
  { field: "motherName", headerName: "Mother's Name", width: 150 },
  {
    field: "course",
    headerName: "Course",
    width: 150,
    renderCell: (params) => <span>{params.formattedValue.name}</span>,
  },
  { field: "category", headerName: "Category", width: 150 },

  {
    field: "fees",
    headerName: "Fees",
    width: 150,
    renderCell: (params) => {
      const category = params.row.category as string;
      const fees: Record<string, number> = calculateTotalFees(
        params.row.course
      );
      const totalFees = fees[category];
      return formatCurrency(totalFees);
    },
  },
  {
    field: "feesDiscount",
    headerName: "Discount",
    width: 150,
    renderCell: (params) => formatCurrency(params.value),
  },
  {
    field: "netFees",
    headerName: "Net Fees",
    width: 150,
    renderCell: (params) => formatCurrency(params.value),
  },
  {
    field: "dob",
    headerName: "DOB",
    width: 150,
    renderCell: (params) => new Date(params.value).toLocaleDateString(),
  },
  { field: "contactNo", headerName: "Phone Number", width: 150 },
  { field: "session", headerName: "Session", width: 75 },
  {
    field: "",
    headerName: "Action",
    width: 120,
    renderCell: (params) => (
      <div className="flex justify-start items-center align-middle h-full gap-x-4">
        <DeleteStudent id={params.row._id} />
        <FilePenLine
          className="h-5 w-5  stroke-green-800 cursor-pointer"
          onClick={() => {
            redirect(`/reports/student/${params.row.registrationNumber}`);
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
  const { data: students, isLoading } = useGetStudentsQuery();
  const studentsData = students?.data?.docs.map((row, index) => ({
    id: index + 1,
    ...row,
  }));
  // const coursesData = courses?.data?.map((row, index) => ({
  //   id: index + 1,
  //   ...row,
  // }));

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
        {studentsData && studentsData.length > 0 ? (
          <DataGrid
            rows={studentsData}
            columns={columns}
            rowSelection={false}
            getRowId={(row) => row.id}
            pagination
            slots={{
              toolbar: CustomToolbar,
            }}
          />
        ) : (
          <p className="text-center ">No Student Found</p>
        )}
      </div>
    </div>
  );
};

export default Page;
