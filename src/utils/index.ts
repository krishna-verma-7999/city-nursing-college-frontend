import { CourseData } from "@/types";

export const formatCurrency = (amount: number) => {
  const formattedValue = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);

  return formattedValue;
};

export const calculateTotalFees = (
  courseData: CourseData
): Record<string, number> => {
  const totalFees: { general: number; sc: number } = { general: 0, sc: 0 };

  courseData.semesters?.forEach((semester) => {
    semester.fees?.forEach((fee) => {
      fee.details?.forEach((detail) => {
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

export const calculateSemesterFees = (
  courseData: CourseData,
  semesterNumber: string
): Record<string, number> => {
  const totalFees: { general: number; sc: number } = { general: 0, sc: 0 };

  // Find the specific semester by semesterNumber
  const semester = courseData.semesters?.find(
    (sem) => sem._id === semesterNumber
  );

  // Calculate fees only for the specific semester
  semester?.fees?.forEach((fee) => {
    fee.details?.forEach((detail) => {
      if (detail.caste === "general") {
        totalFees.general += detail.amount;
      } else if (detail.caste === "sc") {
        totalFees.sc += detail.amount;
      }
    });
  });

  return totalFees;
};
