import {
  ApiResponse,
  CreateStudent,
  CourseData,
  StudentData,
  PaginatedApiResponse,
  StudentFeeData,
  Semester,
  EditSemester,
  Dashboard,
} from "@/types";
import {
  // BaseQueryFn,
  createApi,
  // FetchArgs,
  fetchBaseQuery,
  // FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
// import { redirect, useRouter } from "next/navigation";

export type Login = {
  userName: string;
  password: string;
};

type CreateCourse = {
  name: string;
  duration: string;
  description?: string;
};
type EditCourse = CreateCourse & { _id: string };
type EditStudent = CreateStudent & { _id: string };

type CreateFeesStructure = {
  course: string;
  semesterNumber: number;
  fees: {
    type: string;
    details: {
      caste: string;
      amount: number;
    }[];
  }[];
};
type CreateStudentFeePayload = {
  student: string;
  semester: string;
  paidAmount: number;
  modeOfPayment: PaymentMode;
  payDate: string;
  transactionId?: string;
};
type ResetPassword = {
  password: string;
  confirmPassword: string;
};

export enum Caste {
  SC = "sc",
  General = "general",
}

export enum PaymentMode {
  CASH = "CASH",
  CHEQUE = "CHEQUE",
  ONLINE_TRANSFER = "ONLINE_TRANSFER",
}
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// const baseQueryWithAuth: BaseQueryFn<
//   string | FetchArgs,
//   unknown,
//   FetchBaseQueryError
// > = async (args, api, extraOptions) => {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const result: any = await baseQuery(args, api, extraOptions);
//   console.log("result", result);
//   if (
//     result.error &&
//     result.error.status === 500 &&
//     result.error.data?.message === "jwt expired"
//   ) {
//     const router = useRouter();
//     redirect("/logout");
//     return;
//   }

//   return result;
// };

export const api = createApi({
  baseQuery,
  reducerPath: "api",
  tagTypes: ["course", "fees", "students", "student-fees"],
  endpoints: (build) => ({
    login: build.mutation<{ data: { accessToken: string } }, Login>({
      query: (user) => ({
        url: "/auth/login",
        method: "POST",
        body: user,
      }),
    }),
    resetPassword: build.mutation<ApiResponse<void>, ResetPassword>({
      query: (password) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: password,
      }),
    }),
    createCourse: build.mutation<ApiResponse<CourseData>, CreateCourse>({
      query: (course) => ({
        url: "/course",
        method: "POST",
        body: course,
      }),
      invalidatesTags: ["course"],
    }),
    editCourse: build.mutation<ApiResponse<CourseData>, EditCourse>({
      query: (course) => ({
        url: `/course/${course._id}`,
        method: "PUT",
        body: course,
      }),
      invalidatesTags: ["course"],
    }),
    getCourses: build.query<
      ApiResponse<CourseData[]>,
      { status?: "COMPLETED" | "PENDING" | "" }
    >({
      query: ({ status = "" }) => {
        return {
          url: `/course?isPopulateSemsters=1`,
          method: "GET",
          params: { status },
        };
      },
      providesTags: ["course"],
    }),
    getCourseById: build.query<ApiResponse<CourseData>, string>({
      query: (id) => ({
        url: `/course/${id}`,
        method: "GET",
      }),
      providesTags: ["course"],
    }),
    getStudentById: build.query<ApiResponse<StudentData>, string>({
      query: (id) => ({
        url: `/student/${id}`,
        method: "GET",
      }),
      providesTags: ["students"],
    }),
    deleteCourses: build.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/course/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["course"],
    }),
    createFees: build.mutation<ApiResponse<void>, CreateFeesStructure>({
      query: (fees) => ({
        url: `/semester`,
        method: "POST",
        body: fees,
      }),
      invalidatesTags: ["course", "fees", "students"],
    }),
    createStudent: build.mutation<ApiResponse<void>, CreateStudent>({
      query: (student) => ({
        url: `/student`,
        method: "POST",
        body: student,
      }),
      invalidatesTags: ["students"],
    }),
    getStudents: build.query<PaginatedApiResponse<StudentData[]>, void>({
      query: () => {
        return {
          url: `/student`,
          method: "GET",
        };
      },
      providesTags: ["students"],
    }),
    deleteStudent: build.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/student/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["students"],
    }),
    editStudent: build.mutation<ApiResponse<StudentData>, EditStudent>({
      query: (student) => ({
        url: `/student/${student._id}`,
        method: "PUT",
        body: student,
      }),
      invalidatesTags: ["students"],
    }),
    getLatestStudentFee: build.query<
      ApiResponse<StudentFeeData>,
      { student: string; semester: string }
    >({
      query: ({ student, semester }) => ({
        url: `/fees/latest`,
        method: "GET",
        params: {
          semester,
          student,
        },
      }),
    }),
    createStudentFee: build.mutation<
      ApiResponse<StudentFeeData>,
      CreateStudentFeePayload
    >({
      query: (fees) => ({
        url: `/fees`,
        method: "POST",
        body: fees,
      }),
      invalidatesTags: ["student-fees"],
    }),
    deleteSemester: build.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/semester/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["students", "course"],
    }),
    getFeesById: build.query<ApiResponse<Semester>, string>({
      query: (id) => ({
        url: `/semester/${id}`,
        method: "GET",
      }),
      providesTags: ["fees"],
    }),
    editFees: build.mutation<ApiResponse<Semester>, EditSemester>({
      query: (semester) => ({
        url: `/semester/${semester._id}`,
        method: "PUT",
        body: semester,
      }),
      invalidatesTags: ["fees", "course", "students"],
    }),
    dashboard: build.query<ApiResponse<Dashboard>, void>({
      query: () => ({
        url: `/dashboard/cards`,
        method: "GET",
      }),
      providesTags: ["fees", "course", "student-fees", "students"],
    }),
  }),
});

export const {
  useLoginMutation,
  useCreateCourseMutation,
  useGetCoursesQuery,
  useDeleteCoursesMutation,
  useCreateFeesMutation,
  useLazyGetCourseByIdQuery,
  useEditCourseMutation,
  useCreateStudentMutation,
  useGetStudentsQuery,
  useResetPasswordMutation,
  useLazyGetStudentsQuery,
  useDeleteStudentMutation,
  useEditStudentMutation,
  useLazyGetStudentByIdQuery,
  useGetStudentByIdQuery,
  useLazyGetLatestStudentFeeQuery,
  useCreateStudentFeeMutation,
  useDeleteSemesterMutation,
  useLazyGetFeesByIdQuery,
  useEditFeesMutation,
  useDashboardQuery,
} = api;
