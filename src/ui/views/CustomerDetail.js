import React, { useEffect } from 'react';
import { Box, Text } from 'ink';
import { useCustomers, useInvoices, useProjects, useCRMStore } from '../../store/index.js';
import { Card, CardRow, CardSection } from '../design-system/Card.js';
import { StatusBadge } from '../design-system/Badge.js';
import { HelpText } from '../design-system/HelpText.js';
import { RenderIfWindowSize } from '../design-system/RenderIfWindowSize.js';

/**
 * CustomerDetail - Detailed view of a single customer
 */
export function CustomerDetail() {
  const { selectedCustomer } = useCustomers();
  const { invoices, loadByCustomer: loadInvoices } = useInvoices();
  const { projects, loadByCustomer: loadProjects } = useProjects();
  const goBack = useCRMStore((state) => state.goBack);

  useEffect(() => {
    if (selectedCustomer) {
      loadInvoices(selectedCustomer.id);
      loadProjects(selectedCustomer.id);
    }
  }, [selectedCustomer]);

  if (!selectedCustomer) {
    return (
      <Box padding={1}>
        <Text>Ingen kunde valgt</Text>
      </Box>
    );
  }

  const customer = selectedCustomer;

  // Calculate stats
  const totalInvoices = invoices.length;
  const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
  const paidInvoices = invoices.filter((inv) => inv.status === 'paid').length;
  const overdueInvoices = invoices.filter(
    (inv) => inv.status !== 'paid' && new Date(inv.due_date) < new Date()
  ).length;

  return (
    <Box flexDirection="column" padding={1}>
      {/* Header */}
      <Box marginBottom={2}>
        <Text bold color="cyan">
          {customer.name}
        </Text>
      </Box>

      {/* Two column layout on large screens */}
      <RenderIfWindowSize
        minWidth={100}
        fallback={<SingleColumnLayout customer={customer} invoices={invoices} projects={projects} />}
      >
        <Box>
          {/* Left column */}
          <Box flexDirection="column" width="50%" marginRight={2}>
            <CustomerInfoCard customer={customer} />
            <CustomerStatsCard
              totalInvoices={totalInvoices}
              totalRevenue={totalRevenue}
              paidInvoices={paidInvoices}
              overdueInvoices={overdueInvoices}
            />
          </Box>

          {/* Right column */}
          <Box flexDirection="column" width="50%">
            <RecentInvoicesCard invoices={invoices} />
            <ActiveProjectsCard projects={projects} />
          </Box>
        </Box>
      </RenderIfWindowSize>

      {/* Help text */}
      <HelpText>Esc: Tilbake til kundeliste</HelpText>
    </Box>
  );
}

/**
 * Single column layout for smaller screens
 */
function SingleColumnLayout({ customer, invoices, projects }) {
  const totalInvoices = invoices.length;
  const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
  const paidInvoices = invoices.filter((inv) => inv.status === 'paid').length;
  const overdueInvoices = invoices.filter(
    (inv) => inv.status !== 'paid' && new Date(inv.due_date) < new Date()
  ).length;

  return (
    <Box flexDirection="column">
      <CustomerInfoCard customer={customer} />
      <CustomerStatsCard
        totalInvoices={totalInvoices}
        totalRevenue={totalRevenue}
        paidInvoices={paidInvoices}
        overdueInvoices={overdueInvoices}
      />
      <RecentInvoicesCard invoices={invoices} />
      <ActiveProjectsCard projects={projects} />
    </Box>
  );
}

/**
 * Customer Info Card
 */
function CustomerInfoCard({ customer }) {
  return (
    <Card title="Kontaktinformasjon">
      {customer.contact_name && <CardRow label="Kontakt" value={customer.contact_name} />}
      {customer.contact_email && <CardRow label="E-post" value={customer.contact_email} />}
      {customer.contact_phone && <CardRow label="Telefon" value={customer.contact_phone} />}
      {customer.org_nr && <CardRow label="Org.nr" value={customer.org_nr} />}

      {(customer.address_street || customer.address_city) && (
        <CardSection title="Adresse" marginTop={1}>
          {customer.address_street && <Text dimColor>{customer.address_street}</Text>}
          {customer.address_city && (
            <Text dimColor>
              {customer.address_postal_code} {customer.address_city}
            </Text>
          )}
        </CardSection>
      )}

      {customer.notes && (
        <CardSection title="Notater" marginTop={1}>
          <Text dimColor>{customer.notes}</Text>
        </CardSection>
      )}
    </Card>
  );
}

/**
 * Customer Stats Card
 */
function CustomerStatsCard({ totalInvoices, totalRevenue, paidInvoices, overdueInvoices }) {
  return (
    <Card title="Statistikk">
      <CardRow label="Fakturaer" value={totalInvoices.toString()} />
      <CardRow
        label="Omsetning"
        value={`${(totalRevenue / 100).toLocaleString('nb-NO')} kr`}
        valueColor="green"
      />
      <CardRow label="Betalte" value={paidInvoices.toString()} />
      {overdueInvoices > 0 && (
        <CardRow label="Forfalte" value={overdueInvoices.toString()} valueColor="red" />
      )}
    </Card>
  );
}

/**
 * Recent Invoices Card
 */
function RecentInvoicesCard({ invoices }) {
  const recentInvoices = invoices.slice(0, 5);

  return (
    <Card title="Siste fakturaer">
      {recentInvoices.length === 0 ? (
        <Text dimColor>Ingen fakturaer</Text>
      ) : (
        <Box flexDirection="column">
          {recentInvoices.map((invoice) => (
            <Box key={invoice.id} justifyContent="space-between" marginBottom={0}>
              <Box marginRight={2}>
                <Text>#{invoice.invoice_number}</Text>
              </Box>
              <Box marginRight={2}>
                <StatusBadge status={invoice.status} />
              </Box>
              <Text>{(invoice.total / 100).toLocaleString('nb-NO')} kr</Text>
            </Box>
          ))}
        </Box>
      )}
    </Card>
  );
}

/**
 * Active Projects Card
 */
function ActiveProjectsCard({ projects }) {
  const activeProjects = projects.filter((p) => p.status === 'in-progress');

  return (
    <Card title="Aktive prosjekter">
      {activeProjects.length === 0 ? (
        <Text dimColor>Ingen aktive prosjekter</Text>
      ) : (
        <Box flexDirection="column">
          {activeProjects.map((project) => (
            <Box key={project.id} flexDirection="column" marginBottom={1}>
              <Text bold>{project.name}</Text>
              <Box justifyContent="space-between">
                <Text dimColor>
                  {project.spent_hours || 0}h / {project.estimated_hours || '?'}h
                </Text>
                {project.budget && (
                  <Text dimColor>
                    {(project.budget / 100).toLocaleString('nb-NO')} kr
                  </Text>
                )}
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Card>
  );
}

export default CustomerDetail;
