import { getStats, getInvoices, getOverdueInvoices } from "@/lib/db";
import { Badge, Card } from "flowbite-react";
import {
  HiCurrencyDollar,
  HiDocumentText,
  HiExclamationCircle,
  HiUserGroup,
} from "react-icons/hi";

export default async function DashboardPage() {
  const stats = getStats();
  const recentInvoices = getInvoices(5) as any[];
  const overdueInvoices = getOverdueInvoices() as any[];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          CRM Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Oversikt over kunder og fakturaer
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
          color="green"
        />
        <StatCard
          title="Forfalt"
          value={stats.overdue_count || 0}
          icon={HiExclamationCircle}
          color="yellow"
          highlight={(stats.overdue_count || 0) > 0}
        />
        <StatCard
          title="Total omsetning"
          value={formatCurrency(stats.total_revenue || 0)}
          icon={HiCurrencyDollar}
          color="purple"
        />
      </div>

      {/* Two-column layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Invoices */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Siste fakturaer
          </h2>
          {recentInvoices && recentInvoices.length > 0 ? (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentInvoices.map((invoice: any) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between py-3"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {invoice.invoice_number || `#${invoice.id.slice(0, 8)}`}
                    </p>
                    <p className="text-sm text-gray-500">
                      {invoice.customer_name || "Ukjent kunde"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {formatCurrency(invoice.total || 0)}
                    </span>
                    <StatusBadge status={invoice.status || "draft"} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-gray-500">
              Ingen fakturaer ennå
            </p>
          )}
        </Card>

        {/* Overdue Invoices */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Forfalte fakturaer
          </h2>
          {overdueInvoices && overdueInvoices.length > 0 ? (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {overdueInvoices.map((invoice: any) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between py-3"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {invoice.invoice_number || `#${invoice.id.slice(0, 8)}`}
                    </p>
                    <p className="text-sm text-gray-500">
                      {invoice.customer_name || "Ukjent kunde"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-red-600">
                      {formatCurrency(invoice.total || 0)}
                    </p>
                    <p className="text-xs text-red-500">
                      Forfalt {new Date(invoice.due_date).toLocaleDateString("nb-NO")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-green-500">
              Ingen forfalte fakturaer
            </p>
          )}
        </Card>
      </div>
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

function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { color: string; label: string }> = {
    draft: { color: "info", label: "Kladd" },
    sent: { color: "warning", label: "Sendt" },
    paid: { color: "success", label: "Betalt" },
  };

  const config = statusConfig[status] || { color: "gray", label: status };

  return <Badge color={config.color}>{config.label}</Badge>;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("nb-NO", {
    style: "currency",
    currency: "NOK",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount / 100); // Convert from cents
}
