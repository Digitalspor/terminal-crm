import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// Suppliers are customers with no invoices (they sell TO us, not buy FROM us)
export async function GET() {
  try {
    const db = getDb();
    const suppliers = db
      .prepare(
        `SELECT c.id, c.name, c.org_nr, c.contact_name, c.contact_email
         FROM customers c
         LEFT JOIN invoices i ON c.id = i.customer_id
         GROUP BY c.id
         HAVING COUNT(i.id) = 0
         ORDER BY c.name`
      )
      .all();

    return NextResponse.json(suppliers);
  } catch (error) {
    console.error("Failed to fetch suppliers:", error);
    return NextResponse.json([], { status: 500 });
  }
}
