import { getCustomers } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const customers = getCustomers(500);
  return NextResponse.json(customers);
}
