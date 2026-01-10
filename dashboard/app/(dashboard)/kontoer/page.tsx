"use client";

import { Card } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiCreditCard, HiRefresh } from "react-icons/hi";

interface BankAccount {
  bankAccountId: number;
  name: string;
  accountCode?: string;
  bankAccountNumber?: string;
  type: string;
  balance: number;
  reconciledBalance?: number;
  reconciledDate?: string;
  inactive?: boolean;
}

export default function KontoerPage() {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/fiken/accounts");
      if (!res.ok) throw new Error("Kunne ikke hente kontoer");
      const data = await res.json();
      setAccounts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ukjent feil");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  // Use reconciledBalance if balance is 0 (balance from bankBalances endpoint might not be available)
  const getAccountBalance = (acc: BankAccount) => acc.balance || acc.reconciledBalance || 0;
  const totalBalance = accounts.reduce((sum, acc) => sum + getAccountBalance(acc), 0);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500">Henter kontoer fra Fiken...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <div className="py-8 text-center">
            <p className="mb-4 text-red-500">{error}</p>
            <button
              onClick={fetchAccounts}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              <HiRefresh className="h-4 w-4" />
              Prøv igjen
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Kontoer
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Bankkontooversikt fra Fiken
        </p>
      </div>

      {/* Total Balance Card */}
      <Card className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-green-100 p-4 dark:bg-green-900/20">
              <HiCreditCard className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total saldo</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(totalBalance)}
              </p>
            </div>
          </div>
          <button
            onClick={fetchAccounts}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <HiRefresh className="h-4 w-4" />
            Oppdater
          </button>
        </div>
      </Card>

      {/* Account Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {accounts
          .filter((acc) => !acc.inactive)
          .map((account) => {
            const displayBalance = getAccountBalance(account);
            const accountTypeLabel = account.type === "tax_deduction" ? "Skattetrekk" :
              account.type === "credit_card" ? "Kredittkort" :
              account.type === "foreign" ? "Valutakonto" : "Bankkonto";

            return (
              <Card key={account.bankAccountId}>
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {account.name}
                    </h3>
                    <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                      {accountTypeLabel}
                    </span>
                  </div>

                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(displayBalance)}
                  </p>

                  {account.bankAccountNumber && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Kontonr: {account.bankAccountNumber}
                    </p>
                  )}

                  {account.reconciledDate && (
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      Avstemt: {new Date(account.reconciledDate).toLocaleDateString("nb-NO")}
                    </p>
                  )}
                </div>
              </Card>
            );
          })}
      </div>

      {accounts.length === 0 && (
        <Card>
          <div className="py-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              Ingen bankkontoer funnet i Fiken
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("nb-NO", {
    style: "currency",
    currency: "NOK",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
