import type { Metadata } from "next";
import "../globals.css";
import DashboardWrapper from "@/components/layout/dashboardWrapper";

export const metadata: Metadata = {
  title: "City Nursing College",
  description: "ERP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <DashboardWrapper>{children}</DashboardWrapper>;
}
