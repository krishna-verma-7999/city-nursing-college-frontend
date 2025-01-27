"use client";

import React from "react";
import { InferType } from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "@/schema";
import Button from "@/components/shared/button";
import { redirect } from "next/navigation";
import { useLoginMutation } from "@/store/api";
import { toast } from "sonner";
import { useAppDispatch } from "@/store/redux";
import { loginSuccess } from "@/store/state/auth";
import Input from "@/components/shared/input";

const Page = () => {
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<InferType<typeof loginSchema>>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      password: "",
      userName: "",
    },
  });

  const loginHandler = handleSubmit(
    async (values: InferType<typeof loginSchema>) => {
      const res = await login(values);

      if (res.error) {
        toast.error("Invalid username or password");
        return;
      }

      dispatch(
        loginSuccess({
          token: res.data.data.accessToken,
          isAuthenticated: true,
        })
      );
      redirect("/");
    }
  );

  return (
    <div className="shadow-lg px-10 py-24 w-full max-w-screen-sm">
      <div>
        <h1 className="text-xl font-bold font-sans">
          Welcome To City Nursing College
        </h1>
        <h2 className="text-gray-400">Sign in to continue.</h2>
      </div>
      <form onSubmit={loginHandler} className="mt-4 flex flex-col space-y-6">
        <div>
          <Input
            type="text"
            placeholder="Username"
            register={register("userName")}
            error={!!errors.userName}
            message={errors.userName?.message}
          />
        </div>

        <div>
          <Input
            type="password"
            placeholder="Password"
            register={register("password")}
            error={!!errors.password}
            message={errors.password?.message}
          />
        </div>

        <Button
          title="login"
          loadingTitle="login..."
          isLoading={isLoading}
          isDisable={Object.values(errors).length > 0}
        />
      </form>
    </div>
  );
};

export default Page;
