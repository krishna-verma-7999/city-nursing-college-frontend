"use client";

import { feesLinks, reportsLinks, showMasterLinks } from "@/constants";
import { useAppDispatch, useAppSelector } from "@/store/redux";
import { setIsSidebarCollapsed } from "@/store/state";
import {
  ChevronDown,
  ChevronUp,
  ClipboardMinus,
  GraduationCapIcon,
  Home,
  Landmark,
  LogOut,
  LucideIcon,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

const Sidebar = () => {
  const [showMaster, setShowMaster] = useState(false);
  const [showFees, setShowFees] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );

  const pathname = usePathname();

  const sidebarClassNames = `fixed flex flex-col h-[100%] justify-between shadow-xl transition-all duration-300 h-full z-40 dark:bg-black overflow-y-auto overflow-x-hidden bg-white ${isSidebarCollapsed ? "w-0 hidden" : "w-64"}`;

  return (
    <div className={sidebarClassNames + " custom-scrollbar"}>
      <div className="custom-scrollbar flex h-[100%] w-full flex-col justify-start">
        {/* TOP LOGO */}
        <div className="z-50 flex min-h-[56px] w-64 items-center justify-between bg-white px-6 pt-3 dark:bg-black">
          {!isSidebarCollapsed && (
            <button
              className="py-3"
              onClick={() => dispatch(setIsSidebarCollapsed(true))}
            >
              <X className="h-6 w-6 text-gray-800 hover:text-gray-500 dark:text-white" />
            </button>
          )}
        </div>

        <SidebarLink
          key={"dashboard"}
          href={"/"}
          label={"Dashboard"}
          icon={Home}
        />

        {/* Master LINK */}
        <button
          key={"master"}
          onClick={() => setShowMaster((prev) => !prev)}
          className={`flex w-full items-center justify-between px-8 py-3 text-gray-800 dark:text-gray-200 ${pathname.startsWith("/master") && "bg-gray-100  dark:bg-gray-600"}`}
        >
          <span className="flex justify-center items-start gap-3">
            <GraduationCapIcon className="h-5 w-5 text-gray-800 dark:text-gray-100" />
            <span className="font-medium">Master</span>
          </span>
          {showMaster ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>
        {/* Master LIST */}
        {showMaster &&
          showMasterLinks.map((item, index) => (
            <SidebarLink key={index} href={item.href} label={item.label} />
          ))}

        {/* Fees LINK */}
        <button
          key={"fees"}
          onClick={() => setShowFees((prev) => !prev)}
          className={`flex w-full items-center justify-between px-8 py-3 text-gray-800 dark:text-gray-200 ${pathname.startsWith("/fees") && "bg-gray-100  dark:bg-gray-600"}`}
        >
          <span className="flex justify-center items-start gap-3">
            <Landmark className="h-5 w-5 text-gray-800 dark:text-gray-100" />
            <span className="font-medium">Fees</span>
          </span>
          {showFees ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>
        {/* Master LIST */}
        {showFees &&
          feesLinks.map((item, index) => (
            <SidebarLink key={index} href={item.href} label={item.label} />
          ))}

        {/* Master LINK */}
        <button
          key={"reports"}
          onClick={() => setShowReports((prev) => !prev)}
          className={`flex w-full items-center justify-between px-8 py-3 text-gray-800 dark:text-gray-200 ${pathname.startsWith("/reports") && "bg-gray-100  dark:bg-gray-600"}`}
        >
          <span className="flex justify-center items-start gap-3">
            <ClipboardMinus className="h-5 w-5 text-gray-800 dark:text-gray-100" />
            <span className="font-medium">Reports</span>
          </span>
          {showReports ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>
        {/* Master LIST */}
        {showReports &&
          reportsLinks.map((item, index) => (
            <SidebarLink key={index} href={item.href} label={item.label} />
          ))}

        <SidebarLink
          key={"logout"}
          label="Logout"
          href="/logout"
          icon={LogOut}
        />
      </div>
    </div>
  );
};

interface SidebarLinkProps {
  href: string;
  label: string;
  icon?: LucideIcon;
  isCollapsed?: boolean;
}

const SidebarLink = ({ href, icon: Icon, label }: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive =
    pathname === href || (pathname === "/" && href === "/dashboard");

  return (
    <Link href={href} className="w-full">
      <div
        className={`relative flex cursor-pointer items-center "justify-start" ${!Icon && "pl-16"} gap-3 px-8 py-3 transition-colors hover:bg-gray-100 dark:bg-black dark:hover:bg-gray-700 ${isActive && "bg-gray-100 text-white dark:bg-gray-600"}`}
      >
        {isActive && (
          <div className="absolute left-0 top-0 h-[100%] w-[5px] bg-blue-200"></div>
        )}
        {Icon && <Icon className="h-5 w-5 text-gray-800 dark:text-gray-100" />}
        <span className="font-medium text-gray-800 dark:text-gray-100">
          {label}
        </span>
      </div>
    </Link>
  );
};

export default Sidebar;
