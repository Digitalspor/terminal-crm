"use client";

import {
  Badge,
  Card,
  Pagination,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  TextInput,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { HiSearch } from "react-icons/hi";

type PeriodType = "year" | "month" | "week" | "day";

interface Invoice {
  id: string | number;
  invoice_number?: string;
  invoiceNumber?: number;
  customer_name?: string;
  customerName?: string;
  date: string;
  due_date?: string;
  dueDate?: string;
  total: number;
  vat?: number;
  status: string;
}

function getDateRange(period: PeriodType): { startDate: string; endDate: string } {
  const now = new Date();
  const endDate = now.toISOString().split("T")[0];

  switch (period) {
    case "day":
      return { startDate: endDate, endDate };
    case "week": {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay() + 1);
      return { startDate: weekStart.toISOString().split("T")[0], endDate };
    }
    case "month": {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      return { startDate: monthStart.toISOString().split("T")[0], endDate };
    }
    case "year":
    default: {
      const yearStart = new Date(now.getFullYear(), 0, 1);
      return { startDate: yearStart.toISOString().split("T")[0], endDate };
    }
  }
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [period, setPeriod] = useState<PeriodType>("month");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    // Fetch from Fiken API for real-time status
    const range = getDateRange("year"); // Get all invoices for current year
    fetch(`/api/fiken/invoices?startDate=${range.startDate}&endDate=${range.endDate}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setInvoices(data);
        }
        setLoading(false);
      })
      .catch(() => {
        // Fallback to local database if Fiken fails
        fetch("/api/invoices")
          .then((res) => res.json())
          .then((data) => {
            setInvoices(data);
            setLoading(false);
          })
          .catch(() => setLoading(false));
      });
  }, []);

  useEffect(() => {
    let filtered = invoices;

    // Filter by period
    const range = getDateRange(period);
    filtered = filtered.filter((i) => {
      const date = i.date;
      return date >= range.startDate && date <= range.endDate;
    });

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((i) => {
        const invoiceNum = String(i.invoice_number || i.invoiceNumber || "");
        const customerName = i.customer_name || i.customerName || "";
        return (
          invoiceNum.toLowerCase().includes(query) ||
          customerName.toLowerCase().includes(query)
        );
      });
    }

    setFilteredInvoices(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, invoices, period]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInvoices = filteredInvoices.slice(startIndex, startIndex + itemsPerPage);

  const draftCount = filteredInvoices.filter((i) => i.status === "draft").length;
  const sentCount = filteredInvoices.filter((i) => i.status === "sent").length;
  const paidCount = filteredInvoices.filter((i) => i.status === "paid").length;
  const totalAmount = filteredInvoices.reduce((sum, i) => sum + (i.total || 0), 0);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500">Laster fakturaer...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Fakturaer
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {filteredInvoices.length} av {invoices.length} fakturaer - {formatCurrency(totalAmount)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">Periode:</span>
          <Select
            value={period}
            onChange={(e) => setPeriod(e.target.value as PeriodType)}
            className="w-40"
          >
            <option value="year">I år</option>
            <option value="month">Denne måned</option>
            <option value="week">Denne uke</option>
            <option value="day">I dag</option>
          </Select>
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <StatCard label="Kladder" value={draftCount} color="blue" />
        <StatCard label="Sendt" value={sentCount} color="yellow" />
        <StatCard label="Betalt" value={paidCount} color="green" />
        <StatCard label="Totalt" value={formatCurrency(totalAmount)} color="purple" isAmount />
      </div>

      {/* Search Input */}
      <div className="mb-4">
        <TextInput
          icon={HiSearch}
          placeholder="Søk etter fakturanummer eller kunde..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      <Card>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeadCell>Fakturanr.</TableHeadCell>
              <TableHeadCell>Kunde</TableHeadCell>
              <TableHeadCell>Dato</TableHeadCell>
              <TableHeadCell>Forfall</TableHeadCell>
              <TableHeadCell>Beløp</TableHeadCell>
              <TableHeadCell>Status</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody className="divide-y">
            {paginatedInvoices.length > 0 ? (
              paginatedInvoices.map((invoice) => {
                const invoiceNumber = invoice.invoice_number || invoice.invoiceNumber;
                const customerName = invoice.customer_name || invoice.customerName;
                const dueDate = invoice.due_date || invoice.dueDate;

                return (
                  <TableRow
                    key={invoice.id}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <TableCell>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {invoiceNumber || `#${String(invoice.id).slice(0, 8)}`}
                      </span>
                    </TableCell>
                    <TableCell>{customerName || "-"}</TableCell>
                    <TableCell>
                      {invoice.date
                        ? new Date(invoice.date).toLocaleDateString("nb-NO")
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {dueDate ? (
                        <DueDateDisplay
                          dueDate={dueDate}
                          status={invoice.status}
                        />
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">
                        {formatCurrency(invoice.total || 0)}
                      </span>
                      {invoice.vat && invoice.vat > 0 && (
                        <span className="block text-xs text-gray-500">
                          inkl. {formatCurrency(invoice.vat)} mva
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={invoice.status || "draft"} />
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center">
                  <p className="text-gray-500">
                    {searchQuery
                      ? `Ingen fakturaer funnet for "${searchQuery}"`
                      : "Ingen fakturaer i valgt periode"}
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Viser {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredInvoices.length)} av {filteredInvoices.length} fakturaer
          </p>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            showIcons
          />
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
  isAmount = false,
}: {
  label: string;
  value: number | string;
  color: "blue" | "yellow" | "green" | "purple";
  isAmount?: boolean;
}) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    yellow:
      "bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400",
    green:
      "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
    purple:
      "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
  };

  return (
    <Card>
      <div className="flex items-center gap-4">
        <div
          className={`flex ${isAmount ? 'px-3' : 'size-12'} items-center justify-center rounded-lg ${colorClasses[color]}`}
        >
          <span className={`${isAmount ? 'text-sm' : 'text-xl'} font-bold`}>{value}</span>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        </div>
      </div>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { color: string; label: string }> = {
    draft: { color: "info", label: "Kladd" },
    sent: { color: "warning", label: "Sendt" },
    paid: { color: "success", label: "Betalt" },
  };
  const c = config[status] || { color: "gray", label: status };
  return <Badge color={c.color}>{c.label}</Badge>;
}

function DueDateDisplay({
  dueDate,
  status,
}: {
  dueDate: string;
  status: string;
}) {
  const date = new Date(dueDate);
  const now = new Date();
  const diffDays = Math.ceil(
    (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );

  const isOverdue = diffDays < 0 && status !== "paid";
  const isNearDue = diffDays >= 0 && diffDays <= 3 && status !== "paid";

  return (
    <span
      className={
        isOverdue
          ? "font-medium text-red-600"
          : isNearDue
            ? "font-medium text-yellow-600"
            : ""
      }
    >
      {date.toLocaleDateString("nb-NO")}
      {isOverdue && <span className="ml-1 text-xs">(forfalt)</span>}
    </span>
  );
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("nb-NO", {
    style: "currency",
    currency: "NOK",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
