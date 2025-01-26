import Card from "@/components/shared/card";
import { GraduationCap, IndianRupee } from "lucide-react";

export default function Home() {
  return (
    <div className="p-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card title="Total courses" count={5} icon={GraduationCap} />
        <Card title="Total registered students" count={10} />
        <Card title="Category based students" count={16} />
        <Card
          title="Monthly Fees Collection"
          gradient
          count={20}
          icon={IndianRupee}
        />
        <Card title="Balance Fees Amount" gradient count={24} />
      </div>
    </div>
  );
}
