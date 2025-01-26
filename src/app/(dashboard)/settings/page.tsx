"use client";

import React from "react";
import { InferType } from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { resetPasswordSchema } from "@/schema";
import Button from "@/components/shared/button";
import { useResetPasswordMutation } from "@/store/api";
import { toast } from "sonner";
import Input from "@/components/shared/input";

const Page = () => {
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const {
    reset,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<InferType<typeof resetPasswordSchema>>({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const resetPasswordHandler = handleSubmit(
    async (values: InferType<typeof resetPasswordSchema>) => {
      const res = await resetPassword({
        password: values.newPassword,
        confirmPassword: values.confirmPassword,
      });
      if (res.data?.success) {
        toast.success("Password reset successfully");
        reset();
      }
      if (res.error) {
        toast.error("Something went wrong");
        return;
      }
    }
  );

  return (
    <div className="shadow-lg px-10 py-24 w-full max-w-screen-sm mx-auto mt-4">
      <div>
        <h1 className="text-xl font-bold font-sans">Reset Password</h1>
      </div>
      <form
        onSubmit={resetPasswordHandler}
        className="mt-4 flex flex-col space-y-6"
      >
        <div>
          <Input
            type="password"
            placeholder="New Password"
            register={register("newPassword")}
            error={!!errors.newPassword}
            message={errors.newPassword?.message}
          />
        </div>
        <div>
          <Input
            type="password"
            placeholder="Confirm Password"
            register={register("confirmPassword")}
            error={!!errors.confirmPassword}
            message={errors.confirmPassword?.message}
          />
        </div>

        <Button
          title="Reset Password"
          loadingTitle="Resetting..."
          isLoading={isLoading}
          isDisable={Object.values(errors).length > 0}
        />
      </form>
    </div>
  );
};

export default Page;
