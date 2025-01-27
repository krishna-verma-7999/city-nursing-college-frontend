"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import LoadingPage from "../shared/loadingPage";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const token = window.localStorage.getItem("authToken");

  useEffect(() => {
    if (!token) router.push("/login");
  }, [token, router]);

  if (!token) return <LoadingPage />;

  return <>{children}</>;
};

export default ProtectedRoute;
