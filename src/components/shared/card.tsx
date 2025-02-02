import { LucideIcon } from "lucide-react";
import React from "react";

type Props = {
  title: string;
  count: string | number;
  gradient?: boolean;
  icon?: LucideIcon;
};

const Card = ({ title, count, gradient = false, icon: Icon }: Props) => {
  return (
    <div
      className={`${gradient ? "bg-gradient-2" : "bg-gradient"} text-white p-5 relative h-[100px]`}
    >
      <h1 className="text-xl">{title}</h1>
      <p className="text-2xl font-bold">{count}</p>
      {Icon && (
        <Icon className="absolute top-12 right-3 h-14 w-14 opacity-40" />
      )}
    </div>
  );
};

export default Card;
