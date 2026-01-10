import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface Expense {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  vendor: string;
  notes?: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  try {
    const expensesDir = path.join(process.cwd(), "..", "data", "expenses");

    if (!fs.existsSync(expensesDir)) {
      return NextResponse.json([]);
    }

    const files = fs.readdirSync(expensesDir).filter((f) => f.endsWith(".json"));

    const expenses: Expense[] = [];

    for (const file of files) {
      try {
        const content = fs.readFileSync(path.join(expensesDir, file), "utf-8");
        const expense = JSON.parse(content) as Expense;

        // Filter by date range if provided
        if (startDate && endDate && expense.date) {
          if (expense.date >= startDate && expense.date <= endDate) {
            expenses.push(expense);
          }
        } else {
          expenses.push(expense);
        }
      } catch {
        // Skip invalid files
      }
    }

    // Sort by date descending
    expenses.sort((a, b) => (b.date || "").localeCompare(a.date || ""));

    return NextResponse.json(expenses);
  } catch (error) {
    console.error("Failed to fetch expenses:", error);
    return NextResponse.json([], { status: 500 });
  }
}
