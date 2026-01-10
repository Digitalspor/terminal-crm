"use client";

import {
  Badge,
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  HiArrowLeft,
  HiCurrencyDollar,
  HiMail,
  HiOfficeBuilding,
  HiPhone,
  HiUser,
} from "react-icons/hi";

interface Customer {
  id: string;
  name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  address_street: string;
  address_postal_code: string;
  address_city: string;
  org_nr: string;
}

interface Invoice {
  id: string;
  invoice_number: string;
  date: string;
  due_date: string;
  total: number;
  vat: number;
  status: string;
}

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetch(`/api/customers/${params.id}`)
        .then((res) => res.json())
        .then((data) => {
          setCustomer(data.customer);
          setInvoices(data.invoices || []);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500">Laster kunde...</p>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-gray-500">Kunde ikke funnet</p>
          <Button color="gray" onClick={() => router.back()} className="mt-4">
            Tilbake
          </Button>
        </div>
      </div>
    );
  }

  const totalRevenue = invoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + (i.total || 0), 0);
  const totalOutstanding = invoices
    .filter((i) => i.status === "sent")
    .reduce((sum, i) => sum + (i.total || 0), 0);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <Button color="gray" size="sm" onClick={() => router.back()}>
          <HiArrowLeft className="mr-2 h-4 w-4" />
          Tilbake
        </Button>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {customer.name}
        </h1>
        {customer.org_nr && (
          <p className="text-gray-500 dark:text-gray-400">
            Org.nr: {customer.org_nr}
          </p>
        )}
      </div>

      {/* Customer Info Cards */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/20">
              <HiUser className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Kontaktperson
              </p>
              <p className="font-medium text-gray-900 dark:text-white">
                {customer.contact_name || "-"}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900/20">
              <HiMail className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">E-post</p>
              {customer.contact_email ? (
                <a
                  href={`mailto:${customer.contact_email}`}
                  className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                >
                  {customer.contact_email}
                </a>
              ) : (
                <p className="font-medium text-gray-900 dark:text-white">-</p>
              )}
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-purple-100 p-3 dark:bg-purple-900/20">
              <HiPhone className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Telefon</p>
              {customer.contact_phone ? (
                <a
                  href={`tel:${customer.contact_phone}`}
                  className="font-medium text-gray-900 hover:underline dark:text-white"
                >
                  {customer.contact_phone}
                </a>
              ) : (
                <p className="font-medium text-gray-900 dark:text-white">-</p>
              )}
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-orange-100 p-3 dark:bg-orange-900/20">
              <HiOfficeBuilding className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Adresse</p>
              {customer.address_street ? (
                <div className="font-medium text-gray-900 dark:text-white">
                  <p>{customer.address_street}</p>
                  <p>{customer.address_postal_code} {customer.address_city}</p>
                </div>
              ) : (
                <p className="font-medium text-gray-900 dark:text-white">-</p>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Financial Summary */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total omsetning
            </p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(totalRevenue)}
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Utestående
            </p>
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(totalOutstanding)}
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Antall fakturaer
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {invoices.length}
            </p>
          </div>
        </Card>
      </div>

      {/* Invoices Table */}
      <Card>
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Fakturaer
        </h2>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeadCell>Fakturanr.</TableHeadCell>
              <TableHeadCell>Dato</TableHeadCell>
              <TableHeadCell>Forfall</TableHeadCell>
              <TableHeadCell>Beløp</TableHeadCell>
              <TableHeadCell>Status</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody className="divide-y">
            {invoices.length > 0 ? (
              invoices.map((invoice) => (
                <TableRow
                  key={invoice.id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <TableCell>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {invoice.invoice_number || `#${invoice.id.slice(0, 8)}`}
                    </span>
                  </TableCell>
                  <TableCell>
                    {invoice.date
                      ? new Date(invoice.date).toLocaleDateString("nb-NO")
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {invoice.due_date ? (
                      <DueDateDisplay
                        dueDate={invoice.due_date}
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
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={invoice.status || "draft"} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center">
                  <p className="text-gray-500">Ingen fakturaer ennå</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
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
    (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
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
  }).format(amount / 100);
}
