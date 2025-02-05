import { MODE } from "@/constants";
import { PaymentMode } from "@/store/api";
import { formatCurrency } from "@/utils";

type FeesData = {
  registrationNumber: string;
  studentName: string;
  courseName?: string; // Optional in case course is undefined
  semesterYear: number;
  totalFees: string; // Assuming formatCurrency returns a string
  discount: string;
  netFees: string;
  payableFees: string;
  paidAmount: string;
  balanceFees: string;
  modeOfPayment: string;
  transactionNumber: string;
  paymentDate: string; // Since it's formatted using toLocaleDateString()
  semesterData: {
    type: string;
    amount: number;
  }[];
};

export const generateInvoiceTemplate = (feesData: FeesData) => {
  const invoiceTemplate = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<style>
    * {
        padding: 0px;
        margin: 0px;
    }

    body {
        box-sizing: border-box;
    }

    .invoice-header {
        padding-block: 20px;
        font-size: 16px;
        font-weight: bold;
        text-align: center;
        font-size: 25px;
        padding-inline: 10px;
    }

    .invoice-body {
        border-top: 1px solid #b6b6b6;
        border-bottom: 1px solid #b6b6b6;
        padding: 20px 15px;
    }

    .invoice-body h4 {
        text-align: center;
    }

    .student-info {
        border-top: 1px solid #b6b6b6;
        border-bottom: 1px solid #b6b6b6;
        padding-block: 20px;
        margin-top: 20px;
        display: flex;
        font-family: sans-serif;
        justify-content: space-around;
    }

    .student-info div,
    .summary-1 div {
        display: flex;
        flex-direction: column;
    }


    .student-info p,
    .summary-1 div {
        display: flex;
        justify-content: start;
        font-size: 16px;
    }

    .student-info p span:nth-child(1) {
        font-weight: 300;
        color: rgb(55, 52, 52);
        font-size: 14px;
    }

    .student-info p span:nth-child(2) {
        font-size: 15px;
    }


    .summary-1 span {
        font-weight: 300;
        color: rgb(55, 52, 52);
        font-size: 14px;
    }

    .summary-1 h5 {
        border-bottom: 1px solid #b6b6b6;
        padding-block: 8px;
        padding-left: 10px;
        text-align: center;
    }

    .fees-details-item {
        display: flex;
        row-gap:5px;
        justify-content: space-between;
        padding-block: 5px;
        padding-inline: 9px;
    }

    .invoice-footer {}
</style>

<body>
    <div class="invoice">
        <header class="invoice-header ">City Nursing College</header>
        <div class="invoice-body">
            <h4>Payment Receipt</h4>
            <div class="student-info">
                <div class="row-1">
                    <p class="fees-details-item" style="gap:5px">
                        <span>Registration No: </span>
                        <span>${feesData.registrationNumber}</span>
                    </p>
                    <p class="fees-details-item" style="gap:5px">
                        <span>Student: </span>
                        <span>${feesData.studentName}</span>
                    </p>
                    <p class="fees-details-item" style="gap:5px">
                        <span>Course: </span>
                        <span>${feesData.courseName}</span>
                    </p>
                </div>
                <div class="row-2">
                    <p class="fees-details-item" style="gap:5px">
                        <span>Payment Date: </span>
                        <span>${feesData.paymentDate}</span>
                    </p>
                    <p class="fees-details-item" style="gap:5px">
                        <span>Paid Amount: </span>
                        <span>${feesData.paidAmount}</span>
                    </p>
                    <p class="fees-details-item" style="gap:5px">
                        <span>Discount: </span>
                        <span>${feesData.discount}</span>
                    </p>
                </div>
            </div>
            <div class="fees-details">
                <h2 style="text-align: left; margin-block: 15px 5px; font-size: 18px;">Payment Summary</h2>
                <div style="border: 1px solid black;display: flex;">
                    <div class="summary-1" style="font-family: sans-serif; width: 50%; border-right: 1px solid black;">
                        <h5>
                            Fee Details
                        </h5>
                        <div style="display: flex;flex-direction: column; padding-bottom: 10px;">
                            <p class="fees-details-item" style="padding-top:10px; font-weight: bold; border-bottom: 1px solid #b6b6b6;">
                                <span style=" font-weight: bold;">Fee Type </span>
                                <span style="font-weight: bold;">Amount</span>
                            </p>
                            ${feesData.semesterData
                              .map(
                                (sem, i) =>
                                  `<p key={${i}} class="fees-details-item">
                                <span>${sem.type} </span>
                                <span>${formatCurrency(sem.amount)}</span>
                            </p>`
                              )
                              .join("")}
                        </div>
                    </div>
                    <div class="summary-1" style="font-family: sans-serif; width: 50%;">
                        <h5>
                            Payment Details
                        </h5>
                        <div style="display: flex;flex-direction: column; padding-bottom: 10px;">
                            <p class="fees-details-item" style="padding-top:10px;   font-weight: bold; border-bottom: 1px solid #b6b6b6;">
                                <span>Mode</span>
                                <span style="font-weight: bold;">${MODE[feesData.modeOfPayment as PaymentMode]}</span>
                            </p>
                            <p class="fees-details-item">
                                <span>Total Fees</span>
                                <span>${feesData.netFees}</span>
                            </p>
                            <p class="fees-details-item">
                                <span>Total Payable Fees</span>
                                <span>${feesData.payableFees}</span>
                            </p>
                            <p class="fees-details-item">
                                <span>Paid Fees </span>
                                <span>${feesData.paidAmount}</span>
                            </p>
                            <p class="fees-details-item">
                                <span>Balance Fees</span>
                                <span>${feesData.balanceFees}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</body>

</html>`;

  return invoiceTemplate;
};
