"use client";

import { useSidebarContext } from "@/contexts/sidebar-context";
import {
  Sidebar,
  SidebarItem as SidebarItemDefault,
  SidebarItemGroup,
  SidebarItems,
} from "flowbite-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps, FC, HTMLAttributeAnchorTarget } from "react";
import { useEffect, useState } from "react";
import {
  HiChartPie,
  HiCurrencyDollar,
  HiExclamation,
  HiUserGroup,
} from "react-icons/hi";
import { twMerge } from "tailwind-merge";

interface SidebarItem {
  href?: string;
  target?: HTMLAttributeAnchorTarget;
  icon?: FC<ComponentProps<"svg">>;
  label: string;
  badge?: string;
}

interface SidebarItemProps extends SidebarItem {
  pathname: string;
}

export function DashboardSidebar() {
  return (
    <>
      <div className="lg:hidden">
        <MobileSidebar />
      </div>
      <div className="hidden lg:block">
        <DesktopSidebar />
      </div>
    </>
  );
}

function DesktopSidebar() {
  const pathname = usePathname();
  const { isCollapsed, setCollapsed } = useSidebarContext().desktop;
  const [isPreview, setIsPreview] = useState(isCollapsed);

  useEffect(() => {
    if (isCollapsed) setIsPreview(false);
  }, [isCollapsed]);

  const preview = {
    enable() {
      if (!isCollapsed) return;
      setIsPreview(true);
      setCollapsed(false);
    },
    disable() {
      if (!isPreview) return;
      setCollapsed(true);
    },
  };

  return (
    <Sidebar
      onMouseEnter={preview.enable}
      onMouseLeave={preview.disable}
      aria-label="CRM Sidebar"
      collapsed={isCollapsed}
      className={twMerge(
        "fixed inset-y-0 left-0 z-20 flex h-full shrink-0 flex-col border-r border-gray-200 pt-16 duration-75 sm:flex lg:flex dark:border-gray-700",
        isCollapsed && "hidden w-16",
      )}
      id="sidebar"
    >
      <div className="flex h-full flex-col justify-between">
        <div className="py-2">
          <SidebarItems>
            <SidebarItemGroup className="mt-0 border-t-0 pt-0 pb-1">
              {pages.map((item) => (
                <SidebarItemComponent key={item.label} {...item} pathname={pathname} />
              ))}
            </SidebarItemGroup>
          </SidebarItems>
        </div>
      </div>
    </Sidebar>
  );
}

function MobileSidebar() {
  const pathname = usePathname();
  const { isOpen, close } = useSidebarContext().mobile;

  if (!isOpen) return null;

  return (
    <>
      <Sidebar
        aria-label="CRM Sidebar"
        className={twMerge(
          "fixed inset-y-0 left-0 z-20 hidden h-full shrink-0 flex-col border-r border-gray-200 pt-16 lg:flex dark:border-gray-700",
          isOpen && "flex",
        )}
        id="sidebar"
      >
        <div className="flex h-full flex-col justify-between">
          <div className="py-2">
            <SidebarItems>
              <SidebarItemGroup className="mt-0 border-t-0 pt-0 pb-1">
                {pages.map((item) => (
                  <SidebarItemComponent key={item.label} {...item} pathname={pathname} />
                ))}
              </SidebarItemGroup>
            </SidebarItems>
          </div>
        </div>
      </Sidebar>
      <div
        onClick={close}
        aria-hidden="true"
        className="fixed inset-0 z-10 h-full w-full bg-gray-900/50 pt-16 dark:bg-gray-900/90"
      />
    </>
  );
}

function SidebarItemComponent({ href, icon, label, badge, pathname }: SidebarItemProps) {
  return (
    <SidebarItemDefault
      as={Link}
      href={href}
      icon={icon}
      label={badge}
      labelColor="blue"
      className={twMerge(pathname === href && "bg-gray-100 dark:bg-gray-700")}
    >
      {label}
    </SidebarItemDefault>
  );
}

const pages: SidebarItem[] = [
  { href: "/dashboard", icon: HiChartPie, label: "Dashboard" },
  { href: "/customers", icon: HiUserGroup, label: "Kunder" },
  { href: "/invoices", icon: HiCurrencyDollar, label: "Fakturaer" },
  { href: "/overdue", icon: HiExclamation, label: "Forfalte" },
];
