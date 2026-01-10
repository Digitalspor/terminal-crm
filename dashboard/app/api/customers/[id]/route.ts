import { getCustomer } from "@/lib/db";
import { NextResponse } from "next/server";

const FIKEN_API_URL = "https://api.fiken.no/api/v2";

interface FikenInvoice {
  invoiceId: number;
  invoiceNumber: number;
  issueDate: string;
  dueDate: string;
  net: number;
  vat: number;
  gross: number;
  customer?: {
    contactId: number;
    name: string;
  };
  sale?: {
    settled: boolean;
    settledDate?: string;
  };
}

async function fetchFikenInvoicesForCustomer(customerName: string): Promise<any[]> {
  const token = process.env.FIKEN_API_TOKEN || process.env.FIKEN_TOKEN;
  const companySlug = process.env.FIKEN_COMPANY_SLUG;

  if (!token || !companySlug) {
    console.log("Fiken not configured, returning empty invoices");
    return [];
  }

  try {
    const params = new URLSearchParams();
    params.set("pageSize", "100");

    let allInvoices: FikenInvoice[] = [];
    let page = 0;
    let hasMore = true;

    while (hasMore) {
      params.set("page", page.toString());

      const res = await fetch(
        `${FIKEN_API_URL}/companies/${companySlug}/invoices?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (!res.ok) {
        console.error("Fiken API error:", res.status);
        return [];
      }

      const invoices: FikenInvoice[] = await res.json();
      allInvoices = allInvoices.concat(invoices);

      if (invoices.length < 100) {
        hasMore = false;
      } else {
        page++;
      }
    }

    // Filter invoices by customer name (case-insensitive comparison)
    const customerInvoices = allInvoices.filter(
      (inv) => inv.customer?.name?.toLowerCase() === customerName.toLowerCase()
    );

    // Map to our format with correct status
    return customerInvoices.map((inv) => ({
      id: inv.invoiceId.toString(),
      invoice_number: inv.invoiceNumber.toString(),
      date: inv.issueDate,
      due_date: inv.dueDate,
      total: inv.gross, // Keep in øre, will be converted in frontend
      vat: inv.vat,
      status: inv.sale?.settled ? "paid" : "sent",
      settled_date: inv.sale?.settledDate || null,
    }));
  } catch (error) {
    console.error("Failed to fetch Fiken invoices:", error);
    return [];
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = getCustomer(id);

  if (!data.customer) {
    return NextResponse.json({ error: "Customer not found" }, { status: 404 });
  }

  // Fetch invoices from Fiken with correct statuses
  const fikenInvoices = await fetchFikenInvoicesForCustomer(data.customer.name);

  // Use Fiken invoices if available, otherwise fall back to local
  const invoices = fikenInvoices.length > 0 ? fikenInvoices : data.invoices;

  return NextResponse.json({
    customer: data.customer,
    invoices,
  });
}
