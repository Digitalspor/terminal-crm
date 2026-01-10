"use client";

import type { PropsWithChildren } from "react";
import { createContext, useContext, useState } from "react";

interface SidebarContextProps {
  desktop: {
    isCollapsed: boolean;
    setCollapsed(value: boolean): void;
    toggle(): void;
  };
  mobile: {
    isOpen: boolean;
    close(): void;
    toggle(): void;
  };
}

const SidebarContext = createContext<SidebarContextProps | null>(null);

export function SidebarProvider({
  initialCollapsed = false,
  children,
}: PropsWithChildren<{ initialCollapsed?: boolean }>) {
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [isCollapsed, setCollapsed] = useState(initialCollapsed);

  return (
    <SidebarContext.Provider
      value={{
        desktop: {
          isCollapsed,
          setCollapsed,
          toggle: () => setCollapsed(!isCollapsed),
        },
        mobile: {
          isOpen: isOpenMobile,
          close: () => setIsOpenMobile(false),
          toggle: () => setIsOpenMobile((state) => !state),
        },
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebarContext(): SidebarContextProps {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error(
      "useSidebarContext must be used within the SidebarContext provider!",
    );
  }

  return context;
}
