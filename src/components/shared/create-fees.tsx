"use client";
import Button from "@/components/shared/button";
import { FormControl, Select, MenuItem, InputLabel } from "@mui/material";
import { feeSchema } from "@/schema";
import { extractValidationMessage, formatCurrency } from "@/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { InferType } from "yup";
import { X } from "lucide-react";
import {
  Caste,
  useCreateFeesMutation,
  useEditFeesMutation,
  useGetCoursesQuery,
  useLazyGetFeesByIdQuery,
} from "@/store/api";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { Semester } from "@/types";

type SemesterType = {
  value: string;
  label: string;
  disabled: boolean;
}[];

const CreateFees = () => {
  const [readOnly, setReadOnly] = useState(false);
  const params = useParams();
  const router = useRouter();
  const [status, setStatus] = useState<"PENDING" | "COMPLETED" | "">("PENDING");
  const { id } = params;
  const [editFees, { isLoading: isFeesEditing }] = useEditFeesMutation();
  const [getFees, { data }] = useLazyGetFeesByIdQuery();
  const [createFees, { isLoading: isFeesCreating }] = useCreateFeesMutation();
  const { data: courses } = useGetCoursesQuery({ status });
  const [semesters, setSemesters] = useState<SemesterType>([]);

  const [formattedTotal, setFormattedTotal] = useState({
    generalFees: "0",
    scFees: "0",
  });
  const [type, setType] = useState("");
  const [generalAmount, setGeneralAmount] = useState("");
  const [scAmount, setScAmount] = useState("");
  const [error, setError] = useState({
    typeErrorMessage: "",
    generalAmountErrorMessage: "",
    scAmountErrorMessage: "",
  });
  const {
    watch,
    control,
    setValue,
    reset,
    register,
    handleSubmit,
    formState: { errors, isLoading },
  } = useForm<InferType<typeof feeSchema>>({
    resolver: yupResolver(feeSchema),
    defaultValues: {
      courseId: "",
      semester: "",
      feesType: [],
    },
  });

  const courseId = watch("courseId");
  const semester = watch("semester");

  useEffect(() => {
    if (courses && courses?.data.length > 0) {
      const course = courses.data.find((course) => course._id === courseId);
      if (course && course.duration) {
        const existingSemesters = course.semesters || [];

        // Generate semesters array
        const semestersArray = Array.from(
          { length: +course.duration },
          (_, index) => {
            const semesterValue = index + 1;
            return {
              value: String(semesterValue),
              label: `${semesterValue}`,
              disabled: existingSemesters.some(
                (semester: { semesterNumber: number }) =>
                  semester.semesterNumber === +semesterValue
              ),
            };
          }
        );
        setSemesters(semestersArray);
      } else {
        setSemesters([]);
      }
    }
  }, [courseId, courses]);

  useEffect(() => {
    if (id) {
      setStatus("");
      getFees(String(id));
      if (data) {
        const semesterFees = data.data as Semester;
        console.log("Semesters", semesterFees);
        const feesType = semesterFees.fees.map((fee) => ({
          type: fee.type, // Fee type (e.g., "Registration Fees")
          generalFees:
            fee.details.find((detail) => detail.caste === "general")?.amount ||
            0, // General Fees
          scFees:
            fee.details.find((detail) => detail.caste === "sc")?.amount || 0,
        }));
        console.log("Semestter", semesterFees);
        setValue("courseId", semesterFees.course);
        setValue("semester", String(semesterFees.semesterNumber));
        setSemesters([
          {
            value: String(semesterFees.semesterNumber),
            label: `${semesterFees.semesterNumber} Semester${semesterFees.semesterNumber > 1 ? "s" : ""}`,
            disabled: true,
          },
        ]);
        setValue("feesType", feesType);
        setReadOnly(true);
      }
    }
  }, [id, data, getFees, setValue]);

  const { fields, append, remove } = useFieldArray({
    name: "feesType",
    control,
  });

  const feesType = watch("feesType");
  const totalGeneralFees = feesType?.reduce(
    (sum, field) => sum + Number(field.generalFees || 0),
    0
  );
  const totalSCFees = feesType?.reduce(
    (sum, field) => sum + Number(field.scFees || 0),
    0
  );

  useEffect(() => {
    if (totalGeneralFees) {
      const formattedTotal = formatCurrency(totalGeneralFees);
      setFormattedTotal((prev) => ({ ...prev, generalFees: formattedTotal }));
    }
    if (totalSCFees) {
      const formattedTotal = formatCurrency(totalSCFees);
      setFormattedTotal((prev) => ({ ...prev, scFees: formattedTotal }));
    }
  }, [totalGeneralFees, totalSCFees]);

  const addToListHandler = () => {
    if (type === "") {
      setError({
        typeErrorMessage: "Fee Type is required",
        generalAmountErrorMessage: "",
        scAmountErrorMessage: "",
      });
    }

    if (generalAmount === "") {
      setError((prev) => ({
        ...prev,
        generalAmountErrorMessage: "Amount is required",
      }));
    }

    if (scAmount === "") {
      setError((prev) => ({
        ...prev,
        scAmountErrorMessage: "Amount is required",
      }));
    }

    if (scAmount === "" || generalAmount === "" || type === "") {
      return;
    }

    append({ type: type, generalFees: +generalAmount, scFees: +scAmount });
    setType("");
    setGeneralAmount("");
    setScAmount("");
    setError({
      typeErrorMessage: "",
      scAmountErrorMessage: "",
      generalAmountErrorMessage: "",
    });
  };

  const submitHandler = handleSubmit(
    async (values: InferType<typeof feeSchema>) => {
      const transformedFees =
        values?.feesType?.map((fee) => ({
          type: fee.type,
          details: [
            { caste: Caste.General, amount: fee.generalFees },
            { caste: Caste.SC, amount: fee.scFees },
          ],
        })) || [];
      if (id) {
        const res = await editFees({
          _id: String(id),
          course: values.courseId,
          semesterNumber: +values.semester,
          fees: transformedFees,
        });
        if (res.data?.success) {
          toast.success("Fees Structure updated successfully");
          reset({ feesType: [], courseId: "", semester: "" });
          setFormattedTotal({ scFees: "", generalFees: "" });
          router.push("/reports/coursewise");
        }
        if (res.error) {
          const message = extractValidationMessage(res.error);
          toast.error(message);
        }
      } else {
        const res = await createFees({
          course: values.courseId,
          semesterNumber: +values.semester,
          fees: transformedFees,
        });

        if (res.data?.success) {
          toast.success("Fees Structure created successfully");
          reset({ feesType: [], courseId: "", semester: "" });
          setFormattedTotal({ scFees: "", generalFees: "" });
        }
        if (res.error) {
          const message = extractValidationMessage(res.error);
          toast.error(message);
        }
      }
    }
  );

  return (
    <section className="py-5 px-2 max-w-7xl w-full mx-auto">
      <h1 className="font-bold text-xl">
        {id ? "Edit" : "Add"} Fees Structure
      </h1>
      <form onSubmit={submitHandler} className="flex flex-col">
        <div className="border border-gray-200 bg-white p-4">
          <h2 className="font-bold text-base">Fees Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2">
            <div className="space-y-2 p-2">
              <FormControl
                variant="standard"
                fullWidth
                className="border-b-white"
              >
                <InputLabel id="course" className="text-[12px]">
                  Course
                </InputLabel>
                <Select
                  readOnly={readOnly}
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
              <FormControl
                variant="standard"
                fullWidth
                disabled={semesters.length === 0}
              >
                <InputLabel id="semester" className="text-[12px]">
                  Semester / Years
                </InputLabel>
                <Select
                  readOnly={readOnly}
                  value={semester}
                  labelId="semester"
                  label="Semester"
                  {...register("semester")}
                >
                  {semesters.map((sem, index) => (
                    <MenuItem
                      key={index}
                      disabled={sem.disabled}
                      value={sem.value}
                    >
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
            <div className="space-y-2 p-2">
              <div className="flex gap-3 border-b pb-2">
                <span className="flex-1 font-bold">Type</span>
                <span className="flex-1 font-bold">General Fees</span>
                <span className="flex-1 font-bold">SC Fees</span>
              </div>
              <div className="flex gap-3 pt-2">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full rounded border border-gray-300 p-2  dark:border-dark-tertiary dark:bg-dark-tertiary focus:outline-none dark:text-white dark:focus:outline-none"
                  />
                  {error.typeErrorMessage ? (
                    <small className="text-red-500">
                      {error.typeErrorMessage}
                    </small>
                  ) : (
                    errors.feesType && (
                      <small className="text-red-500">
                        {errors.feesType.message}
                      </small>
                    )
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="number"
                    placeholder="General Amount"
                    min={0}
                    value={generalAmount}
                    onChange={(e) => setGeneralAmount(e.target.value)}
                    className="w-full rounded border border-gray-300 p-2  dark:border-dark-tertiary dark:bg-dark-tertiary focus:outline-none dark:text-white dark:focus:outline-none"
                  />
                  {error.generalAmountErrorMessage && (
                    <small className="text-red-500">
                      {error.generalAmountErrorMessage}
                    </small>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="number"
                    placeholder="SC Amount"
                    min={0}
                    value={scAmount}
                    onChange={(e) => setScAmount(e.target.value)}
                    className="w-full rounded border border-gray-300 p-2  dark:border-dark-tertiary dark:bg-dark-tertiary focus:outline-none dark:text-white dark:focus:outline-none"
                  />
                  {error.scAmountErrorMessage && (
                    <small className="text-red-500">
                      {error.scAmountErrorMessage}
                    </small>
                  )}
                </div>
              </div>
              <Button
                title="Add To List"
                type="button"
                onClick={addToListHandler}
              />
              <hr />
              <div className="flex flex-col">
                <div className="flex items-center justify-around border-b  pb-2">
                  <span className="font-bold">Type</span>
                  <span className="font-bold">General Amount</span>
                  <span className="font-bold">SC Amount</span>
                </div>
                <div>
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex items-center justify-around py-3 relative"
                    >
                      <span
                        className="absolute left-0 bg-red-100 border-2 border-red-700 h-5 w-5 flex justify-center items-center cursor-pointer"
                        onClick={() => remove(index)}
                      >
                        <X className="stroke-red-700" />
                      </span>
                      <span>{field.type}</span>
                      <span>{formatCurrency(field.generalFees)}</span>
                      <span>{formatCurrency(field.scFees)}</span>
                    </div>
                  ))}
                </div>
                <hr />
                <div className="flex items-center justify-around py-2">
                  <span className="font-bold">Total: </span>
                  <span className="font-bold">
                    {formattedTotal.generalFees}
                  </span>
                  <span className="font-bold">{formattedTotal.scFees}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Button
          type="submit"
          title={`${id ? "Edit" : "Create"} Structure`}
          loadingTitle={`Structure ${id ? "Editing" : "Creating"}...`}
          className="self-end !w-fit"
          isDisable={isFeesCreating}
          isLoading={isLoading || isFeesCreating || isFeesEditing}
        />
      </form>
    </section>
  );
};

export default CreateFees;
