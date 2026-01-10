import { getInvoices } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const invoices = getInvoices(500);
  return NextResponse.json(invoices);
}
