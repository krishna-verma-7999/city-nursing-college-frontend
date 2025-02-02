"use client";
import Card from "@/components/shared/card";
// import StudentCountChart from "@/components/shared/StudentCountChart";
// import PieChartComponent from "@/components/shared/pie-chart";
import { useDashboardQuery } from "@/store/api";
import { Dashboard } from "@/types";
import { formatCurrency } from "@/utils";
import { GraduationCap, IndianRupee, User } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const [dashboardData, setDashboardData] = useState<Dashboard | null>(null);
  // const [graphData, setGraphData] = useState<GraphData | null>(null);
  const { data } = useDashboardQuery();
  // const { data: chartData } = useDashboardGraphQuery();

  // useEffect(() => {
  //   if (chartData && chartData.data) setGraphData(chartData?.data.data);
  // }, [chartData]);

  useEffect(() => {
    if (data?.data) setDashboardData(data.data);
  }, [data]);
  return (
    <div className="p-5 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card
          title="Total courses"
          count={dashboardData?.coursesCount || 0}
          icon={GraduationCap}
        />
        <Card
          title="Total registered students"
          count={dashboardData?.studentsCount || 0}
        />
        <Card
          title="General students"
          count={dashboardData?.categoryWiseStudentsCount.general || 0}
          icon={User}
        />
        <Card
          title="SC/BC students"
          count={dashboardData?.categoryWiseStudentsCount.sc || 0}
          icon={User}
          gradient
        />
        <Card
          title="Monthly Fees Collection"
          gradient
          count={formatCurrency(
            dashboardData?.currentMonthFees
              ? dashboardData?.currentMonthFees
              : 0
          )}
          icon={IndianRupee}
        />
        <Card
          title="Balance Fees Amount"
          gradient
          icon={IndianRupee}
          count={formatCurrency(
            dashboardData?.currentMonthBalanceFees
              ? dashboardData?.currentMonthBalanceFees
              : 0
          )}
        />
      </div>
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-10 justify-between ">
        {graphData && <StudentCountChart data={graphData} />}
        <PieChartComponent
          data={[
            {
              amount: dashboardData?.categoryWiseStudentsCount?.general || 0,
              caste: "General",
            },
            {
              amount: dashboardData?.categoryWiseStudentsCount?.sc || 0,
              caste: "SC",
            },
          ]}
        />
      </div> */}
    </div>
  );
}
