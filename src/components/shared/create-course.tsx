"use client";
import Button from "@/components/shared/button";
import Input from "@/components/shared/input";
import { courseSchema } from "@/schema";
import {
  useCreateCourseMutation,
  useEditCourseMutation,
  useLazyGetCourseByIdQuery,
} from "@/store/api";
import { ErrorMessage } from "@/types";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { InferType } from "yup";

const CreateCourse = () => {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [trigger, { data }] = useLazyGetCourseByIdQuery();

  const {
    reset,
    register,
    setValue,
    handleSubmit,
    formState: { errors, isLoading },
  } = useForm<InferType<typeof courseSchema>>({
    resolver: yupResolver(courseSchema),
    defaultValues: {
      course: data?.data?.name || "",
      description: data?.data?.description || "",
      duration: String(data?.data?.duration) || "",
    },
  });

  const [createCourse, { isLoading: isCourseCreating }] =
    useCreateCourseMutation();

  const [editCourse, { isLoading: isCourseEditing }] = useEditCourseMutation();

  useEffect(() => {
    if (id) {
      trigger(id as string);
      if (data?.data) {
        setValue("course", data.data.name);
        setValue("description", data.data.description);
        setValue("duration", String(data.data.duration));
      }
    }
  }, [id, trigger, data, setValue]);

  const submitHandler = handleSubmit(
    async (values: InferType<typeof courseSchema>) => {
      if (id) {
        const course = await editCourse({
          _id: id as string,
          name: values.course,
          duration: values.duration,
          description: values.description,
        });
        if (course?.data?.success) {
          toast.success("Course is edited successfully");
          router.push("/reports/coursewise");
        } else if (course.error) {
          toast.error("Course with this name already exists");
        }
        if (course.error) {
          const error = course.error as ErrorMessage;
          toast.error(error.data.message);
        }
      } else {
        const course = await createCourse({
          name: values.course,
          duration: values.duration,
          description: values.description,
        });
        if (course?.data?.success) {
          toast.success("Course is created successfully");
          reset();
        } else if (course.error) {
          toast.error("Course with this name already exists");
        }
        if (course.error) {
          const error = course.error as ErrorMessage;
          toast.error(error.data.message);
        }
      }
    }
  );

  return (
    <section className="py-5 px-2 max-w-7xl w-full mx-auto">
      <h1 className="font-bold text-xl">{id ? "Edit" : "Add"} Courses</h1>
      <form onSubmit={submitHandler} className="flex flex-col">
        <div className="border border-gray-200 bg-white p-4">
          <div className="p-2 space-y-2">
            <h2 className="font-bold text-base">Course Details</h2>
            <div>
              <Input
                label="Course"
                type="text"
                placeholder="Course"
                register={register("course")}
                error={!!errors.course}
                message={errors.course?.message}
              />
            </div>
            <div>
              <Input
                label="Duration"
                subLabel="In Semesters"
                type="number"
                placeholder="8 semesters"
                register={register("duration")}
                error={!!errors.duration}
                message={errors.duration?.message}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] text-gray-500 font-medium">
                Description
              </label>
              <textarea
                rows={3}
                {...register("description")}
                className="w-full border border-gray-300 focus:outline-none p-3"
              ></textarea>
            </div>
          </div>
        </div>
        <Button
          type="submit"
          loadingTitle={`${id ? "Editing" : "Adding"} Course`}
          title={`${id ? "Edit" : "Add"} Course`}
          className="!self-end !w-fit"
          isLoading={isLoading || isCourseCreating || isCourseEditing}
        />
      </form>
    </section>
  );
};

export default CreateCourse;
