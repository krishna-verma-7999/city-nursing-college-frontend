/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { InferType } from "yup";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

import Button from "@/components/shared/button";
import Input from "@/components/shared/input";
import { studentFeesSearchSchema, supplyFeesSchema } from "@/schema";
import {
  PaymentMode,
  useCreateStudentSupplyMutation,
  useLazyGetStudentByIdQuery,
  useLazyGetStudentCountQuery,
} from "@/store/api";
import { StudentData } from "@/types";
import DatePicker from "@/components/shared/date-picker";
import { MODE } from "@/constants";
import { redirect } from "next/navigation";
import LoadingPage from "@/components/shared/loadingPage";

type SemesterType = { value: string; label: number }[];

const Page = () => {
  const [student, setStudent] = useState<StudentData | null>(null);
  const [semesters, setSemesters] = useState<SemesterType>([]);
  const [debouncedSubjectName, setDebouncedSubjectName] = useState("");

  const [searchStudent, { isLoading: isStudentFetching }] =
    useLazyGetStudentByIdQuery();
  const [studentCount, { isLoading: isFetchingLatestFee }] =
    useLazyGetStudentCountQuery();
  const [createStudentSupply, { isLoading: isCreatingFee }] =
    useCreateStudentSupplyMutation();

  // Student search form
  const {
    register: searchRegister,
    handleSubmit: handleSearchSubmit,
    formState: { errors: searchErrors },
    reset: searchReset,
  } = useForm<InferType<typeof studentFeesSearchSchema>>({
    resolver: yupResolver(studentFeesSearchSchema),
    defaultValues: {
      registerationNumber: "",
    },
  });

  // Fee submission form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset: feeReset,
  } = useForm<InferType<typeof supplyFeesSchema>>({
    resolver: yupResolver(supplyFeesSchema),
    defaultValues: {
      name: "",
      semester: "",
      fatherName: "",
      course: "",
      modeOfPayment: PaymentMode.ONLINE_TRANSFER,
      paidAmount: 0,
      payDate: "",
      session: new Date().getFullYear(),
      transactionId: "",
    },
  });

  useEffect(() => {
    const formattedData = new Date().toISOString().split("T")[0];
    setValue("payDate", formattedData);
  }, []);

  const semester = watch("semester");
  const subjectName = watch("subjectName");
  const modeOfPayment = watch("modeOfPayment");

  const getSupplyCount = async (
    student: string,
    semester: string,
    subject: string
  ) => {
    const response = await studentCount({
      semester,
      student,
      subject,
    });
    if (response.error) {
      toast.error("Error in fetching supply");
    }
    if (response && response.data && response?.data) {
      console.log("Response", response.data.data);
      setValue("supplyNo", response.data.data + 1);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSubjectName(subjectName);
    }, 1000);

    return () => {
      clearTimeout(timer); // Corrected cleanup function
    };
  }, [subjectName]);

  useEffect(() => {
    if (student && semester && debouncedSubjectName)
      getSupplyCount(student?._id, semester, debouncedSubjectName);
  }, [semester, student, debouncedSubjectName]);

  const onFeesSubmit = async (data: InferType<typeof supplyFeesSchema>) => {
    if (!student) return;
    const response = await createStudentSupply({
      paidAmount: data.paidAmount,
      modeOfPayment: data.modeOfPayment,
      payDate: data.payDate,
      remark: data?.remark ? data.remark : undefined,
      semester: data.semester,
      student: student._id,
      subject: data.subjectName.replace(/\s+/g, "_").toUpperCase(),
      supplyNumber: data.supplyNo,
      transactionId: data.transactionId,
    });

    if (response?.data?.success) {
      toast.success("Student Fees submitted successfully");
      feeReset();
      searchReset();
      redirect("/fees/supplementaryTransactions");
    }
    if (response.error) {
      toast.success("Error is submitting fees");
    }
  };

  const onSearchSubmit = async (
    data: InferType<typeof studentFeesSearchSchema>
  ) => {
    const response = await searchStudent(data.registerationNumber);
    if (response.error) {
      toast.error("Something went wrong");
      return;
    }
    if (!response.data?.data) {
      toast.error("No Student Found");
      return;
    }
    if (response.data?.success && response.data.data) {
      toast.success("Student found!");
      setStudent(response.data.data);

      const semesterOptions = response.data.data.course.semesters?.map(
        (semester) => ({
          label: semester.semesterNumber,
          value: semester._id,
        })
      );
      setSemesters(semesterOptions);
      setValue("name", response.data.data.name);
      setValue("fatherName", response.data.data.fatherName);
      setValue("course", response.data.data.course.name);
      setValue("session", response.data.data.session);
    }
  };

  return (
    <section className="py-5 px-2 max-w-7xl w-full mx-auto">
      <h1 className="font-bold text-xl">Supply Fee</h1>

      <div className="border border-gray-300 bg-white p-4">
        <form
          onSubmit={handleSearchSubmit(onSearchSubmit)}
          className="flex flex-col space-y-4"
        >
          <div className="mb-4">
            <h2 className="font-bold text-base">SEARCH</h2>
            <div className="rounded-md p-1 flex items-center gap-2 ">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Registration Number"
                  register={searchRegister("registerationNumber")}
                  error={!!searchErrors.registerationNumber}
                  message={searchErrors.registerationNumber?.message}
                />
              </div>
              <div>
                <div className="space-x-2 w-full flex">
                  <Button
                    title="Search"
                    loadingTitle="searching..."
                    type="submit"
                    className="w-fit !mt-0"
                  />

                  <Button
                    title="Cancel"
                    onClick={() => {
                      searchReset();
                      feeReset();
                    }}
                    type="button"
                    className="w-fit !mt-0"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
        {isStudentFetching ? (
          <LoadingPage />
        ) : (
          <form
            onSubmit={handleSubmit(onFeesSubmit)}
            className="flex flex-col space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  type="text"
                  label="Student Name"
                  register={register("name")}
                  disabled
                  placeholder="Auto Filled through Registration Form"
                  error={!!errors.name}
                  message={errors.name?.message}
                />
              </div>
              <div>
                <Input
                  type="text"
                  label="Father Name"
                  register={register("fatherName")}
                  disabled
                  placeholder="Auto Filled through Registration Form"
                  error={!!errors.fatherName}
                  message={errors.fatherName?.message}
                />
              </div>
              <div>
                <Input
                  type="text"
                  label="Course"
                  register={register("course")}
                  disabled
                  placeholder="Auto Filled through Registration Form"
                  error={!!errors.course}
                  message={errors.course?.message}
                />
              </div>
              <div>
                <Input
                  type="number"
                  label="Enrollment Year"
                  register={register("session")}
                  disabled
                  placeholder="Auto Filled through Registration Form"
                  error={!!errors.session}
                  message={errors.session?.message}
                />
              </div>
              <div>
                <FormControl variant="standard" fullWidth>
                  <InputLabel id="semester" className="text-[12px]">
                    Semester/Year
                  </InputLabel>
                  <Select
                    value={semester}
                    labelId="semester"
                    disabled={!student}
                    {...register("semester")}
                  >
                    {semesters?.map((sem) => (
                      <MenuItem key={sem.value} value={sem.value}>
                        {sem.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.semester && (
                    <small className="text-red-500">
                      {errors.semester.message}
                    </small>
                  )}
                </FormControl>
              </div>

              <div>
                <Input
                  type="text"
                  label="Subject"
                  register={register("subjectName")}
                  placeholder="Subject Code"
                  error={!!errors.subjectName}
                  message={errors.subjectName?.message}
                />
              </div>
              <div>
                <Input
                  type="number"
                  label="Supply Number"
                  disabled
                  register={register("supplyNo")}
                  placeholder="Supply Number"
                  error={!!errors.supplyNo}
                  message={errors.supplyNo?.message}
                />
              </div>
              <div>
                <Input
                  type="number"
                  label="Pay Amount"
                  register={register("paidAmount")}
                  disabled={!student}
                  allowNumbers
                  placeholder="Pay fees"
                  error={!!errors.paidAmount}
                  message={errors.paidAmount?.message}
                />
              </div>

              <div>
                <FormControl variant="standard" fullWidth>
                  <InputLabel id="semester" className="text-[12px]">
                    Mode of Payment
                  </InputLabel>
                  <Select
                    value={modeOfPayment}
                    labelId="modeOfPayment"
                    disabled={!student}
                    {...register("modeOfPayment")}
                  >
                    {Object.values(PaymentMode).map((mode) => (
                      <MenuItem key={mode} value={mode}>
                        {MODE[mode]}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.modeOfPayment && (
                    <small className="text-red-500">
                      {errors.modeOfPayment.message}
                    </small>
                  )}
                </FormControl>
              </div>

              <div>
                <DatePicker
                  label="Payment Date"
                  register={register("payDate")}
                  error={!!errors?.payDate}
                  message={errors.payDate?.message}
                />
              </div>

              {modeOfPayment === PaymentMode.ONLINE_TRANSFER && (
                <div>
                  <Input
                    type="text"
                    label="Transaction ID"
                    disabled={!student}
                    register={register("transactionId")}
                    placeholder="Transaction ID"
                    error={!!errors.transactionId}
                    message={errors.transactionId?.message}
                  />
                </div>
              )}
              {modeOfPayment === PaymentMode.CHEQUE && (
                <div>
                  <Input
                    type="text"
                    label="Cheque no."
                    disabled={!student}
                    register={register("transactionId")}
                    placeholder="Cheque No."
                    error={!!errors.transactionId}
                    message={errors.transactionId?.message}
                  />
                </div>
              )}
              <div>
                <Input
                  type="text"
                  subLabel="optional"
                  label="Remark"
                  register={register("remark")}
                  placeholder="Enter fees type"
                  error={!!errors.remark}
                  message={errors.remark?.message}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              <Button
                title="Submit"
                loadingTitle="Submitting..."
                type="submit"
                className="!w-fit"
                isLoading={isFetchingLatestFee || isCreatingFee}
                isDisable={!student || !semester}
              />
              <Button
                title="Cancel"
                type="button"
                className="!w-fit bg-[#cccccc]"
                onClick={() => feeReset()}
              />
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

export default Page;
