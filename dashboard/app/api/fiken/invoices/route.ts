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

export async function GET(request: Request) {
  const token = process.env.FIKEN_API_TOKEN || process.env.FIKEN_TOKEN;
  const companySlug = process.env.FIKEN_COMPANY_SLUG;

  if (!token || !companySlug) {
    return NextResponse.json(
      { error: "Fiken ikke konfigurert" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  try {
    const params = new URLSearchParams();
    params.set("pageSize", "100");

    if (startDate) {
      params.set("issueDateFrom", startDate);
    }
    if (endDate) {
      params.set("issueDateTo", endDate);
    }

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
        throw new Error(`Fiken API error: ${res.status}`);
      }

      const invoices: FikenInvoice[] = await res.json();
      allInvoices = allInvoices.concat(invoices);

      if (invoices.length < 100) {
        hasMore = false;
      } else {
        page++;
      }
    }

    // Map to our format with correct status
    const mappedInvoices = allInvoices.map((inv) => ({
      id: inv.invoiceNumber,
      fikenId: inv.invoiceId,
      invoiceNumber: inv.invoiceNumber,
      date: inv.issueDate,
      dueDate: inv.dueDate,
      status: inv.sale?.settled ? "paid" : "sent",
      settledDate: inv.sale?.settledDate || null,
      total: inv.gross / 100, // Fiken uses cents
      customerName: inv.customer?.name || "Ukjent",
    }));

    // Sort by date descending
    mappedInvoices.sort((a, b) => b.date.localeCompare(a.date));

    return NextResponse.json(mappedInvoices);
  } catch (error) {
    console.error("Failed to fetch Fiken invoices:", error);
    return NextResponse.json(
      { error: "Kunne ikke hente fakturaer fra Fiken" },
      { status: 500 }
    );
  }
}
