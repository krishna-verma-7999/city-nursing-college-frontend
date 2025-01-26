import React from "react";
import clsx from "clsx";

type Props = {
  title: string;
  loadingTitle?: string;
  isLoading?: boolean;
  isDisable?: boolean;
  type?: "submit" | "button";
  className?: string;
  onClick?: () => void;
};

const Button = ({
  title,
  loadingTitle,
  isLoading = false,
  isDisable = false,
  type = "submit",
  className = "",
  onClick,
}: Props) => {
  return (
    <button
    onClick={onClick}
    type={type}
    className={clsx(
      "mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none",
      {
        "cursor-not-allowed opacity-50": isDisable || isLoading,
      },
      className // User-provided className
    )}
    disabled={isDisable || isLoading}
  >
      {isLoading ? loadingTitle : title}
    </button>
  );
};

export default Button;
