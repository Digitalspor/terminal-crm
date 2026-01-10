import { getCustomers } from "@/lib/db";
import { Badge, Card, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface Customer {
  id: string;
  name: string;
  org_nr: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  address_city: string | null;
  invoice_count: number;
  total_revenue: number | null;
}

export default function CustomersPage() {
  const customers = getCustomers() as Customer[];

  const formatCurrency = (amount: number | null) => {
    if (!amount) return "-";
    return new Intl.NumberFormat("nb-NO", {
      style: "currency",
      currency: "NOK",
      minimumFractionDigits: 0,
    }).format(amount / 100);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Kunder
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {customers.length} kunder totalt
        </p>
      </div>

      <Card>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeadCell>Kunde</TableHeadCell>
              <TableHeadCell>Kontakt</TableHeadCell>
              <TableHeadCell>By</TableHeadCell>
              <TableHeadCell className="text-right">Fakturaer</TableHeadCell>
              <TableHeadCell className="text-right">Omsetning</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody className="divide-y">
            {customers.map((customer) => (
              <TableRow key={customer.id} className="bg-white dark:bg-gray-800">
                <TableCell>
                  <Link
                    href={`/customers/${customer.id}`}
                    className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                  >
                    {customer.name}
                  </Link>
                  {customer.org_nr && (
                    <p className="text-sm text-gray-500">{customer.org_nr}</p>
                  )}
                </TableCell>
                <TableCell>
                  <p className="text-gray-900 dark:text-white">
                    {customer.contact_email || "-"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {customer.contact_phone || ""}
                  </p>
                </TableCell>
                <TableCell className="text-gray-500">
                  {customer.address_city || "-"}
                </TableCell>
                <TableCell className="text-right">
                  <Badge color="info">{customer.invoice_count || 0}</Badge>
                </TableCell>
                <TableCell className="text-right font-medium text-gray-900 dark:text-white">
                  {formatCurrency(customer.total_revenue)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
