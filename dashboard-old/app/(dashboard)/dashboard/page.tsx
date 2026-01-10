import { getStats, getOverdueInvoices } from "@/lib/db";
import { Badge, Card } from "flowbite-react";
import Link from "next/link";
import {
  HiCurrencyDollar,
  HiDocumentText,
  HiExclamation,
  HiUserGroup,
} from "react-icons/hi";

export const dynamic = "force-dynamic";

interface Stats {
  total_customers: number;
  total_invoices: number;
  total_projects: number;
  total_revenue: number | null;
  outstanding: number | null;
  overdue_count: number;
}

interface OverdueInvoice {
  id: string;
  invoice_number: string;
  customer_name: string;
  due_date: string;
  total: number;
}

export default function DashboardPage() {
  const stats = getStats() as Stats;
  const overdueInvoices = getOverdueInvoices() as OverdueInvoice[];

  const formatCurrency = (amount: number | null) => {
    if (amount === null || amount === undefined) return "kr 0";
    return new Intl.NumberFormat("nb-NO", {
      style: "currency",
      currency: "NOK",
      minimumFractionDigits: 0,
    }).format(amount / 100);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Oversikt over CRM-data
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Kunder"
          value={stats.total_customers || 0}
          icon={HiUserGroup}
          color="blue"
        />
        <StatCard
          title="Fakturaer"
          value={stats.total_invoices || 0}
          icon={HiDocumentText}
          color="purple"
        />
        <StatCard
          title="Omsetning"
          value={formatCurrency(stats.total_revenue)}
          icon={HiCurrencyDollar}
          color="green"
        />
        <StatCard
          title="Forfalte"
          value={stats.overdue_count || 0}
          icon={HiExclamation}
          color="yellow"
          highlight={stats.overdue_count > 0}
        />
      </div>

      {/* Overdue Invoices */}
      {overdueInvoices.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Forfalte fakturaer
            </h2>
            <Link href="/overdue">
              <Badge color="failure">Se alle</Badge>
            </Link>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {overdueInvoices.slice(0, 5).map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between py-3"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    #{invoice.invoice_number}
                  </p>
                  <p className="text-sm text-gray-500">
                    {invoice.customer_name || "Ukjent kunde"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge color="failure">{invoice.due_date}</Badge>
                  <span className="font-bold text-red-600">
                    {formatCurrency(invoice.total)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {overdueInvoices.length === 0 && (
        <Card>
          <div className="py-8 text-center">
            <HiExclamation className="mx-auto h-12 w-12 text-green-400" />
            <h3 className="mt-4 text-lg font-medium text-green-900 dark:text-green-300">
              Ingen forfalte fakturaer!
            </h3>
            <p className="mt-2 text-sm text-green-600 dark:text-green-400">
              Alle fakturaer er betalt eller ikke forfalt ennaa.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  highlight,
}: {
  title: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  color: "blue" | "green" | "yellow" | "purple";
  highlight?: boolean;
}) {
  const colors = {
    blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    green:
      "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400",
    yellow:
      "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400",
    purple:
      "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
  };

  return (
    <Card className={highlight ? "ring-2 ring-yellow-400" : ""}>
      <div className="flex items-center gap-4">
        <div className={`rounded-lg p-3 ${colors[color]}`}>
          <Icon className="size-6" />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
        </div>
      </div>
    </Card>
  );
}
