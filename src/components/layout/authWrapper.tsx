"use client";
import StoreProvider from "@/store/redux";
import React from "react";

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  return <StoreProvider>{children}</StoreProvider>;
};

export default AuthWrapper;
