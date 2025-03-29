"use client";
import React from "react";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import { PaymentMode, useGetSupplyFeesQuery } from "@/store/api";
import { Download, Loader2 } from "lucide-react";
import {
  calculateSemFees,
  flattingSemesterData,
  formatCurrency,
} from "@/utils";
import { Button } from "@mui/material";
import Papa from "papaparse";
import { MODE } from "@/constants";
import html2pdf from "html2pdf.js";
import { generateSupplyInvoiceTemplate } from "@/pdf/template";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleGenerateInvoice = (rowData: any) => {
  const semesterFees = calculateSemFees(rowData.semester);
  const categoryWiseFees = semesterFees[rowData.student.category];
  const netFees = categoryWiseFees - rowData.totalDiscount;
  const semesterData = flattingSemesterData(
    rowData.semester,
    rowData.student.category
  );
  const transactionId = rowData.row?.transactionId;
  const feesData = {
    registrationNumber: rowData.student.registrationNumber,
    studentName: rowData.student.name,
    courseName: rowData.student?.course?.name,
    semesterYear: rowData.semester.semesterNumber,
    totalFees: formatCurrency(categoryWiseFees),
    discount: formatCurrency(rowData.totalDiscount),
    netFees: formatCurrency(netFees),
    transactionNumber: transactionId,
    payableFees: formatCurrency(netFees - rowData.balanceFees),
    paidAmount: formatCurrency(rowData.paidAmount),
    balanceFees: formatCurrency(rowData.balanceFees),
    modeOfPayment: rowData.modeOfPayment,
    paymentDate: new Date(rowData.payDate).toLocaleDateString(),
    semesterData,
    remark: rowData?.remark ?? "--",
  };

  const newDate = new Date().toLocaleDateString();
  const invoiceTemplate = generateSupplyInvoiceTemplate(feesData);
  const element = document.createElement("div");
  element.innerHTML = invoiceTemplate;
  document.body.appendChild(element);

  // Convert HTML to PDF with custom size
  html2pdf()
    .set({
      filename: `invoice_${rowData.student.registrationNumber}_${newDate}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: {
        unit: "mm",
        format: [240, 180], // Custom width and height (in mm)
        orientation: "portrait",
      },
    })
    .from(element)
    .save()
    .then(() => {
      document.body.removeChild(element); // Clean up
    });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomToolbar = ({ data }: { data: any[] }) => {
  const handleExport = () => {
    const exportData = data.map((row) => {
      return {
        ID: row.id,
        "Registration Number": row.student?.registrationNumber || "N/A",
        "Student Name": row.student?.name || "N/A",
        "Course Name": row.student?.course?.name || "N/A",
        "Subject Name": row.subject || "N/A",
        "Supply Number": row.supplyNumber || "N/A",
        "Semester / Year": row.semester?.semesterNumber || "N/A",
        "Paid Amount": row.paidAmount || 0,
        "Payment Date": row.payDate
          ? new Date(row.payDate).toLocaleDateString()
          : "N/A",
        Remark: row?.remark || "--",
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
    field: "subject",
    headerName: "Subject Name",
    width: 125,
  },
  {
    field: "supplyNumber",
    headerName: "Supply Number",
    width: 125,
    renderCell: (params) => {
      return params.row.supplyNumber || "--";
    },
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
    field: "remark",
    headerName: "Remark",
    width: 150,
    renderCell: (params) => params?.value || "--",
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
    renderCell: (params) => {
      const paidAmount = params.row.paidAmount;
      return `${paidAmount > 0 ? MODE[params.value as PaymentMode] : "--"}`;
    },
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
  const { data, isLoading } = useGetSupplyFeesQuery();

  const supplyFees = data?.data?.map((row, index) => ({
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
    <div className="py-5 px-2  w-full mx-auto">
      <div className="h-[400px] w-full justify-center items-center flex">
        {supplyFees && supplyFees.length > 0 ? (
          <DataGrid
            rows={supplyFees}
            columns={columns}
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
            rowSelection={false}
            getRowId={(row) => row.id}
            paginationMode="client"
            pageSizeOptions={[5, 10, 25, 50]}
            slots={{
              toolbar: () => <CustomToolbar data={supplyFees} />,
            }}
          />
        ) : (
          <p className="text-center ">No Transactions Yet</p>
        )}
      </div>
    </div>
  );
};

export default Page;
