import { Caste, PaymentMode } from "@/store/api";
import * as yup from "yup";

const today = new Date();

export const loginSchema = yup
  .object({
    userName: yup
      .string()
      .required("Full name is required")
      .min(3, "Must be at least 3 characters"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  })
  .required();

export const courseSchema = yup.object({
  course: yup
    .string()
    .required("Course name is required")
    .min(3, "Must be at least 3 characters"),

  description: yup.string().optional(),

  duration: yup.string().required("Duration is required"),
});

export const feeSchema = yup.object({
  courseId: yup.string().required("Course is required"),
  semester: yup.string().required("semester is required"),
  feesType: yup
    .array()
    .of(
      yup.object().shape({
        type: yup.string().required("Fee type is required"),
        generalFees: yup
          .number()
          .required("General Fees is required")
          .min(1, "Amount must be greater than or equal to 0"),
        scFees: yup
          .number()
          .required("SC Fees is required")
          .min(1, "Amount must be greater than or equal to 0"),
      })
    )
    .min(1, "At least one fee type is required"), // Ensure at least one fee type is provided
});

export const studentSchema = yup.object({
  registrationNumber: yup.string().required("Registration number is required"),
  studentName: yup
    .string()
    .required("Student name is required")
    .min(2, "Student name must be at least 2 characters")
    .max(50, "Student name cannot exceed 50 characters"),
  motherName: yup
    .string()
    .required("Mother's name is required")
    .min(2, "Mother's name must be at least 2 characters")
    .max(50, "Mother's name cannot exceed 50 characters"),
  fatherName: yup
    .string()
    .required("Father's name is required")
    .min(2, "Father's name must be at least 2 characters")
    .max(50, "Father's name cannot exceed 50 characters"),
  registrationDate: yup
    .string() // Now treating it as a string for type="date" input
    .required("Registration date is required")
    .matches(
      /^\d{4}-\d{2}-\d{2}$/, // Regex to validate the date format as YYYY-MM-DD
      "Invalid date format"
    )
    .test(
      "is-not-future",
      "Registration date cannot be in the future",
      (value) => {
        if (!value) return true;
        const date = new Date(value);
        return date <= today; // Check if the date is not in the future
      }
    ),
  courseId: yup.string().required("Course is required"),
  discount: yup.string().required("Discount in fees is required"),
  dob: yup
    .string() // Now treating it as a string for type="date" input
    .required("DOB is required")
    .matches(
      /^\d{4}-\d{2}-\d{2}$/, // Regex to validate the date format as YYYY-MM-DD
      "Invalid date format"
    )
    .test("is-not-future", "DOB cannot be in the future", (value) => {
      if (!value) return true;
      const date = new Date(value);
      return date <= today; // Check if the date is not in the future
    }),
  aadharNumber: yup
    .string()
    .required("Aadhar number is required")
    .matches(/^\d{12}$/, "Aadhar number must be 12 digits"),
  address: yup
    .string()
    .required("Address is required")
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address cannot exceed 200 characters"),
  contact: yup
    .string()
    .required("Contact number is required")
    .matches(/^[6-9]\d{9}$/, "Invalid contact number"),
  category: yup
    .string()
    .required("Category is required")
    .oneOf([...Object.values(Caste)], "Invalid category"),
  fees: yup.string().required("Fees is required"),
  session: yup.string().required("Session is required"),
});

export const resetPasswordSchema = yup
  .object({
    newPassword: yup
      .string()
      .min(8, "Password must be at least 8 characters long") // Minimum length
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter") // At least one uppercase letter
      .matches(/[a-z]/, "Password must contain at least one lowercase letter") // At least one lowercase letter
      .matches(/[0-9]/, "Password must contain at least one number") // At least one digit
      .matches(
        /[@$!%*?&]/,
        "Password must contain at least one special character (@, $, !, %, *, ?, &)"
      )
      .required("New password is required"), // Ensures the field is not empty
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("newPassword")], "Passwords must match") // Confirms the password matches
      .required("Confirm password is required"), // Ensures the field is not empty
  })
  .required();

  export const studentFeesSchema = yup
  .object({
    course: yup.string().required("Course is required"),
    semester: yup.string().required("Semester is required"),
  paidAmount: yup
    .number()
    .required('Fees Paid is required')
    .typeError('Fees Paid must be a number'),
    payDate: yup.date().required('Paid on Date is required').typeError('Invalid date'),

    modeOfPayment: yup
    .string()
    .required('Mode of payment is required')
    .oneOf(Object.values(PaymentMode))
    .typeError(`Mode of payment must be a with in ${Object.values(PaymentMode).join(', ')})}`),

    transactionId: yup
    .string()
    .when("modeOfPayment", {
      is: PaymentMode.ONLINE_TRANSFER, // Condition: Only validate when modeOfPayment is "online"
      then: (schema) => schema.required("Transaction ID is required for online payments"),
      otherwise: (schema) => schema.notRequired(), // Not required for other modes
    }),
    balanceFees: yup.number().required('Balance Fees is required'),
    totalFees: yup.number().required('Total fees is required'),
    discount: yup.number().required('Discount is required'),
    session: yup.number().required('Session is required'),
    studentId: yup.string().required('Student ID is required'),

  })
  .required();

  export const studentFeesSearchSchema = yup
  .object({
    registerationNumber: yup.string().required('Register Number is required'),
})
.required();
