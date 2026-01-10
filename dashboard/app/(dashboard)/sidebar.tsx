"use client";

import { useSidebarContext } from "@/contexts/sidebar-context";
import {
  Sidebar,
  SidebarCollapse,
  SidebarItem as SidebarItemDefault,
  SidebarItemGroup,
  SidebarItems,
  Tooltip,
} from "flowbite-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps, FC, HTMLAttributeAnchorTarget } from "react";
import { useEffect, useState } from "react";
import {
  HiChartPie,
  HiCash,
  HiCog,
  HiCreditCard,
  HiCurrencyDollar,
  HiLightningBolt,
  HiMail,
  HiOfficeBuilding,
  HiTrendingDown,
  HiUserGroup,
  HiViewBoards,
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

const mainPages: SidebarItem[] = [
  { href: "/dashboard", icon: HiChartPie, label: "Dashboard" },
  { href: "/leads", icon: HiLightningBolt, label: "Leads" },
  { href: "/customers", icon: HiUserGroup, label: "Kunder" },
  { href: "/prosjekter", icon: HiViewBoards, label: "Prosjekter" },
];

const bottomPages: SidebarItem[] = [
  { href: "/invoices", icon: HiCurrencyDollar, label: "Faktura" },
  { href: "/epost", icon: HiMail, label: "E-post" },
];

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
              {mainPages.map((item) => (
                <SidebarItem key={item.label} {...item} pathname={pathname} />
              ))}
              <SidebarCollapse icon={HiCash} label="Økonomi" open={pathname.startsWith("/okonomi") || pathname.startsWith("/kontoer") || pathname.startsWith("/kostnader")}>
                <SidebarItemDefault as={Link} href="/okonomi" className={twMerge(pathname === "/okonomi" && "bg-gray-100 dark:bg-gray-700")}>
                  Oversikt
                </SidebarItemDefault>
                <SidebarItemDefault as={Link} href="/kontoer" className={twMerge(pathname === "/kontoer" && "bg-gray-100 dark:bg-gray-700")}>
                  Kontoer
                </SidebarItemDefault>
                <SidebarItemDefault as={Link} href="/kostnader" className={twMerge(pathname === "/kostnader" && "bg-gray-100 dark:bg-gray-700")}>
                  Kostnader
                </SidebarItemDefault>
              </SidebarCollapse>
              {bottomPages.map((item) => (
                <SidebarItem key={item.label} {...item} pathname={pathname} />
              ))}
            </SidebarItemGroup>
          </SidebarItems>
        </div>
        <BottomMenu isCollapsed={isCollapsed} />
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
                {mainPages.map((item) => (
                  <SidebarItem key={item.label} {...item} pathname={pathname} />
                ))}
                <SidebarCollapse icon={HiCash} label="Økonomi" open={pathname.startsWith("/okonomi") || pathname.startsWith("/kontoer") || pathname.startsWith("/kostnader")}>
                  <SidebarItemDefault as={Link} href="/okonomi" className={twMerge(pathname === "/okonomi" && "bg-gray-100 dark:bg-gray-700")}>
                    Oversikt
                  </SidebarItemDefault>
                  <SidebarItemDefault as={Link} href="/kontoer" className={twMerge(pathname === "/kontoer" && "bg-gray-100 dark:bg-gray-700")}>
                    Kontoer
                  </SidebarItemDefault>
                  <SidebarItemDefault as={Link} href="/kostnader" className={twMerge(pathname === "/kostnader" && "bg-gray-100 dark:bg-gray-700")}>
                    Kostnader
                  </SidebarItemDefault>
                </SidebarCollapse>
                {bottomPages.map((item) => (
                  <SidebarItem key={item.label} {...item} pathname={pathname} />
                ))}
              </SidebarItemGroup>
            </SidebarItems>
          </div>
          <BottomMenu isCollapsed={false} />
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

function SidebarItem({ href, icon, label, badge, pathname }: SidebarItemProps) {
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

function BottomMenu({ isCollapsed }: { isCollapsed: boolean }) {
  return (
    <div
      className={twMerge(
        "flex items-center justify-center gap-4 border-t border-gray-200 py-4 dark:border-gray-700",
        isCollapsed && "flex-col",
      )}
    >
      <Tooltip content="Innstillinger">
        <Link
          href="/settings"
          className="inline-flex cursor-pointer justify-center rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          <span className="sr-only">Innstillinger</span>
          <HiCog className="size-6" />
        </Link>
      </Tooltip>
    </div>
  );
}
