"use client";

import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

interface FeeData {
  caste: string;
  amount: number;
}

const PieChartComponent = ({ data }: { data: FeeData[] }) => {
  // Define colors for each caste
  const COLORS = ["#0088FE", "#00C49F"];

  return (
    <div style={{ textAlign: "center" }}>
      <PieChart width={400} height={400}>
        <Pie
          data={data}
          dataKey="amount"
          nameKey="caste"
          outerRadius={120}
          fill="#8884d8"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default PieChartComponent;
