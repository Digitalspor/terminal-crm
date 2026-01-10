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
  Progress,
  Select,
  TextInput,
  Textarea,
} from "flowbite-react";
import { useEffect, useState } from "react";
import {
  HiClock,
  HiCurrencyDollar,
  HiPlus,
  HiTrash,
  HiUser,
} from "react-icons/hi";
import { ReactSortable } from "react-sortablejs";

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  customer_id: string;
  customer_name: string;
  deadline: string;
  estimated_hours: number;
  spent_hours: number;
  budget: number;
}

interface Customer {
  id: string;
  name: string;
}

interface KanbanColumn {
  id: string;
  title: string;
  color: string;
  projects: Project[];
}

const statusConfig: Record<string, { title: string; color: string }> = {
  "on-hold": { title: "On Hold", color: "gray" },
  "in-progress": { title: "In Progress", color: "blue" },
  completed: { title: "Completed", color: "green" },
};

export default function ProsjekterPage() {
  const [columns, setColumns] = useState<KanbanColumn[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProject, setNewProject] = useState({
    customer_id: "",
    name: "",
    description: "",
    status: "in-progress",
    deadline: "",
    estimated_hours: "",
    budget: "",
  });

  const fetchProjects = () => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((projects: Project[]) => {
        const cols: KanbanColumn[] = Object.entries(statusConfig).map(
          ([status, config]) => ({
            id: status,
            title: config.title,
            color: config.color,
            projects: projects.filter((p) => p.status === status),
          }),
        );
        setColumns(cols);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchProjects();
    fetch("/api/customers")
      .then((res) => res.json())
      .then((data) => setCustomers(data))
      .catch(() => {});
  }, []);

  const handleCreateProject = async () => {
    try {
      await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newProject,
          estimated_hours: newProject.estimated_hours
            ? parseInt(newProject.estimated_hours)
            : null,
          budget: newProject.budget
            ? parseInt(newProject.budget) * 100
            : null,
        }),
      });
      setShowCreateModal(false);
      setNewProject({
        customer_id: "",
        name: "",
        description: "",
        status: "in-progress",
        deadline: "",
        estimated_hours: "",
        budget: "",
      });
      fetchProjects();
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Er du sikker på at du vil slette dette prosjektet?")) return;
    try {
      await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
      fetchProjects();
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  const handleStatusChange = async (projectId: string, newStatus: string) => {
    try {
      await fetch(`/api/projects?id=${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (error) {
      console.error("Failed to update project status:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500">Laster prosjekter...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Prosjekter
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Kanban-oversikt over alle prosjekter
          </p>
        </div>
        <Button color="blue" onClick={() => setShowCreateModal(true)}>
          <HiPlus className="mr-2 h-5 w-5" />
          Nytt prosjekt
        </Button>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-flex min-w-full gap-4 pb-4">
          {columns.map((column) => (
            <div key={column.id} className="w-80 shrink-0">
              <div className="mb-4 flex items-center gap-2">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {column.title}
                </h2>
                <Badge color={column.color}>{column.projects.length}</Badge>
              </div>

              <div className="space-y-4">
                <ReactSortable
                  animation={100}
                  forceFallback
                  group="projects"
                  list={column.projects}
                  setList={(projects) =>
                    setColumns((cols) =>
                      cols.map((col) =>
                        col.id === column.id ? { ...col, projects } : col,
                      ),
                    )
                  }
                  onEnd={(evt) => {
                    const projectId = evt.item.dataset.id;
                    const newStatus = evt.to
                      .closest("[data-column]")
                      ?.getAttribute("data-column");
                    if (projectId && newStatus && evt.from !== evt.to) {
                      handleStatusChange(projectId, newStatus);
                    }
                  }}
                  className="min-h-[200px] space-y-4"
                  data-column={column.id}
                >
                  {column.projects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onDelete={() => handleDeleteProject(project.id)}
                    />
                  ))}
                </ReactSortable>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Project Modal */}
      <Modal show={showCreateModal} onClose={() => setShowCreateModal(false)}>
        <ModalHeader>Nytt prosjekt</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Prosjektnavn *</Label>
              <TextInput
                id="name"
                value={newProject.name}
                onChange={(e) =>
                  setNewProject({ ...newProject, name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="customer_id">Kunde *</Label>
              <Select
                id="customer_id"
                value={newProject.customer_id}
                onChange={(e) =>
                  setNewProject({ ...newProject, customer_id: e.target.value })
                }
                required
              >
                <option value="">Velg kunde</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="description">Beskrivelse</Label>
              <Textarea
                id="description"
                rows={3}
                value={newProject.description}
                onChange={(e) =>
                  setNewProject({ ...newProject, description: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                id="status"
                value={newProject.status}
                onChange={(e) =>
                  setNewProject({ ...newProject, status: e.target.value })
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
              <Label htmlFor="deadline">Frist</Label>
              <TextInput
                id="deadline"
                type="date"
                value={newProject.deadline}
                onChange={(e) =>
                  setNewProject({ ...newProject, deadline: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="estimated_hours">Estimerte timer</Label>
              <TextInput
                id="estimated_hours"
                type="number"
                value={newProject.estimated_hours}
                onChange={(e) =>
                  setNewProject({
                    ...newProject,
                    estimated_hours: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="budget">Budsjett (NOK)</Label>
              <TextInput
                id="budget"
                type="number"
                value={newProject.budget}
                onChange={(e) =>
                  setNewProject({ ...newProject, budget: e.target.value })
                }
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="blue"
            onClick={handleCreateProject}
            disabled={!newProject.name || !newProject.customer_id}
          >
            Opprett prosjekt
          </Button>
          <Button color="gray" onClick={() => setShowCreateModal(false)}>
            Avbryt
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

function ProjectCard({
  project,
  onDelete,
}: {
  project: Project;
  onDelete: () => void;
}) {
  const progress =
    project.estimated_hours > 0
      ? Math.round((project.spent_hours / project.estimated_hours) * 100)
      : 0;

  const daysLeft = project.deadline
    ? Math.ceil(
        (new Date(project.deadline).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24),
      )
    : null;

  return (
    <Card className="cursor-grab group" data-id={project.id}>
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {project.name}
          </h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="rounded p-1 text-gray-400 opacity-0 transition-opacity hover:bg-red-100 hover:text-red-600 group-hover:opacity-100 dark:hover:bg-red-900/20"
          >
            <HiTrash className="h-4 w-4" />
          </button>
        </div>

        {project.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
            {project.description}
          </p>
        )}

        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <HiUser className="h-4 w-4" />
          <span>{project.customer_name}</span>
        </div>

        {project.estimated_hours > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Fremgang</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {project.spent_hours || 0}/{project.estimated_hours}t
              </span>
            </div>
            <Progress
              progress={Math.min(progress, 100)}
              color={progress > 100 ? "red" : "blue"}
              size="sm"
            />
          </div>
        )}

        <div className="flex items-center justify-between">
          {project.budget && (
            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <HiCurrencyDollar className="h-4 w-4" />
              <span>{formatCurrency(project.budget)}</span>
            </div>
          )}

          {daysLeft !== null && (
            <div
              className={`flex items-center gap-1 text-sm ${
                daysLeft < 0
                  ? "text-red-600"
                  : daysLeft < 7
                    ? "text-yellow-600"
                    : "text-gray-500 dark:text-gray-400"
              }`}
            >
              <HiClock className="h-4 w-4" />
              <span>
                {daysLeft < 0
                  ? `${Math.abs(daysLeft)}d forsinket`
                  : `${daysLeft}d igjen`}
              </span>
            </div>
          )}
        </div>
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
