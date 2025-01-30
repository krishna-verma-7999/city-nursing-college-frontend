"use client";
import React, { useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { useGetCoursesQuery } from "@/store/api";
import { Button, Chip, Menu, MenuItem } from "@mui/material";
import { FilePenLine, Loader2 } from "lucide-react";
import DeleteCourse from "@/components/shared/delete-course";
import { redirect } from "next/navigation";
import DeleteSemester from "@/components/shared/delete-semester";
import { Semester } from "@/types";
import { calculateTotalFees, formatCurrency } from "@/utils";
const CustomToolbar = () => (
  <GridToolbarContainer className="toolbar flex gap-2">
    <GridToolbarFilterButton />
    <GridToolbarExport />
  </GridToolbarContainer>
);

const Page = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [menuOpenRowId, setMenuOpenRowId] = useState<string | number | null>(
    null
  );

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string | number
  ) => {
    setAnchorEl(event.currentTarget);
    setMenuOpenRowId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuOpenRowId(null);
  };

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
      field: "semesters",
      headerName: "Semesters",
      width: 100,
      renderCell: (params) => {
        const semesters: Semester[] = params.row?.semesters;
        return (
          <div>
            {semesters.length > 0 ? (
              <>
                {" "}
                <Button
                  variant="text"
                  size="small"
                  onClick={(event) => handleMenuOpen(event, params.id)}
                >
                  Semesters
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={menuOpenRowId === params.id}
                  onClose={handleMenuClose}
                  sx={{
                    "& .MuiPaper-root": {
                      width: "200px", // Set the desired width
                    },
                  }}
                >
                  {semesters.map((sem, index) => (
                    <MenuItem
                      key={index}
                      onClick={handleMenuClose}
                      className="flex !justify-between"
                    >
                      <span>{sem.semesterNumber} sem</span>
                      <span className="flex gap-2">
                        <DeleteSemester id={sem._id} />
                        <FilePenLine
                          className="h-5 w-5  stroke-green-800 cursor-pointer"
                          onClick={() => {
                            redirect(`/reports/coursewise/fees/${sem._id}`);
                          }}
                        />
                      </span>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            ) : (
              "N/A"
            )}
          </div>
        );
      },
    },
    {
      field: "General Fee",
      headerName: "General Fees",
      width: 120,
      renderCell: (params) => {
        const fees = calculateTotalFees(params.row);
        return <div>{formatCurrency(fees.general)}</div>;
      },
    },
    {
      field: "sc Fee",
      headerName: "SC Fees",
      width: 120,
      renderCell: (params) => {
        const fees = calculateTotalFees(params.row);
        return <div>{formatCurrency(fees.sc)}</div>;
      },
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
    <div className="py-5 px-2 max-w-7xl w-full mx-auto">
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
