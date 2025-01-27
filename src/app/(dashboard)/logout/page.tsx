"use client";
import { useAppDispatch } from "@/store/redux";
import { setIsSidebarCollapsed } from "@/store/state";
import { logout } from "@/store/state/auth";
import { redirect } from "next/navigation";

const Logout = () => {
  const dispatch = useAppDispatch();
  dispatch(setIsSidebarCollapsed(true));
  dispatch(logout());
  redirect("/login");
  return null;
};

export default Logout;
