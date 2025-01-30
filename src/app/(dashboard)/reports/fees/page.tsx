"use client";
import React from "react";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import { useGetSemesterQuery } from "@/store/api";
import { Download, Loader2 } from "lucide-react";
import { calculateSemFees, formatCurrency } from "@/utils";
import Papa from "papaparse";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "course",
    headerName: "Course Name",
    width: 150,
    renderCell: (params) => {
      return params.row.course?.name || "N/A"; // Access `name` from the `course` object
    },
  },
  { field: "semesterNumber", headerName: "Semester / Year", width: 150 },
  {
    field: "generalFees",
    headerName: "General Fees",
    width: 150,
    renderCell: (params) => {
      const totalFees = calculateSemFees(params.row);
      return formatCurrency(totalFees.general);
    },
  },
  {
    field: "scFees",
    headerName: "SC Fees",
    width: 150,
    renderCell: (params) => {
      const totalFees = calculateSemFees(params.row);
      return formatCurrency(totalFees.sc);
    },
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomToolbar = ({ data }: { data: any[] }) => {
  const handleExport = () => {
    // Transform data for export
    const exportData = data.map((row) => ({
      id: row.id,
      course: row.course?.name || "N/A",
      semesterNumber: row.semesterNumber,
      generalFees: formatCurrency(calculateSemFees(row).general),
      scFees: formatCurrency(calculateSemFees(row).sc),
    }));

    // Convert to CSV
    const csv = Papa.unparse(exportData, {
      header: true, // Include headers in the CSV
    });

    // Create a Blob and trigger download
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Semesters.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <GridToolbarContainer className="toolbar flex gap-2">
      <GridToolbarFilterButton />
      <button
        onClick={handleExport}
        className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        <Download className="h-4 w-4" />
        Export
      </button>
    </GridToolbarContainer>
  );
};

const Page = () => {
  const { data: semesterFees, isLoading } = useGetSemesterQuery();

  // Ensure each row has a unique `id` field
  const semesterData = semesterFees?.data?.map((row, index) => ({
    id: index + 1, // Use the unique ID from the API response
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
    <div className="py-5 px-2 max-w-7xl w-full mx-auto">
      <div className="h-[400px] w-full justify-center items-center flex">
        {semesterData && semesterData?.length > 0 ? (
          <DataGrid
            rows={semesterData}
            columns={columns}
            rowSelection={false}
            getRowId={(row) => row.id} // Ensure this matches the ID in `semesterData`
            pagination
            pageSizeOptions={[5, 10, 25, 50]}
            slots={{
              toolbar: () => <CustomToolbar data={semesterData} />,
            }}
          />
        ) : (
          <p className="text-center ">No Semester Found</p>
        )}
      </div>
    </div>
  );
};

export default Page;
