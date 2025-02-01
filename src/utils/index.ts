import { Caste } from "@/store/api";
import { CourseData, Semester } from "@/types";

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

export const calculateSemFees = (
  semester: Semester
): Record<string, number> => {
  const totalFees: { general: number; sc: number } = { general: 0, sc: 0 };

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const extractValidationMessage = (error: any): string => {
  if (error?.data?.data?.errors?.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return error.data?.data.errors.map((err: any) => err.msg).join(", ");
  }
  return error?.data?.message || "An unknown error occurred.";
};

export const flattingSemesterData = (data: Semester, category: Caste) => {
  return data.fees.flatMap((fee) =>
    fee.details
      .filter((detail) => detail.caste === category)
      .map((detail) => ({
        type: fee.type,
        amount: detail.amount,
      }))
  );
};
