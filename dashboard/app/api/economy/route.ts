import { getEconomyStats, getOverdueInvoices, getInvoicesByPeriod } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  const stats = getEconomyStats(startDate || undefined, endDate || undefined);
  const overdueInvoices = getOverdueInvoices();
  const recentInvoices = getInvoicesByPeriod(startDate || undefined, endDate || undefined, 10);

  return NextResponse.json({
    stats,
    overdueInvoices,
    recentInvoices,
  });
}
