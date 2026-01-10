"use client";

import {
  Card,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { HiTrendingDown } from "react-icons/hi";

type PeriodType = "year" | "month" | "week" | "day";

interface Expense {
  id: string | number;
  date: string;
  description: string;
  category: string;
  amount: number;
  vendor: string;
  paid?: boolean;
  kind?: string;
}

function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDateRange(period: PeriodType): { startDate: string; endDate: string } {
  const now = new Date();
  const endDate = formatLocalDate(now);

  switch (period) {
    case "day":
      return { startDate: endDate, endDate };
    case "week": {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay() + 1);
      return { startDate: formatLocalDate(weekStart), endDate };
    }
    case "month": {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      return { startDate: formatLocalDate(monthStart), endDate };
    }
    case "year":
    default: {
      const yearStart = new Date(now.getFullYear(), 0, 1);
      return { startDate: formatLocalDate(yearStart), endDate };
    }
  }
}

const periodLabels: Record<PeriodType, string> = {
  year: "I år",
  month: "Denne måned",
  week: "Denne uke",
  day: "I dag",
};

export default function KostnaderPage() {
  const [period, setPeriod] = useState<PeriodType>("month");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const range = getDateRange(period);
    // Try Fiken API first, fallback to local expenses
    fetch(`/api/fiken/purchases?startDate=${range.startDate}&endDate=${range.endDate}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setExpenses(data);
        }
        setLoading(false);
      })
      .catch(() => {
        // Fallback to local expenses
        fetch(`/api/expenses?startDate=${range.startDate}&endDate=${range.endDate}`)
          .then((res) => res.json())
          .then((data) => {
            setExpenses(data);
            setLoading(false);
          })
          .catch(() => setLoading(false));
      });
  }, [period]);

  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);

  // Group by category
  const byCategory = expenses.reduce((acc, expense) => {
    const cat = expense.category || "Annet";
    acc[cat] = (acc[cat] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500">Henter kostnader...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Kostnader
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Oversikt over utgifter og kostnader
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

      {/* Summary Card */}
      <Card className="mb-8">
        <div className="flex items-center gap-4">
          <div className="rounded-lg bg-red-100 p-4 dark:bg-red-900/20">
            <HiTrendingDown className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Totale kostnader - {periodLabels[period]}
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(totalExpenses)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {expenses.length} poster
            </p>
          </div>
        </div>
      </Card>

      {/* Category Summary */}
      {Object.keys(byCategory).length > 0 && (
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(byCategory)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 4)
            .map(([category, amount]) => (
              <Card key={category}>
                <p className="text-sm text-gray-500 dark:text-gray-400">{category}</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(amount)}
                </p>
              </Card>
            ))}
        </div>
      )}

      {/* Expenses Table */}
      <Card>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeadCell>Dato</TableHeadCell>
              <TableHeadCell>Beskrivelse</TableHeadCell>
              <TableHeadCell>Leverandør</TableHeadCell>
              <TableHeadCell>Kategori</TableHeadCell>
              <TableHeadCell>Beløp</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody className="divide-y">
            {expenses.length > 0 ? (
              expenses.map((expense) => (
                <TableRow
                  key={expense.id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <TableCell>
                    {expense.date
                      ? new Date(expense.date).toLocaleDateString("nb-NO")
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {expense.description || "-"}
                    </span>
                  </TableCell>
                  <TableCell>{expense.vendor || "-"}</TableCell>
                  <TableCell>
                    <span className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-700">
                      {expense.category || "Annet"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-red-600">
                      {formatCurrency(expense.amount || 0)}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center">
                  <p className="text-gray-500">Ingen kostnader i valgt periode</p>
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
  }).format(amount);
}
