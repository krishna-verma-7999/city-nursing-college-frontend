"use client";

import React, { useEffect } from "react";
import Sidebar from "../shared/sidebar";
import { useAppSelector } from "@/store/redux";
import Navbar from "../shared/navbar";
import ProtectedRoute from "./protectedRoute";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <ProtectedRoute>
      <div className="custom-scrollbar flex min-h-screen w-full bg-gray-50 text-gray-900">
        <Sidebar />
        <main
          className={`flex w-full flex-col bg-gray-50  ${isSidebarCollapsed ? "" : "md:pl-64"}`}
        >
          <Navbar />
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
};

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  return <DashboardLayout>{children}</DashboardLayout>;
};

export default DashboardWrapper;
