"use client";

import { useSidebarContext } from "@/contexts/sidebar-context";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Avatar,
  DarkThemeToggle,
  Dropdown,
  DropdownHeader,
  DropdownItem,
  Navbar,
  NavbarBrand,
  TextInput,
  Tooltip,
} from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  HiChartPie,
  HiCurrencyDollar,
  HiDocumentText,
  HiLightningBolt,
  HiMenuAlt1,
  HiSearch,
  HiUserGroup,
  HiViewBoards,
  HiX,
} from "react-icons/hi";

interface SearchResult {
  customers: any[];
  invoices: any[];
  projects: any[];
  leads: any[];
}

export function DashboardNavbar() {
  const sidebar = useSidebarContext();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  function handleToggleSidebar() {
    if (isDesktop) {
      sidebar.desktop.toggle();
    } else {
      sidebar.mobile.toggle();
    }
  }

  const performSearch = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSearchResults(null);
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setSearchResults(data);
      setShowResults(true);
    } catch (e) {
      console.error("Search error:", e);
    }
    setIsSearching(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, performSearch]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasResults = searchResults && (
    searchResults.customers.length > 0 ||
    searchResults.invoices.length > 0 ||
    searchResults.projects.length > 0 ||
    searchResults.leads.length > 0
  );

  const handleResultClick = (path: string) => {
    setShowResults(false);
    setSearchQuery("");
    router.push(path);
  };

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
              <div className="lg:hidden">
                {sidebar.mobile.isOpen ? (
                  <HiX className="h-6 w-6" />
                ) : (
                  <HiMenuAlt1 className="h-6 w-6" />
                )}
              </div>
              <div className="hidden lg:block">
                <HiMenuAlt1 className="h-6 w-6" />
              </div>
            </button>
            <NavbarBrand as={Link} href="/dashboard" className="mr-6">
              <Image
                className="mr-3 h-8"
                alt=""
                src="/images/logo.svg"
                width={32}
                height={32}
              />
              <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
                CRM
              </span>
            </NavbarBrand>

            {/* Global Search */}
            <div ref={searchRef} className="relative hidden lg:block">
              <TextInput
                className="w-80"
                icon={HiSearch}
                placeholder="Søk etter kunder, fakturaer, prosjekter..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
              />

              {/* Search Results Dropdown */}
              {showResults && searchQuery.length >= 2 && (
                <div className="absolute top-full left-0 mt-1 w-96 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                  {isSearching ? (
                    <div className="p-4 text-center text-gray-500">Søker...</div>
                  ) : hasResults ? (
                    <div className="max-h-96 overflow-y-auto">
                      {searchResults.customers.length > 0 && (
                        <SearchSection
                          title="Kunder"
                          icon={HiUserGroup}
                          items={searchResults.customers}
                          renderItem={(item) => (
                            <button
                              key={item.id}
                              onClick={() => handleResultClick("/customers")}
                              className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                                <p className="text-sm text-gray-500">{item.contact_email}</p>
                              </div>
                            </button>
                          )}
                        />
                      )}
                      {searchResults.leads.length > 0 && (
                        <SearchSection
                          title="Leads"
                          icon={HiLightningBolt}
                          items={searchResults.leads}
                          renderItem={(item) => (
                            <button
                              key={item.id}
                              onClick={() => handleResultClick("/leads")}
                              className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">{item.company_name}</p>
                                <p className="text-sm text-gray-500">{item.contact_name}</p>
                              </div>
                            </button>
                          )}
                        />
                      )}
                      {searchResults.projects.length > 0 && (
                        <SearchSection
                          title="Prosjekter"
                          icon={HiViewBoards}
                          items={searchResults.projects}
                          renderItem={(item) => (
                            <button
                              key={item.id}
                              onClick={() => handleResultClick("/prosjekter")}
                              className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                                <p className="text-sm text-gray-500">{item.customer_name}</p>
                              </div>
                            </button>
                          )}
                        />
                      )}
                      {searchResults.invoices.length > 0 && (
                        <SearchSection
                          title="Fakturaer"
                          icon={HiDocumentText}
                          items={searchResults.invoices}
                          renderItem={(item) => (
                            <button
                              key={item.id}
                              onClick={() => handleResultClick("/invoices")}
                              className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {item.invoice_number || `#${item.id.slice(0, 8)}`}
                                </p>
                                <p className="text-sm text-gray-500">{item.customer_name}</p>
                              </div>
                            </button>
                          )}
                        />
                      )}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      Ingen resultater for "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center lg:gap-3">
            <div className="flex items-center">
              {/* Mobile search button */}
              <button className="cursor-pointer rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 lg:hidden dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                <HiSearch className="h-6 w-6" />
              </button>

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
              <div className="ml-3 flex items-center">
                <UserDropdown />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Navbar>
  );
}

function SearchSection({
  title,
  icon: Icon,
  items,
  renderItem,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: any[];
  renderItem: (item: any) => React.ReactNode;
}) {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
      <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 dark:bg-gray-700">
        <Icon className="h-4 w-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</span>
      </div>
      {items.map(renderItem)}
    </div>
  );
}

function UserDropdown() {
  return (
    <Dropdown
      className="rounded"
      arrowIcon={false}
      inline
      label={
        <span>
          <span className="sr-only">User menu</span>
          <Avatar alt="" placeholderInitials="AD" rounded size="sm" />
        </span>
      }
    >
      <DropdownHeader className="px-4 py-3">
        <span className="block text-sm">Admin</span>
        <span className="block truncate text-sm font-medium">CRM Terminal</span>
      </DropdownHeader>
      <DropdownItem as={Link} href="/dashboard">
        Dashboard
      </DropdownItem>
      <DropdownItem as={Link} href="/settings">
        Innstillinger
      </DropdownItem>
    </Dropdown>
  );
}
