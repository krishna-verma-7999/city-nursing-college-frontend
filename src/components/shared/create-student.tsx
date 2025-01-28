"use client";
import Button from "@/components/shared/button";
import Input from "@/components/shared/input";
import { studentSchema } from "@/schema";
import {
  Caste,
  useCreateStudentMutation,
  useEditStudentMutation,
  useGetCoursesQuery,
  useLazyGetStudentByIdQuery,
} from "@/store/api";
import { yupResolver } from "@hookform/resolvers/yup";
import { redirect, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { InferType } from "yup";
import Datepicker from "./date-picker";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { CASTE } from "@/constants";
import { calculateTotalFees, formatCurrency } from "@/utils";
import { ErrorMessage } from "@/types";

const CreateStudent = () => {
  const router = useParams();
  const { id } = router;
  const [studentId, setStudentId] = useState("");
  const { data: courses } = useGetCoursesQuery({ status: "COMPLETED" });
  const [trigger, { data }] = useLazyGetStudentByIdQuery();

  const {
    reset,
    watch,
    register,
    setValue,
    handleSubmit,
    formState: { errors, isLoading },
  } = useForm<InferType<typeof studentSchema>>({
    resolver: yupResolver(studentSchema),
    defaultValues: {
      aadharNumber: "",
      address: "",
      courseId: "",
      contact: "",
      studentName: "",
      discount: "",
      fees: "₹0",
      category: Caste.General,
    },
  });

  const courseId = watch("courseId");
  const category = watch("category");

  useEffect(() => {
    if (courseId && category) {
      if (courses && courses?.data.length > 0) {
        const course = courses.data.find((course) => course._id === courseId);
        if (course) {
          const totalFees = calculateTotalFees(course);
          setValue("fees", formatCurrency(totalFees[category]));
        }
      }
    }
  }, [courseId, category, courses, setValue]);

  const [createStudent, { isLoading: isStudentCreating }] =
    useCreateStudentMutation();

  const [editStudent, { isLoading: isStudentEditing }] =
    useEditStudentMutation();

  useEffect(() => {
    if (id) {
      trigger(id as string);
      const student = data && data?.data;
      if (student) {
        setStudentId(student._id);
        const fees: Record<string, number> = calculateTotalFees(student.course);
        const totalFees = formatCurrency(fees[student.category]);
        const formattedDobDate = new Date(student.dob)
          .toISOString()
          .split("T")[0];
        const formattedRegistrationDate = new Date(student.registrationDate)
          .toISOString()
          .split("T")[0];
        setValue("aadharNumber", student.aadharNo);
        setValue("address", student.address);
        setValue("category", student.category as Caste);
        setValue("contact", student.contactNo);
        setValue("courseId", student.course._id);
        setValue("discount", String(student.feesDiscount));
        setValue("dob", formattedDobDate);
        setValue("fatherName", student.fatherName);
        setValue("fees", totalFees);
        setValue("motherName", student.motherName);
        setValue("registrationDate", formattedRegistrationDate);
        setValue("registrationNumber", student.registrationNumber);
        setValue("session", String(student.session));
        setValue("studentName", student.name);
      }
    } else {
      setValue("category", Caste.General);
    }
  }, [id, trigger, data, setValue]);

  const submitHandler = handleSubmit(
    async (values: InferType<typeof studentSchema>) => {
      if (id) {
        const student = await editStudent({
          _id: studentId,
          name: values.studentName,
          aadharNo: values.aadharNumber,
          address: values.address,
          category: values.category,
          contactNo: values.contact,
          course: values.courseId,
          dob: new Date(values.dob),
          fatherName: values.fatherName,
          motherName: values.motherName,
          registrationNumber: values.registrationNumber,
          session: +values.session,
          registrationDate: new Date(values.registrationDate),
          feesDiscount: +values.discount,
        });
        if (student?.data?.success) {
          toast.success("Student is edited successfully");
        } else if (student.error) {
          const error = student.error as ErrorMessage;
          toast.error(error.data.message);
        }
      } else {
        const res = await createStudent({
          name: values.studentName,
          aadharNo: values.aadharNumber,
          address: values.address,
          category: values.category,
          contactNo: values.contact,
          course: values.courseId,
          dob: new Date(values.dob),
          fatherName: values.fatherName,
          motherName: values.motherName,
          registrationNumber: values.registrationNumber,
          session: +values.session,
          registrationDate: new Date(values.registrationDate),
          feesDiscount: +values.discount,
        });

        if (res?.data?.success) {
          toast.success("Student is created successfully");
          reset();
          redirect("/reports/student");
        } else if (res.error) {
          const error = res.error as ErrorMessage;
          toast.error(error.data.message);
        }
      }
    }
  );

  return (
    <section className="py-5 px-2 max-w-7xl w-full mx-auto">
      <h1 className="font-bold text-xl">{id ? "Edit" : "Add"} Student</h1>
      <form onSubmit={submitHandler} className="flex flex-col">
        <div className="border border-gray-200 bg-white p-4">
          <div className="p-2 space-y-2">
            <h2 className="font-bold text-base">Student Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <Input
                  label="Registration Number"
                  type="text"
                  allowNumbers
                  placeholder="Registration ID"
                  register={register("registrationNumber")}
                  error={!!errors.registrationNumber}
                  message={errors.registrationNumber?.message}
                />
              </div>
              <div>
                <Datepicker
                  label="Registration Date"
                  register={register("registrationDate")}
                  error={!!errors?.registrationDate}
                  message={errors.registrationDate?.message}
                />
              </div>
              <div>
                <Input
                  label="Student Name"
                  type="text"
                  placeholder="john"
                  register={register("studentName")}
                  error={!!errors.studentName}
                  message={errors.studentName?.message}
                />
              </div>
              <div>
                <Input
                  label="Father's Name"
                  type="text"
                  placeholder="Father's name"
                  register={register("fatherName")}
                  error={!!errors.fatherName}
                  message={errors.fatherName?.message}
                />
              </div>
              <div>
                <Input
                  label="Mother's Name"
                  type="text"
                  placeholder="Mother's name"
                  register={register("motherName")}
                  error={!!errors.motherName}
                  message={errors.motherName?.message}
                />
              </div>
              <div>
                <FormControl
                  variant="standard"
                  fullWidth
                  className="border-b-white !pt-3"
                >
                  <InputLabel id="course" className="text-[12px] pb-2">
                    Course
                  </InputLabel>
                  <Select
                    className="border-b-white"
                    labelId="course"
                    label="Course"
                    value={courseId}
                    {...register("courseId")}
                  >
                    {courses?.data.map((course) => (
                      <MenuItem key={course._id} value={course._id}>
                        {course.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.courseId && (
                    <small className="text-red-500">
                      {errors.courseId.message}
                    </small>
                  )}
                </FormControl>
              </div>
              <div>
                <FormControl
                  variant="standard"
                  fullWidth
                  className="border-b-white !pt-3"
                >
                  <InputLabel id="course" className="text-[12px] pb-2">
                    Category
                  </InputLabel>
                  <Select
                    className="border-b-white"
                    labelId="category"
                    label="category"
                    value={category}
                    {...register("category")}
                  >
                    {CASTE?.map((caste) => (
                      <MenuItem key={caste.value} value={caste.value}>
                        {caste.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.category && (
                    <small className="text-red-500">
                      {errors.category.message}
                    </small>
                  )}
                </FormControl>
              </div>
              <div>
                <Input
                  label="Discount In Fees"
                  placeholder="Discount"
                  subLabel="in rupees"
                  register={register("discount")}
                  allowNumbers
                  error={!!errors.discount}
                  message={errors.discount?.message}
                />
              </div>
              <div>
                <Input
                  label="Fees"
                  subLabel="in rupees"
                  type="text"
                  disabled
                  placeholder="fees"
                  register={register("fees")}
                  error={!!errors.fees}
                  message={errors.fees?.message}
                />
              </div>
              <div>
                <Datepicker
                  label="DOB"
                  register={register("dob")}
                  error={!!errors?.dob}
                  message={errors.dob?.message}
                />
              </div>
              <div>
                <Input
                  label="Aadhaar No."
                  type="text"
                  allowNumbers
                  placeholder="Aadhaar No."
                  register={register("aadharNumber")}
                  error={!!errors.aadharNumber}
                  message={errors.aadharNumber?.message}
                />
              </div>
              <div>
                <Input
                  label="Address"
                  placeholder="Address"
                  register={register("address")}
                  error={!!errors.address}
                  message={errors.address?.message}
                />
              </div>
              <div>
                <Input
                  label="Contact Number"
                  placeholder="Contact Number"
                  register={register("contact")}
                  allowNumbers
                  error={!!errors.contact}
                  message={errors.contact?.message}
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-500 font-medium">
                  Session
                </label>
                <input
                  className="w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary focus:outline-none dark:text-white dark:focus:outline-none"
                  type="number"
                  {...register("session")}
                  min="1900"
                  max="2100"
                  placeholder="YYYY"
                />
                {errors.session && (
                  <small className="text-red-500">
                    {errors.session.message}
                  </small>
                )}
              </div>
            </div>
          </div>
        </div>
        <Button
          type="submit"
          loadingTitle={`${id ? "Editing" : "Adding"} student`}
          title={`${id ? "Edit" : "Add"} student`}
          className="!self-end !w-fit"
          isLoading={isLoading || isStudentCreating || isStudentEditing}
        />
      </form>
    </section>
  );
};

export default CreateStudent;
