/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import React, { useEffect, useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import { useGetStudentsQuery } from "@/store/api";
import { Download, FilePenLine, Loader2 } from "lucide-react";
import DeleteStudent from "@/components/shared/delete-student";
import { redirect } from "next/navigation";
import { calculateTotalFees, formatCurrency } from "@/utils";
import { Button } from "@mui/material";
import Papa from "papaparse";
import { StudentData } from "@/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomToolbar = ({ data }: { data: any[] }) => {
  const handleExport = () => {
    const exportData = data.map((row) => {
      const fees = calculateTotalFees(row.course);
      const totalFees = fees[row.category] || 0;
      const discount = row.feesDiscount;
      const netFees = totalFees - discount;

      return {
        ID: row.id,
        "Registration Number": row.registrationNumber,
        "Student Name": row.name,
        "Father's Name": row.fatherName,
        "Mother's Name": row.motherName,
        Course: row.course?.name || "N/A",
        Category: row.category,
        Fees: totalFees,
        Discount: row.feesDiscount,
        "Net Fees": netFees,
        DOB: new Date(row.dob).toLocaleDateString(),
        "Phone Number": row.contactNo,
        "Enrollment Year": row.session,
      };
    });

    // Convert to CSV
    const csv = Papa.unparse(exportData, {
      header: true, // Include headers in the CSV
    });

    // Create a Blob and trigger download
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Students.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <GridToolbarContainer className="toolbar flex gap-2">
      <GridToolbarFilterButton />
      <Button
        variant="text"
        onClick={handleExport}
        className="flex gap-2 items-center"
      >
        <Download className="h-4 w-4" />
        Export
      </Button>
    </GridToolbarContainer>
  );
};

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
    renderCell: (params) => {
      const category = params.row.category as string;
      const fees: Record<string, number> = calculateTotalFees(
        params.row.course
      );
      const totalFees = fees[category];
      const discount = params.row.feesDiscount;
      const netFees = totalFees - discount;
      return formatCurrency(netFees);
    },
  },
  {
    field: "dob",
    headerName: "DOB",
    width: 150,
    renderCell: (params) => new Date(params.value).toLocaleDateString(),
  },
  { field: "contactNo", headerName: "Phone Number", width: 150 },
  { field: "session", headerName: "Enrollment Year", width: 75 },
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

const Page = () => {
  const [registerationNumber, setRegistrationNumber] = useState<
    string | undefined
  >(undefined);
  const [studentRegistrationNumber, setStudentRegistrationNumber] = useState<
    string | undefined
  >(undefined);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const {
    data: students,
    isLoading,
    refetch,
  } = useGetStudentsQuery({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    studentRegistrationNumber,
  });
  const { data: allStudents } = useGetStudentsQuery({
    page: -1,
    limit: -1,
    studentRegistrationNumber,
  });

  useEffect(() => {
    refetch();
  }, [paginationModel, refetch]);

  const totalRowCount = students?.data.totalDocs;
  const studentsData = students?.data?.docs.map((row, index) => ({
    id: index + 1,
    ...row,
  }));
  const studentsWithoutPagination = allStudents as any;
  const allStudentData = studentsWithoutPagination?.data.map(
    (row: StudentData, index: number) => ({
      id: index + 1,
      ...row,
    })
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="animate-spin h-5 w-5" />
      </div>
    );
  }

  const searchStudentHandler = () => {
    setStudentRegistrationNumber(registerationNumber);
  };

  const inputStyles =
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary focus:outline-none dark:text-white dark:focus:outline-none";

  return (
    <div className="py-5 px-2 w-full mx-auto">
      <div className="mb-4 px-4">
        <div className="rounded-md p-1 flex items-center gap-2  mx-auto ">
          <input
            className={inputStyles}
            type="text"
            placeholder="Registration Number"
            value={registerationNumber}
            onChange={(e) => {
              const target = e.currentTarget;
              target.value = target.value.replace(/[^0-9]/g, "");
              setRegistrationNumber(target.value);
            }}
          />
          <Button
            type="submit"
            className="w-fit !mt-0"
            variant="contained"
            onClick={searchStudentHandler}
          >
            Search
          </Button>
        </div>
      </div>
      <div className="h-[400px] w-full justify-center items-center flex">
        {studentsData && studentsData.length > 0 ? (
          <DataGrid
            rows={studentsData}
            columns={columns}
            rowSelection={false}
            getRowId={(row) => row.id}
            pagination
            sx={{
              marginInline: "15px",
              "& .MuiDataGrid-cell:focus": {
                outline: "none",
              },
              "& .MuiDataGrid-columnHeader:focus": {
                outline: "none",
              },
              "& .MuiDataGrid-columnHeader:focus-within": {
                outline: "none",
              },
            }}
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[5, 10, 25, 50]}
            rowCount={totalRowCount}
            slots={{
              toolbar: () => <CustomToolbar data={allStudentData} />,
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
