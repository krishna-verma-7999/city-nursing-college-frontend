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

  // Custom label renderer to prevent default lines
  const renderCustomLabel = ({
    x,
    y,
    name,
    percent,
  }: {
    x: number;
    y: number;
    name: string;
    percent: number;
  }) => (
    <text
      x={x}
      y={y}
      fill="#000"
      textAnchor="middle"
      dominantBaseline="central"
      style={{ fontSize: 12, fontWeight: "bold" }}
    >
      {name} ({(percent * 100).toFixed(1)}%)
    </text>
  );

  return (
    <div style={{ textAlign: "center" }}>
      <PieChart width={300} height={400}>
        <Pie
          data={data}
          dataKey="amount"
          nameKey="caste"
          outerRadius={120}
          fill="#8884d8"
          label={renderCustomLabel} // Use the custom label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip cursor={false} />
        <Legend />
      </PieChart>
    </div>
  );
};

export default PieChartComponent;
