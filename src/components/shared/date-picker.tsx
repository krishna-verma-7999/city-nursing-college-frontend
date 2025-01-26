import React from "react";
import { FieldValues, UseFormRegister } from "react-hook-form";

type Props = {
  register: ReturnType<UseFormRegister<FieldValues>>;
  error: boolean;
  message: string | undefined;
  label?: string;
  subLabel?: string;
};

const DatePicker = ({ label, subLabel, register, error, message }: Props) => {
  const inputStyles =
    "w-full rounded border border-gray-300 text-gray-500 p-[6px] shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary focus:outline-none dark:text-white dark:focus:outline-none";

  return (
    <>
      {label && (
        <label className="text-[10px] text-gray-500 font-medium">
          {label} {subLabel && `(${subLabel})`}
        </label>
      )}
      <input
        type={"date"}
        className={`${inputStyles} ${label && "mt-1 shadow-none placeholder:text-[10px]"}`}
        {...register}
      />
      {error && <small className="text-red-500">{message}</small>}
    </>
  );
};

export default DatePicker;
