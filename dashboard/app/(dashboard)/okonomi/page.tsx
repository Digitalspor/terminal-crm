"use client";

import { Card, Pagination, Progress, Select } from "flowbite-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  HiCash,
  HiDocumentText,
  HiExclamationCircle,
  HiTrendingUp,
  HiTrendingDown,
  HiOfficeBuilding,
} from "react-icons/hi";

type PeriodType = "year" | "month" | "week" | "day";

interface Stats {
  total_paid: number;
  total_outstanding: number;
  total_draft: number;
  overdue_count: number;
  overdue_amount: number;
  invoiced_period: number;
  paid_period: number;
  invoice_count: number;
}

interface Supplier {
  id: string;
  name: string;
  org_nr: string;
}

interface Expense {
  id: string | number;
  date: string;
  amount: number;
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

const periodLabels: Record<PeriodType, string> = {
  year: "I år",
  month: "Denne mnd",
  week: "Denne uke",
  day: "I dag",
};

export default function ØkonomiPage() {
  const [period, setPeriod] = useState<PeriodType>("year");
  const [stats, setStats] = useState<Stats | null>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [supplierPage, setSupplierPage] = useState(1);
  const suppliersPerPage = 10;

  useEffect(() => {
    const range = getDateRange(period);
    const params = new URLSearchParams();
    params.set("startDate", range.startDate);
    params.set("endDate", range.endDate);

    Promise.all([
      fetch(`/api/economy?${params}`).then((res) => res.json()),
      fetch("/api/suppliers").then((res) => res.json()).catch(() => []),
      fetch(`/api/fiken/purchases?startDate=${range.startDate}&endDate=${range.endDate}`)
        .then((res) => res.json())
        .catch(() => []),
    ])
      .then(([economyData, suppliersData, expensesData]) => {
        setStats(economyData.stats);
        setSuppliers(suppliersData);
        setExpenses(Array.isArray(expensesData) ? expensesData : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [period]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500">Laster...</p>
      </div>
    );
  }

  const totalRevenue = (stats?.total_paid || 0) / 100;
  const totalOutstanding = (stats?.total_outstanding || 0) / 100;
  const totalOverdue = (stats?.overdue_amount || 0) / 100;
  const invoicedPeriod = (stats?.invoiced_period || 0) / 100;
  const paidPeriod = (stats?.paid_period || 0) / 100;
  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const netCashFlow = paidPeriod - totalExpenses;

  // Supplier pagination
  const totalSupplierPages = Math.ceil(suppliers.length / suppliersPerPage);
  const supplierStartIndex = (supplierPage - 1) * suppliersPerPage;
  const paginatedSuppliers = suppliers.slice(supplierStartIndex, supplierStartIndex + suppliersPerPage);

  return (
    <div className="p-6">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Økonomi
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Oversikt over inntekter og utestående
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

      {/* Main Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title="Omsetning"
          value={formatCurrency(totalRevenue)}
          icon={HiCash}
          color="green"
          subtitle={`${periodLabels[period]}`}
        />
        <StatCard
          title="Kostnader"
          value={formatCurrency(totalExpenses)}
          icon={HiTrendingDown}
          color="orange"
          subtitle={`${expenses.length} poster`}
          href="/kostnader"
        />
        <StatCard
          title="Utestående"
          value={formatCurrency(totalOutstanding)}
          icon={HiDocumentText}
          color="blue"
          subtitle={`${stats?.invoice_count || 0} fakturaer`}
          href="/invoices"
        />
        <StatCard
          title="Forfalt"
          value={formatCurrency(totalOverdue)}
          icon={HiExclamationCircle}
          color="red"
          subtitle={`${stats?.overdue_count || 0} fakturaer`}
          highlight={(stats?.overdue_count || 0) > 0}
          href="/invoices"
        />
        <StatCard
          title="Fakturert"
          value={formatCurrency(invoicedPeriod)}
          icon={HiTrendingUp}
          color="purple"
          subtitle={`${formatCurrency(paidPeriod)} betalt`}
        />
      </div>

      {/* Cash Flow Progress */}
      <Card className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Kontantstrøm - {periodLabels[period]}
        </h2>
        <div className="space-y-4">
          <div>
            <div className="mb-1 flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Inntekter (betalt)</span>
              <span className="font-medium text-green-600 dark:text-green-400">+{formatCurrency(paidPeriod)}</span>
            </div>
            <Progress progress={100} color="green" size="lg" />
          </div>
          <div>
            <div className="mb-1 flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Kostnader</span>
              <span className="font-medium text-red-600 dark:text-red-400">-{formatCurrency(totalExpenses)}</span>
            </div>
            <Progress
              progress={paidPeriod > 0 ? Math.min((totalExpenses / paidPeriod) * 100, 100) : (totalExpenses > 0 ? 100 : 0)}
              color="red"
              size="lg"
            />
          </div>
          <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-700 dark:text-gray-300">Netto kontantstrøm</span>
              <span className={`font-bold ${netCashFlow >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                {netCashFlow >= 0 ? "+" : ""}{formatCurrency(netCashFlow)}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Leverandører */}
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-orange-100 p-3 dark:bg-orange-900/20">
              <HiOfficeBuilding className="size-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Leverandører
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {suppliers.length} leverandører registrert
              </p>
            </div>
          </div>
        </div>
        {suppliers.length > 0 ? (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedSuppliers.map((supplier) => (
              <div
                key={supplier.id}
                className="flex items-center justify-between py-3"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {supplier.name}
                  </p>
                  {supplier.org_nr && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Org.nr: {supplier.org_nr}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-4 text-center text-gray-500 dark:text-gray-400">
            Ingen leverandører registrert
          </p>
        )}
        {totalSupplierPages > 1 && (
          <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Viser {supplierStartIndex + 1}-{Math.min(supplierStartIndex + suppliersPerPage, suppliers.length)} av {suppliers.length}
            </p>
            <Pagination
              currentPage={supplierPage}
              totalPages={totalSupplierPages}
              onPageChange={setSupplierPage}
              showIcons
            />
          </div>
        )}
      </Card>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  subtitle,
  highlight,
  href,
}: {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: "green" | "blue" | "red" | "purple" | "orange";
  subtitle?: string;
  highlight?: boolean;
  href?: string;
}) {
  const colors = {
    green: "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400",
    blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    red: "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400",
    purple: "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
    orange: "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
  };

  const content = (
    <div className="flex items-center gap-4">
      <div className={`rounded-lg p-3 ${colors[color]}`}>
        <Icon className="size-6" />
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-xl font-bold text-gray-900 dark:text-white">
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-gray-400 dark:text-gray-500">{subtitle}</p>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href}>
        <Card className={`${highlight ? "ring-2 ring-red-400" : ""} cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800`}>
          {content}
        </Card>
      </Link>
    );
  }

  return (
    <Card className={highlight ? "ring-2 ring-red-400" : ""}>
      {content}
    </Card>
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
