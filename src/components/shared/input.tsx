import React from "react";
import { FieldValues, UseFormRegister } from "react-hook-form";

type Props = {
  placeholder: string;
  register: ReturnType<UseFormRegister<FieldValues>>;
  error: boolean;
  message: string | undefined;
  disabled?: boolean;
  allowNumbers?: boolean;
  type?: "text" | "number" | "password";
  label?: string;
  subLabel?: string;
  min?: number;
  max?: number;

};

const Input = ({
  type = "text",
  placeholder,
  register,
  error,
  message,
  label,
  subLabel,
  disabled = false,
  allowNumbers = false,
  min = 0,
  
}: Props) => {

  const allowNumbersOnly = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.currentTarget;

    if (allowNumbers) target.value = target.value.replace(/[^0-9]/g, "");
  };

  const inputStyles =
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary focus:outline-none dark:text-white dark:focus:outline-none";

  return (
    <>
      {label && (
        <label className="text-[10px] text-gray-500 font-medium">
          {label} {subLabel && `(${subLabel})`}
        </label>
      )}
      <input
        type={type}
        autoComplete="off"
        placeholder={placeholder}
        className={`${inputStyles} ${label && "mt-1 shadow-none placeholder:text-[10px]"}`}
        {...register}
        disabled={disabled}
        onInput={allowNumbersOnly}
        min={min}
      />
      {error && <small className="text-red-500">{message}</small>}
    </>
  );
};

export default Input;
