"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import LoadingPage from "../shared/loadingPage";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = window.localStorage.getItem("authToken");

    if (!token) {
      setIsAuthenticated(false);
      router.push("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router, window.localStorage.getItem("authToken")]);

  // Show loading state while determining authentication status
  if (isAuthenticated === null) return <LoadingPage />;

  // Redirect to login if not authenticated
  if (!isAuthenticated) return null;

  return <>{children}</>;
};

export default ProtectedRoute;
