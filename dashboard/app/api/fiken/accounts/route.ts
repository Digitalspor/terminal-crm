import { NextResponse } from "next/server";

const FIKEN_API_URL = "https://api.fiken.no/api/v2";

export async function GET() {
  const token = process.env.FIKEN_API_TOKEN || process.env.FIKEN_TOKEN;
  const companySlug = process.env.FIKEN_COMPANY_SLUG;

  if (!token || !companySlug) {
    return NextResponse.json(
      { error: "Fiken ikke konfigurert" },
      { status: 500 }
    );
  }

  try {
    // Fetch bank accounts
    const accountsRes = await fetch(
      `${FIKEN_API_URL}/companies/${companySlug}/bankAccounts`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    if (!accountsRes.ok) {
      const errorText = await accountsRes.text();
      console.error("Fiken accounts error:", accountsRes.status, errorText);
      throw new Error(`Fiken API error: ${accountsRes.status}`);
    }

    const accounts = await accountsRes.json();

    // Fetch balances - correct endpoint is /bankBalances
    const today = new Date().toISOString().split("T")[0];
    const balancesRes = await fetch(
      `${FIKEN_API_URL}/companies/${companySlug}/bankBalances?date=${today}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    let balances: any[] = [];
    if (balancesRes.ok) {
      balances = await balancesRes.json();
    }

    // Merge accounts with balances
    const accountsWithBalance = accounts.map((account: any) => {
      const balance = balances.find(
        (b: any) => b.bankAccountId === account.bankAccountId
      );
      return {
        ...account,
        // Fiken returns amounts in cents
        balance: balance?.amount ? balance.amount / 100 : 0,
        reconciledBalance: account.reconciledBalance ? account.reconciledBalance / 100 : 0,
      };
    });

    return NextResponse.json(accountsWithBalance);
  } catch (error) {
    console.error("Failed to fetch Fiken accounts:", error);
    return NextResponse.json(
      { error: "Kunne ikke hente kontoer fra Fiken" },
      { status: 500 }
    );
  }
}
