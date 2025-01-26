import { CourseData } from "@/types";

export const formatCurrency = (amount: number) => {
  const formattedValue = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);

  return formattedValue;
};

export const calculateTotalFees = (courseData: CourseData) => {
  const totalFees: { general: number; sc: number } = { general: 0, sc: 0 };

  courseData.semesters.forEach((semester) => {
    semester.fees.forEach((fee) => {
      fee.details.forEach((detail) => {
        if (detail.caste === "general") {
          totalFees.general += detail.amount;
        } else if (detail.caste === "sc") {
          totalFees.sc += detail.amount;
        }
      });
    });
  });

  return totalFees;
};
