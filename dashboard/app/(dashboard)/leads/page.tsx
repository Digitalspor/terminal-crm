"use client";

import {
  Badge,
  Button,
  Card,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Select,
  TextInput,
  Textarea,
} from "flowbite-react";
import { useEffect, useState } from "react";
import {
  HiCurrencyDollar,
  HiMail,
  HiPhone,
  HiPlus,
  HiTrash,
  HiPencil,
  HiX,
} from "react-icons/hi";
import { ReactSortable } from "react-sortablejs";

interface Lead {
  id: string;
  company_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  status: string;
  source: string;
  estimated_value: number;
  notes: string;
  created_at?: string;
  updated_at?: string;
}

interface KanbanColumn {
  id: string;
  title: string;
  color: string;
  leads: Lead[];
}

const statusConfig: Record<string, { title: string; color: string }> = {
  new: { title: "Nye", color: "info" },
  contacted: { title: "Kontaktet", color: "purple" },
  qualified: { title: "Kvalifisert", color: "blue" },
  proposal: { title: "Tilbud", color: "yellow" },
  won: { title: "Vunnet", color: "success" },
  lost: { title: "Tapt", color: "failure" },
};

export default function LeadsPage() {
  const [columns, setColumns] = useState<KanbanColumn[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [newLead, setNewLead] = useState({
    company_name: "",
    contact_name: "",
    contact_email: "",
    status: "new",
    source: "",
    estimated_value: "",
    notes: "",
  });

  const fetchLeads = () => {
    fetch("/api/leads")
      .then((res) => res.json())
      .then((leads: Lead[]) => {
        const cols: KanbanColumn[] = Object.entries(statusConfig).map(
          ([status, config]) => ({
            id: status,
            title: config.title,
            color: config.color,
            leads: leads.filter((l) => l.status === status),
          }),
        );
        setColumns(cols);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleCreateLead = async () => {
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newLead,
          estimated_value: newLead.estimated_value
            ? parseInt(newLead.estimated_value) * 100
            : null,
        }),
      });
      setShowCreateModal(false);
      setNewLead({
        company_name: "",
        contact_name: "",
        contact_email: "",
        status: "new",
        source: "",
        estimated_value: "",
        notes: "",
      });
      fetchLeads();
    } catch (error) {
      console.error("Failed to create lead:", error);
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm("Er du sikker på at du vil slette denne leaden?")) return;
    try {
      await fetch(`/api/leads?id=${id}`, { method: "DELETE" });
      setSelectedLead(null);
      fetchLeads();
    } catch (error) {
      console.error("Failed to delete lead:", error);
    }
  };

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    try {
      await fetch(`/api/leads?id=${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (error) {
      console.error("Failed to update lead status:", error);
    }
  };

  const pipelineValue = columns
    .filter((c) => !["won", "lost"].includes(c.id))
    .reduce(
      (sum, col) =>
        sum + col.leads.reduce((s, l) => s + (l.estimated_value || 0), 0),
      0,
    );

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500">Laster leads...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Leads
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Salgspipeline - {columns.reduce((s, c) => s + c.leads.length, 0)}{" "}
            leads
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Pipeline-verdi
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(pipelineValue)}
            </p>
          </div>
          <Button color="blue" onClick={() => setShowCreateModal(true)}>
            <HiPlus className="mr-2 h-5 w-5" />
            Ny lead
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-flex min-w-full gap-4 pb-4">
          {columns.map((column) => (
            <div key={column.id} className="w-72 shrink-0">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {column.title}
                  </h2>
                  <Badge color={column.color}>{column.leads.length}</Badge>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {formatCurrency(
                    column.leads.reduce(
                      (s, l) => s + (l.estimated_value || 0),
                      0,
                    ),
                  )}
                </span>
              </div>

              <div className="space-y-3">
                <ReactSortable
                  animation={100}
                  forceFallback
                  group="leads"
                  list={column.leads}
                  setList={(leads) => {
                    setColumns((cols) =>
                      cols.map((col) =>
                        col.id === column.id ? { ...col, leads } : col,
                      ),
                    );
                  }}
                  onEnd={(evt) => {
                    const leadId = evt.item.dataset.id;
                    const newStatus = evt.to.closest("[data-column]")?.getAttribute("data-column");
                    if (leadId && newStatus && evt.from !== evt.to) {
                      handleStatusChange(leadId, newStatus);
                    }
                  }}
                  className="min-h-[200px] space-y-3"
                  data-column={column.id}
                >
                  {column.leads.map((lead) => (
                    <LeadCard
                      key={lead.id}
                      lead={lead}
                      onClick={() => setSelectedLead(lead)}
                    />
                  ))}
                </ReactSortable>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Lead Modal */}
      <Modal show={showCreateModal} onClose={() => setShowCreateModal(false)}>
        <ModalHeader>Ny lead</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div>
              <Label htmlFor="company_name">Firmanavn *</Label>
              <TextInput
                id="company_name"
                value={newLead.company_name}
                onChange={(e) =>
                  setNewLead({ ...newLead, company_name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="contact_name">Kontaktperson</Label>
              <TextInput
                id="contact_name"
                value={newLead.contact_name}
                onChange={(e) =>
                  setNewLead({ ...newLead, contact_name: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="contact_email">E-post</Label>
              <TextInput
                id="contact_email"
                type="email"
                value={newLead.contact_email}
                onChange={(e) =>
                  setNewLead({ ...newLead, contact_email: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                id="status"
                value={newLead.status}
                onChange={(e) =>
                  setNewLead({ ...newLead, status: e.target.value })
                }
              >
                {Object.entries(statusConfig).map(([value, config]) => (
                  <option key={value} value={value}>
                    {config.title}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="source">Kilde</Label>
              <TextInput
                id="source"
                value={newLead.source}
                onChange={(e) =>
                  setNewLead({ ...newLead, source: e.target.value })
                }
                placeholder="F.eks. LinkedIn, referanse, etc."
              />
            </div>
            <div>
              <Label htmlFor="estimated_value">Estimert verdi (NOK)</Label>
              <TextInput
                id="estimated_value"
                type="number"
                value={newLead.estimated_value}
                onChange={(e) =>
                  setNewLead({ ...newLead, estimated_value: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="notes">Notater</Label>
              <Textarea
                id="notes"
                rows={3}
                value={newLead.notes}
                onChange={(e) =>
                  setNewLead({ ...newLead, notes: e.target.value })
                }
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="blue" onClick={handleCreateLead} disabled={!newLead.company_name}>
            Opprett lead
          </Button>
          <Button color="gray" onClick={() => setShowCreateModal(false)}>
            Avbryt
          </Button>
        </ModalFooter>
      </Modal>

      {/* Lead Detail Modal */}
      <Modal show={!!selectedLead} onClose={() => setSelectedLead(null)} size="lg">
        <ModalHeader>
          <div className="flex items-center gap-3">
            <span>{selectedLead?.company_name}</span>
            {selectedLead?.source && (
              <Badge color="gray" size="sm">
                {selectedLead.source}
              </Badge>
            )}
          </div>
        </ModalHeader>
        <ModalBody>
          {selectedLead && (
            <div className="space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                  <Badge color={statusConfig[selectedLead.status]?.color || "gray"} size="lg">
                    {statusConfig[selectedLead.status]?.title || selectedLead.status}
                  </Badge>
                </div>
                {selectedLead.estimated_value && (
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Estimert verdi</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(selectedLead.estimated_value)}
                    </p>
                  </div>
                )}
              </div>

              {/* Contact Info */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">Kontaktperson</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedLead.contact_name || "-"}
                  </p>
                </div>
                <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">E-post</p>
                  {selectedLead.contact_email ? (
                    <a
                      href={`mailto:${selectedLead.contact_email}`}
                      className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                    >
                      {selectedLead.contact_email}
                    </a>
                  ) : (
                    <p className="font-medium text-gray-900 dark:text-white">-</p>
                  )}
                </div>
                <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">Telefon</p>
                  {selectedLead.contact_phone ? (
                    <a
                      href={`tel:${selectedLead.contact_phone}`}
                      className="font-medium text-gray-900 hover:underline dark:text-white"
                    >
                      {selectedLead.contact_phone}
                    </a>
                  ) : (
                    <p className="font-medium text-gray-900 dark:text-white">-</p>
                  )}
                </div>
                <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">Kilde</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedLead.source || "-"}
                  </p>
                </div>
              </div>

              {/* Notes */}
              <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <p className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">Notater</p>
                {selectedLead.notes ? (
                  <p className="whitespace-pre-wrap text-gray-900 dark:text-white">
                    {selectedLead.notes}
                  </p>
                ) : (
                  <p className="italic text-gray-400">Ingen notater</p>
                )}
              </div>

              {/* Timestamps */}
              <div className="flex gap-4 text-xs text-gray-400">
                {selectedLead.created_at && (
                  <span>Opprettet: {new Date(selectedLead.created_at).toLocaleDateString("nb-NO")}</span>
                )}
                {selectedLead.updated_at && (
                  <span>Oppdatert: {new Date(selectedLead.updated_at).toLocaleDateString("nb-NO")}</span>
                )}
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <div className="flex w-full justify-between">
            <Button
              color="failure"
              onClick={() => selectedLead && handleDeleteLead(selectedLead.id)}
            >
              <HiTrash className="mr-2 h-4 w-4" />
              Slett lead
            </Button>
            <Button color="gray" onClick={() => setSelectedLead(null)}>
              Lukk
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </div>
  );
}

function LeadCard({
  lead,
  onClick,
}: {
  lead: Lead;
  onClick: () => void;
}) {
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      data-id={lead.id}
      onClick={onClick}
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {lead.company_name}
          </h3>
          {lead.source && (
            <Badge color="gray" size="xs">
              {lead.source}
            </Badge>
          )}
        </div>

        {lead.contact_name && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {lead.contact_name}
          </p>
        )}

        {lead.notes && (
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
            {lead.notes}
          </p>
        )}

        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          {lead.contact_email && (
            <div className="flex items-center gap-1">
              <HiMail className="h-3 w-3" />
              <span className="truncate max-w-[100px]">{lead.contact_email}</span>
            </div>
          )}
          {lead.contact_phone && (
            <div className="flex items-center gap-1">
              <HiPhone className="h-3 w-3" />
            </div>
          )}
        </div>

        {lead.estimated_value && (
          <div className="flex items-center gap-1 text-sm font-medium text-green-600 dark:text-green-400">
            <HiCurrencyDollar className="h-4 w-4" />
            <span>{formatCurrency(lead.estimated_value)}</span>
          </div>
        )}
      </div>
    </Card>
  );
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("nb-NO", {
    style: "currency",
    currency: "NOK",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount / 100);
}
