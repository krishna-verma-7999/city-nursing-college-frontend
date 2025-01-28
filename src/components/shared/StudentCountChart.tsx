import { GraphData } from "@/types";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const StudentCountChart = ({ data }: { data: GraphData }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 15 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          label={{ value: "Days", position: "insideBottom", offset: -5 }}
        />
        <YAxis
          label={{ value: "Student Count", angle: -90, position: "insideLeft" }}
          allowDecimals={false}
        />
        <Tooltip />
        <Bar dataKey="studentCount" fill="#8884d8" barSize={50} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default StudentCountChart;
