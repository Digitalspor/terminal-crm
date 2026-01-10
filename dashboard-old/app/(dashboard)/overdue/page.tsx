import { getOverdueInvoices } from "@/lib/db";
import { Badge, Card, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import { HiCheckCircle, HiExclamation } from "react-icons/hi";

export const dynamic = "force-dynamic";

interface OverdueInvoice {
  id: string;
  invoice_number: string;
  customer_name: string | null;
  due_date: string;
  total: number;
}

export default function OverduePage() {
  const invoices = getOverdueInvoices() as OverdueInvoice[];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("nb-NO", {
      style: "currency",
      currency: "NOK",
      minimumFractionDigits: 0,
    }).format(amount / 100);
  };

  const totalOverdue = invoices.reduce((sum, inv) => sum + (inv.total || 0), 0);

  const getDaysOverdue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    return Math.floor((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Forfalte fakturaer
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {invoices.length} fakturaer, totalt {formatCurrency(totalOverdue)}
        </p>
      </div>

      {invoices.length > 0 && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
          <HiExclamation className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            <span className="font-medium">Tips:</span> Bruk Claude Code for aa sende purringer:
            <code className="ml-2 rounded bg-yellow-100 px-2 py-1 text-xs dark:bg-yellow-900">
              &quot;Send purring til alle med faktura over 30 dager&quot;
            </code>
          </p>
        </div>
      )}

      {invoices.length === 0 && (
        <Card>
          <div className="py-8 text-center">
            <HiCheckCircle className="mx-auto h-12 w-12 text-green-400" />
            <h3 className="mt-4 text-lg font-medium text-green-900 dark:text-green-300">
              Ingen forfalte fakturaer!
            </h3>
            <p className="mt-2 text-sm text-green-600 dark:text-green-400">
              Alle fakturaer er betalt eller ikke forfalt ennaa.
            </p>
          </div>
        </Card>
      )}

      {invoices.length > 0 && (
        <Card>
          <Table>
            <TableHead className="bg-red-50 dark:bg-red-900/20">
              <TableRow>
                <TableHeadCell className="text-red-700 dark:text-red-400">Faktura</TableHeadCell>
                <TableHeadCell className="text-red-700 dark:text-red-400">Kunde</TableHeadCell>
                <TableHeadCell className="text-red-700 dark:text-red-400">Forfalt</TableHeadCell>
                <TableHeadCell className="text-red-700 dark:text-red-400">Dager</TableHeadCell>
                <TableHeadCell className="text-right text-red-700 dark:text-red-400">Belop</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody className="divide-y">
              {invoices.map((invoice) => {
                const daysOverdue = getDaysOverdue(invoice.due_date);
                return (
                  <TableRow key={invoice.id} className="bg-white hover:bg-red-50 dark:bg-gray-800 dark:hover:bg-red-900/10">
                    <TableCell className="font-medium text-gray-900 dark:text-white">
                      #{invoice.invoice_number}
                    </TableCell>
                    <TableCell>{invoice.customer_name || "-"}</TableCell>
                    <TableCell className="text-red-600">{invoice.due_date}</TableCell>
                    <TableCell>
                      <Badge
                        color={
                          daysOverdue > 60
                            ? "failure"
                            : daysOverdue > 30
                            ? "warning"
                            : "info"
                        }
                      >
                        {daysOverdue} dager
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-bold text-red-600">
                      {formatCurrency(invoice.total)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
