"use client";

import { useSidebarContext } from "@/contexts/sidebar-context";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  DarkThemeToggle,
  Navbar,
  NavbarBrand,
  Tooltip,
} from "flowbite-react";
import Link from "next/link";
import {
  HiMenuAlt1,
  HiX,
} from "react-icons/hi";

export function DashboardNavbar() {
  const sidebar = useSidebarContext();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  function handleToggleSidebar() {
    if (isDesktop) {
      sidebar.desktop.toggle();
    } else {
      sidebar.mobile.toggle();
    }
  }

  return (
    <Navbar
      fluid
      className="fixed top-0 z-30 w-full border-b border-gray-200 bg-white p-0 sm:p-0 dark:border-gray-700 dark:bg-gray-800"
    >
      <div className="w-full p-3 pr-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={handleToggleSidebar}
              className="mr-3 cursor-pointer rounded p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <span className="sr-only">Toggle sidebar</span>
              {/* mobile */}
              <div className="lg:hidden">
                {sidebar.mobile.isOpen ? (
                  <HiX className="h-6 w-6" />
                ) : (
                  <HiMenuAlt1 className="h-6 w-6" />
                )}
              </div>
              {/* desktop */}
              <div className="hidden lg:block">
                <HiMenuAlt1 className="h-6 w-6" />
              </div>
            </button>
            <NavbarBrand as={Link} href="/dashboard" className="mr-14">
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                CRM Dashboard
              </span>
            </NavbarBrand>
          </div>
          <div className="flex items-center lg:gap-3">
            <div className="flex items-center">
              <div className="hidden dark:block">
                <Tooltip content="Toggle light mode">
                  <DarkThemeToggle />
                </Tooltip>
              </div>
              <div className="dark:hidden">
                <Tooltip content="Toggle dark mode">
                  <DarkThemeToggle />
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Navbar>
  );
}
