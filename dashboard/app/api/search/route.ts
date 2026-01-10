import { getDb } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get("q");

  if (!q || q.length < 2) {
    return NextResponse.json({ customers: [], invoices: [], projects: [], leads: [] });
  }

  const db = getDb();
  const searchTerm = `%${q}%`;

  // Search customers
  const customers = db.prepare(`
    SELECT id, name, contact_name, contact_email, 'customer' as type
    FROM customers
    WHERE name LIKE ? OR contact_name LIKE ? OR contact_email LIKE ?
    LIMIT 5
  `).all(searchTerm, searchTerm, searchTerm);

  // Search invoices
  const invoices = db.prepare(`
    SELECT i.id, i.invoice_number, c.name as customer_name, i.total, i.status, 'invoice' as type
    FROM invoices i
    LEFT JOIN customers c ON i.customer_id = c.id
    WHERE i.invoice_number LIKE ? OR c.name LIKE ?
    LIMIT 5
  `).all(searchTerm, searchTerm);

  // Search projects
  const projects = db.prepare(`
    SELECT p.id, p.name, c.name as customer_name, p.status, 'project' as type
    FROM projects p
    LEFT JOIN customers c ON p.customer_id = c.id
    WHERE p.name LIKE ? OR c.name LIKE ?
    LIMIT 5
  `).all(searchTerm, searchTerm);

  // Search leads
  const leads = db.prepare(`
    SELECT id, company_name, contact_name, status, 'lead' as type
    FROM leads
    WHERE company_name LIKE ? OR contact_name LIKE ?
    LIMIT 5
  `).all(searchTerm, searchTerm);

  db.close();

  return NextResponse.json({ customers, invoices, projects, leads });
}
