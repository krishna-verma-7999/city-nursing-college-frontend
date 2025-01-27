"use client";
import Card from "@/components/shared/card";
import PieChartComponent from "@/components/shared/pie-chart";
import { useDashboardQuery } from "@/store/api";
import { Dashboard } from "@/types";
import { GraduationCap, IndianRupee } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const [dashboardData, setDashboardData] = useState<Dashboard | null>(null);
  const { data } = useDashboardQuery();
  useEffect(() => {
    if (data?.data) setDashboardData(data.data);
  }, [data]);
  return (
    <div className="p-5 max-w-5xl mx-auto">
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
          title="Monthly Fees Collection"
          gradient
          count={dashboardData?.currentMonthFees || 0}
          icon={IndianRupee}
        />
        <Card
          title="Balance Fees Amount"
          gradient
          icon={IndianRupee}
          count={dashboardData?.currentMonthBalanceFees || 0}
        />
      </div>
      {/* <div>
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
