import React from "react";
import { Menu, Settings } from "lucide-react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/redux";
import { setIsSidebarCollapsed } from "@/store/state";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  return (
    <div className="flex items-center justify-between bg-white px-4 py-3 dark:bg-black">
      {/* Search Bar */}
      <div className="flex items-center gap-8">
        {isSidebarCollapsed && (
          <button onClick={() => dispatch(setIsSidebarCollapsed(false))}>
            <Menu className="h-8 w-8 dark:text-white" />
          </button>
        )}
      </div>

      {/* Icons */}
      <div className="flex items-center">
        <Link
          href={"/settings"}
          className={`h-min w-min rounded p-2 ${isDarkMode ? "dark:hover:bg-gray-700" : "hover:bg-gray-100"}`}
        >
          <Settings className="h-6 w-6 cursor-pointer dark:text-white" />
        </Link>
        <div className="ml-2 mr-5 hidden min-h-[2rem] w-[0.1rem] bg-gray-200 md:inline-block" />
      </div>
    </div>
  );
};

export default Navbar;
