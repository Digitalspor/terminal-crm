"use client";

import {
  Badge,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  TextInput,
} from "flowbite-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HiChevronRight, HiSearch } from "react-icons/hi";

interface Customer {
  id: string;
  name: string;
  contact_name: string;
  contact_email: string;
  org_nr: string;
  invoice_count: number;
  total_revenue: number;
}

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/customers")
      .then((res) => res.json())
      .then((data) => {
        setCustomers(data);
        setFilteredCustomers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredCustomers(customers);
      return;
    }
    const query = searchQuery.toLowerCase();
    setFilteredCustomers(
      customers.filter(
        (c) =>
          c.name?.toLowerCase().includes(query) ||
          c.contact_name?.toLowerCase().includes(query) ||
          c.contact_email?.toLowerCase().includes(query) ||
          c.org_nr?.includes(query),
      ),
    );
  }, [searchQuery, customers]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500">Laster kunder...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Kunder
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {filteredCustomers.length} av {customers.length} kunder
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="mb-4">
        <TextInput
          icon={HiSearch}
          placeholder="Søk etter kunde, kontakt, e-post eller org.nr..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      <Card>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeadCell>Navn</TableHeadCell>
              <TableHeadCell>Kontakt</TableHeadCell>
              <TableHeadCell>E-post</TableHeadCell>
              <TableHeadCell>Org.nr</TableHeadCell>
              <TableHeadCell>Fakturaer</TableHeadCell>
              <TableHeadCell>Omsetning</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody className="divide-y">
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <TableRow
                  key={customer.id}
                  onClick={() => router.push(`/customers/${customer.id}`)}
                  className="cursor-pointer bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <TableCell>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {customer.name}
                    </span>
                  </TableCell>
                  <TableCell>{customer.contact_name || "-"}</TableCell>
                  <TableCell>
                    {customer.contact_email ? (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `mailto:${customer.contact_email}`;
                        }}
                        className="cursor-pointer text-blue-600 hover:underline dark:text-blue-400"
                      >
                        {customer.contact_email}
                      </span>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>{customer.org_nr || "-"}</TableCell>
                  <TableCell>
                    <Badge color="gray">{customer.invoice_count || 0}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {formatCurrency(customer.total_revenue || 0)}
                      </span>
                      <HiChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center">
                  <p className="text-gray-500">
                    {searchQuery
                      ? `Ingen kunder funnet for "${searchQuery}"`
                      : "Ingen kunder ennå"}
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("nb-NO", {
    style: "currency",
    currency: "NOK",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount / 100);
}
