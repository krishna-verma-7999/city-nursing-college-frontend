import { Caste, PaymentMode } from "@/store/api";

export interface ISuccessMessage {
  data?: unknown;
  success: boolean;
}

type FeeDetail = {
  caste: "general" | "sc"; // Use a union type for known caste values
  amount: number;
};

type Fee = {
  details: FeeDetail[]; // Array of fee details
  type: string; // Type of fee
};

export type Semester = {
  course: string; // Course ID
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  fees: Fee[]; // Array of fee objects
  semesterNumber: number; // Semester number
  __v: number; // Version key (from MongoDB)
  _id: string; // Semester ID
};

export type EditSemester = {
  course: string; // Course ID
  fees: Fee[]; // Array of fee objects
  semesterNumber: number; // Semester number
  _id: string; // Semester ID
};

export type CourseData = {
  _id: string;
  createdAt: string; // ISO date string
  description: string; // Course description
  duration: number; // Duration of the course
  name: string; // Course name
  semesters: Semester[]; // Array of semesters
  status: "COMPLETED" | "PENDING" | "IN_PROGRESS"; // Enum for course status
};
export type ApiResponse<T> = {
  data: T;
  message?: string;
  success?: boolean;
};

export type PaginatedApiResponse<T> = {
  data: {
    docs: T;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
    nextPage: number;
    page: number;
    pagingCounter: boolean;
    prevPage: number | null;
    totalDocs: number;
  };
  success?: boolean;
};

export type CreateStudent = {
  name: string;
  motherName: string;
  fatherName: string;
  category: Caste; // Enum type for category
  registrationNumber: string;
  registrationDate: Date;
  feesDiscount: number;
  course: string; // MongoDB ObjectId as a string
  aadharNo: string; // Must be 12 digits
  contactNo: string; // Valid mobile phone number
  address: string;
  dob: Date; // Date as a string (e.g., ISO format)
  session: number; // Object containing from and to properties
};

export type StudentData = {
  _id: string;
  registrationNumber: string;
  name: string;
  fatherName: string;
  motherName: string;
  dob: string; // ISO date string
  aadharNo: string; // Aadhar number as a string to preserve format
  address: string;
  category: string; // Example: "general"
  contactNo: string; // Contact number as a string to allow leading zeros
  course: CourseData; // Embedded course object
  session: number; // Session year
  registrationDate: string; // ISO date string
  feesDiscount: number; // Discount percentage
  netFees: number; // Calculated net fees
  description: string;
  isDeleted: boolean; // Deletion flag
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
};

export type StudentFeeData = {
  student: string;
  semester: string;
  totalFees: number;
  totalDiscount: number;
  balanceFees: number;
  paidAmount: number;
  modeOfPayment: PaymentMode;
  payDate: string;
  transactionId: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
};

export type Dashboard = {
  coursesCount: number;
  studentsCount: number;
  categoryWiseStudentsCount: {
    sc: number;
    general: number;
  };
  currentMonthFees: number;
  currentMonthBalanceFees: number;
};
