import { getInvoices } from "@/lib/db";
import { Badge, Card, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";

export const dynamic = "force-dynamic";

interface Invoice {
  id: string;
  invoice_number: string;
  customer_name: string | null;
  date: string;
  due_date: string;
  status: string;
  total: number;
}

export default function InvoicesPage() {
  const invoices = getInvoices() as Invoice[];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("nb-NO", {
      style: "currency",
      currency: "NOK",
      minimumFractionDigits: 0,
    }).format(amount / 100);
  };

  const isOverdue = (invoice: Invoice) => {
    return invoice.status !== "paid" && new Date(invoice.due_date) < new Date();
  };

  const statusConfig: Record<string, { color: "gray" | "info" | "success" | "failure"; label: string }> = {
    draft: { color: "gray", label: "Utkast" },
    sent: { color: "info", label: "Sendt" },
    paid: { color: "success", label: "Betalt" },
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Fakturaer
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {invoices.length} fakturaer totalt
        </p>
      </div>

      <Card>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeadCell>Faktura</TableHeadCell>
              <TableHeadCell>Kunde</TableHeadCell>
              <TableHeadCell>Dato</TableHeadCell>
              <TableHeadCell>Forfall</TableHeadCell>
              <TableHeadCell>Status</TableHeadCell>
              <TableHeadCell className="text-right">Belop</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody className="divide-y">
            {invoices.map((invoice) => {
              const overdue = isOverdue(invoice);
              return (
                <TableRow
                  key={invoice.id}
                  className={overdue ? "bg-red-50 dark:bg-red-900/20" : "bg-white dark:bg-gray-800"}
                >
                  <TableCell className="font-medium text-gray-900 dark:text-white">
                    #{invoice.invoice_number}
                  </TableCell>
                  <TableCell>{invoice.customer_name || "-"}</TableCell>
                  <TableCell className="text-gray-500">{invoice.date}</TableCell>
                  <TableCell className={overdue ? "text-red-600 font-medium" : "text-gray-500"}>
                    {invoice.due_date}
                  </TableCell>
                  <TableCell>
                    {overdue ? (
                      <Badge color="failure">Forfalt</Badge>
                    ) : (
                      <Badge color={statusConfig[invoice.status]?.color || "gray"}>
                        {statusConfig[invoice.status]?.label || invoice.status}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-medium text-gray-900 dark:text-white">
                    {formatCurrency(invoice.total)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
