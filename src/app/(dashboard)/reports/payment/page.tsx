"use client";
import React, { useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import { PaymentMode, useGetBalanceFeesQuery } from "@/store/api";
import { Download, Loader2 } from "lucide-react";
import { calculateSemFees, formatCurrency } from "@/utils";
import { Button } from "@mui/material";
import Papa from "papaparse";
import { MODE } from "@/constants";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleGenerateInvoice = (rowData: any) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doc: any = new jsPDF();

  // Add a title
  doc.setFontSize(18);
  doc.text("Invoice", 10, 20);

  // Define table data
  const tableData = [
    ["Description", "Amount"],
    ["Registration Number", rowData.student.registrationNumber],
    ["Student Name", rowData.student.name],
    ["Course Name", rowData.student?.course?.name],
    ["Semester/Year", rowData.semester.semesterNumber],
    [
      "Total Fees",
      formatCurrency(
        calculateSemFees(rowData.semester)[rowData.student.category]
      ),
    ],
    ["Discount", formatCurrency(rowData.totalDiscount)],
    ["Net Fees", formatCurrency(rowData.totalFees)],
    ["Paid Amount", formatCurrency(rowData.paidAmount)],
    ["Balance Fees", formatCurrency(rowData.balanceFees)],
    ["Mode of payment", rowData.modeOfPayment],
    ["Payment Date", new Date(rowData.payDate).toLocaleDateString()],
  ];

  // Generate the table using autoTable

  doc.autoTable({
    startY: 30, // Start table below the title
    head: [tableData[0]], // First row as header
    body: tableData.slice(1), // Rest of the rows as body
    theme: "striped", // Apply a striped theme
    styles: { fontSize: 12, cellPadding: 5 }, // Custom styles
    headStyles: { fillColor: [22, 160, 133] }, // Green header background
    columnStyles: {
      0: { cellWidth: 120 }, // Description column width
      1: { cellWidth: 60 }, // Amount column width
    },
  });

  // Save the PDF
  doc.save(`Invoice_${rowData.student.registrationNumber}.pdf`);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomToolbar = ({ data }: { data: any[] }) => {
  const handleExport = () => {
    const exportData = data.map((row) => {
      const semesterFees = calculateSemFees(row.semester);
      const categoryWiseFees = semesterFees[row.student.category];

      return {
        ID: row.id,
        "Registration Number": row.student?.registrationNumber || "N/A",
        "Student Name": row.student?.name || "N/A",
        "Course Name": row.student?.course?.name || "N/A",
        "Semester / Year": row.semester?.semesterNumber || "N/A",
        "Total Fees": categoryWiseFees || 0,
        Discount: row.totalDiscount || 0,
        "Net Fees": row.totalFees || 0,
        "Balance Fees": row.balanceFees || 0,
        "Paid Amount": row.paidAmount || 0,
        "Payment Date": row.payDate
          ? new Date(row.payDate).toLocaleDateString()
          : "N/A",
        "Transaction Id":
          row.modeOfPayment === PaymentMode.ONLINE_TRANSFER
            ? row.transactionId
            : "--",
        "Cheque No.":
          row.modeOfPayment === PaymentMode.CHEQUE ? row.transactionId : "--",
        "Mode of Payment": MODE[row.modeOfPayment as PaymentMode] || "N/A",
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
    link.download = "BalanceFees.csv";
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
  {
    field: "registerNumber",
    headerName: "Registration Number",
    width: 150,
    renderCell: (params) => {
      return params.row.student.registrationNumber;
    },
  },
  {
    field: "studentName",
    headerName: "Student Name",
    width: 150,
    renderCell: (params) => {
      return params.row.student.name;
    },
  },
  {
    field: "courseName",
    headerName: "Course Name",
    width: 150,
    renderCell: (params) => {
      return params.row.student.course.name;
    },
  },
  {
    field: "semesterNumber",
    headerName: "Semester / Year",
    width: 125,
    renderCell: (params) => {
      return params.row.semester.semesterNumber;
    },
  },
  {
    field: "netFees",
    headerName: "Total Fees",
    width: 150,
    renderCell: (params) => {
      const totalFees = calculateSemFees(params.row.semester);
      const categoryWiseFees = totalFees[params.row.student.category];
      return formatCurrency(categoryWiseFees);
    },
  },

  {
    field: "totalDiscount",
    headerName: "Discount",
    width: 150,
    renderCell: (params) => formatCurrency(params.value),
  },
  {
    field: "totalFees",
    headerName: "Net Fees",
    width: 150,
    renderCell: (params) => formatCurrency(params.value),
  },
  {
    field: "balanceFees",
    headerName: "Balance Fees",
    width: 150,
    renderCell: (params) => formatCurrency(params.value),
  },
  {
    field: "paidAmount",
    headerName: "Paid Amount",
    width: 150,
    renderCell: (params) => formatCurrency(params.value),
  },

  {
    field: "payDate",
    headerName: "Payment Date",
    width: 150,
    renderCell: (params) => new Date(params.value).toLocaleDateString(),
  },
  {
    field: "transactionId",
    headerName: "Transaction Id",
    width: 150,
    renderCell: (params) => {
      const paymentMode = params.row.modeOfPayment;
      return `${paymentMode === PaymentMode.ONLINE_TRANSFER ? params.value : "--"}`;
    },
  },
  {
    field: "chequeNo.",
    headerName: "Cheque No.",
    width: 150,
    renderCell: (params) => {
      const paymentMode = params.row.modeOfPayment;
      return `${paymentMode === PaymentMode.CHEQUE ? params.row.transactionId : "--"}`;
    },
  },
  {
    field: "modeOfPayment",
    headerName: "Mode of payment",
    width: 150,
    renderCell: (params) => `${MODE[params.value as PaymentMode]}`,
  },
  {
    field: "action",
    headerName: "Action",
    width: 200,
    renderCell: (params) => {
      return (
        <Button
          onClick={() => handleGenerateInvoice(params.row)}
          variant="outlined"
        >
          Generate Invoice
        </Button>
      );
    },
  },
];

const Page = () => {
  const [searchStudent, setSearchStudent] = useState("");
  const [registeredNumber, setRegisteredNumber] = useState("");
  const { data, isLoading } = useGetBalanceFeesQuery({
    haveBalanceFees: false,
    student: searchStudent,
  });
  const balanceFees = data?.data.map((row, index) => ({
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

  const handleSearch = () => {
    setSearchStudent(registeredNumber); // Update searchNumber only on submit
    setRegisteredNumber("");
  };

  return (
    <div className="py-5 px-2 max-w-7xl w-full mx-auto">
      <div className="rounded-md p-1 flex items-center gap-2 mx-3 my-5">
        <div className="flex-1">
          <input
            type="text"
            value={registeredNumber}
            onChange={(e) => setRegisteredNumber(e.target.value)}
            placeholder="Registration Number"
            className={
              "w-full rounded border border-gray-300 p-2 dark:border-dark-tertiary dark:bg-dark-tertiary focus:outline-none dark:text-white dark:focus:outline-none"
            }
          />
        </div>
        <div>
          <div className="space-x-2 w-full flex">
            <Button onClick={handleSearch} variant="outlined">
              Search
            </Button>
          </div>
        </div>
      </div>
      <div className="h-[400px] w-full justify-center items-center flex">
        {balanceFees && balanceFees.length > 0 ? (
          <DataGrid
            rows={balanceFees}
            columns={columns}
            sx={{
              marginInline: "15px",
            }}
            rowSelection={false}
            getRowId={(row) => row.id}
            pagination
            slots={{
              toolbar: () => <CustomToolbar data={balanceFees} />,
            }}
          />
        ) : (
          <p className="text-center ">No Balance Fees Yet</p>
        )}
      </div>
    </div>
  );
};

export default Page;
