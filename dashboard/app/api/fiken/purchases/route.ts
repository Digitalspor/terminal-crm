import { NextResponse } from "next/server";

const FIKEN_API_URL = "https://api.fiken.no/api/v2";

interface FikenPurchase {
  purchaseId: number;
  transactionId?: number;
  identifier?: string;
  date: string;
  dueDate?: string;
  kind: string;
  paid: boolean;
  lines: Array<{
    description?: string;
    account?: string;
    vatType?: string;
    netPrice: number;
    vat: number;
  }>;
  supplier?: {
    contactId?: number;
    name?: string;
  };
  currency: string;
  paymentAccount?: string;
  paymentDate?: string;
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

    // Note: Fiken purchases API doesn't support date filtering via query params
    // We need to fetch all and filter server-side

    let allPurchases: FikenPurchase[] = [];
    let page = 0;
    let hasMore = true;

    while (hasMore) {
      params.set("page", page.toString());

      const res = await fetch(
        `${FIKEN_API_URL}/companies/${companySlug}/purchases?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Fiken API error:", res.status, errorText);
        throw new Error(`Fiken API error: ${res.status}`);
      }

      const purchases: FikenPurchase[] = await res.json();
      allPurchases = allPurchases.concat(purchases);

      if (purchases.length < 100) {
        hasMore = false;
      } else {
        page++;
      }
    }

    // Filter by date range (Fiken API doesn't support date params for purchases)
    if (startDate || endDate) {
      allPurchases = allPurchases.filter((purchase) => {
        const purchaseDate = purchase.date;
        if (startDate && purchaseDate < startDate) return false;
        if (endDate && purchaseDate > endDate) return false;
        return true;
      });
    }

    // Map to our expense format
    const expenses = allPurchases.map((purchase) => {
      const lines = purchase.lines || [];
      // Calculate total from netPrice + vat for each line
      const totalAmount = lines.reduce((sum, line) => sum + (line.netPrice || 0) + (line.vat || 0), 0);
      const firstLine = lines[0];

      // Determine category from account code
      let category = "Annet";
      if (firstLine?.account) {
        const accountCode = firstLine.account;
        if (accountCode.startsWith("6")) category = "Driftskostnader";
        if (accountCode.startsWith("64")) category = "Kontorrekvisita";
        if (accountCode.startsWith("65")) category = "Verktøy og utstyr";
        if (accountCode.startsWith("66")) category = "Reparasjoner";
        if (accountCode.startsWith("67")) category = "Revisor/regnskapsfører";
        if (accountCode.startsWith("68")) category = "Kontorkostnader";
        if (accountCode.startsWith("69")) category = "Telefon/internett";
        if (accountCode.startsWith("70")) category = "Reise";
        if (accountCode.startsWith("71")) category = "Markedsføring";
        if (accountCode.startsWith("72")) category = "Honorarer";
        if (accountCode.startsWith("73")) category = "Forsikring";
        if (accountCode.startsWith("74")) category = "Leie";
        if (accountCode.startsWith("75")) category = "Vedlikehold";
        if (accountCode.startsWith("77")) category = "Bank/finanskostnader";
        if (accountCode.startsWith("78")) category = "Avskrivninger";
        if (accountCode.startsWith("80")) category = "Finanskostnader";
      }

      return {
        id: purchase.purchaseId,
        date: purchase.date,
        dueDate: purchase.dueDate,
        description: firstLine?.description || purchase.identifier || `Kjøp #${purchase.purchaseId}`,
        category,
        amount: totalAmount / 100, // Fiken uses cents (øre)
        vendor: purchase.supplier?.name || "Ukjent leverandør",
        paid: purchase.paid,
        kind: purchase.kind,
      };
    });

    // Sort by date descending
    expenses.sort((a, b) => b.date.localeCompare(a.date));

    return NextResponse.json(expenses);
  } catch (error) {
    console.error("Failed to fetch Fiken purchases:", error);
    return NextResponse.json(
      { error: "Kunne ikke hente kostnader fra Fiken" },
      { status: 500 }
    );
  }
}
