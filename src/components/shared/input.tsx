import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { FieldValues, UseFormRegister } from "react-hook-form";

type Props = {
  placeholder: string;
  register: ReturnType<UseFormRegister<FieldValues>>;
  error: boolean;
  message: string | undefined;
  disabled?: boolean;
  allowNumbers?: boolean;
  aadharValidation?: boolean;
  phoneNumberValidation?: boolean;
  type?: "text" | "number" | "password";
  label?: string;
  subLabel?: string;
  min?: number;
  max?: number;
  className?: string;
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
  phoneNumberValidation = false,
  aadharValidation = false,
  min = 0,
  className = "",
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const allowNumbersOnly = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.currentTarget;

    if (allowNumbers) target.value = target.value.replace(/[^0-9]/g, "");

    if (phoneNumberValidation && target.value.length > 10) {
      target.value = target.value.slice(0, 10);
    }

    if (aadharValidation && target.value.length > 12) {
      target.value = target.value.slice(0, 12);
    }
  };

  const inputStyles =
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary focus:outline-none dark:text-white dark:focus:outline-none";

  return (
    <div className="relative">
      {label && (
        <label className="text-[10px] text-gray-500 font-medium">
          {label} {subLabel && `(${subLabel})`}
        </label>
      )}
      <input
        type={type === "password" ? (showPassword ? "text" : type) : type}
        autoComplete="off"
        placeholder={placeholder}
        className={`${inputStyles} ${label && "mt-1 shadow-none placeholder:text-[10px]"} ${className}`}
        {...register}
        disabled={disabled}
        onInput={allowNumbersOnly}
        min={min}
      />
      {error && <small className="text-red-500">{message}</small>}
      {type === "password" && (
        <span
          className="absolute top-1 right-2 cursor-pointer"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? (
            <Eye className="h-7 w-7 stroke-gray-700 text-gray-700" />
          ) : (
            <EyeOff className="h-7 w-7 stroke-gray-700 text-gray-700" />
          )}
        </span>
      )}
    </div>
  );
};

export default Input;
