import { SidebarProvider } from "@/contexts/sidebar-context";
import type { PropsWithChildren } from "react";
import { LayoutContent } from "./layout-content";
import { DashboardNavbar } from "./navbar";
import { DashboardSidebar } from "./sidebar";

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <SidebarProvider initialCollapsed={false}>
      <DashboardNavbar />
      <div className="mt-16 flex items-start">
        <DashboardSidebar />
        <LayoutContent>{children}</LayoutContent>
      </div>
    </SidebarProvider>
  );
}
