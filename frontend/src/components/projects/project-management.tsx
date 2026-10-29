"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { FormField } from "@/components/auth/form-field";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { TaskManagement } from "@/components/tasks/task-management";
import { ApiError } from "@/features/api/client";
import { listClients } from "@/features/clients/service";
import type { Client } from "@/features/clients/types";
import {
  projectFieldsFromForm,
  validateProjectForm,
} from "@/features/projects/schema";
import {
  createProject,
  deleteProject,
  getProject,
  listProjects,
  updateProject,
} from "@/features/projects/service";
import {
  PROJECT_STATUSES,
  type Project,
  type ProjectFieldErrors,
  type ProjectFormValues,
  type ProjectStatus,
} from "@/features/projects/types";

function readFormValues(form: HTMLFormElement): ProjectFormValues {
  const formData = new FormData(form);
  return {
    client_id: String(formData.get("client_id") ?? ""),
    name: String(formData.get("name") ?? ""),
    status: String(formData.get("status") ?? ""),
    due_date: String(formData.get("due_date") ?? ""),
  };
}

function formatTimestamp(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function statusLabel(status: ProjectStatus): string {
  return status.replace("_", " ");
}

export function ProjectManagement({
  clientsRevision,
  initialSelectedProjectId,
}: {
  clientsRevision: number;
  initialSelectedProjectId?: string;
}) {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(
    initialSelectedProjectId ?? null,
  );
  const [loading, setLoading] = useState(true);
  const [clientsLoading, setClientsLoading] = useState(true);
  const [clientsError, setClientsError] = useState("");
  const [listError, setListError] = useState("");
  const [detailsLoading, setDetailsLoading] = useState(
    Boolean(initialSelectedProjectId),
  );
  const [detailsError, setDetailsError] = useState("");
  const [createErrors, setCreateErrors] = useState<ProjectFieldErrors>({});
  const [updateErrors, setUpdateErrors] = useState<ProjectFieldErrors>({});
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");
  const [updateError, setUpdateError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const detailRequest = useRef(0);

  const handleApiError = useCallback(
    (error: unknown): string => {
      if (error instanceof ApiError && error.status === 401) {
        router.replace("/");
        router.refresh();
        return "Your session has expired. Redirecting to sign in.";
      }
      return error instanceof Error
        ? error.message
        : "Unable to complete the request. Please try again.";
    },
    [router],
  );

  const refreshProjects = useCallback(async () => {
    setLoading(true);
    setListError("");
    try {
      setProjects(await listProjects());
    } catch (error) {
      setListError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  }, [handleApiError]);

  const loadClients = useCallback(async () => {
    setClientsLoading(true);
    try {
      setClients(await listClients());
      setClientsError("");
    } catch (error) {
      setClientsError(handleApiError(error));
    } finally {
      setClientsLoading(false);
    }
  }, [handleApiError]);

  const selectProject = useCallback(async (projectId: string) => {
    const requestId = ++detailRequest.current;
    setSelectedId(projectId);
    setSelectedProject(null);
    setDetailsError("");
    setDetailsLoading(true);
    setUpdateError("");
    setUpdateSuccess("");
    try {
      const project = await getProject(projectId);
      if (requestId === detailRequest.current) {
        setSelectedProject(project);
      }
    } catch (error) {
      if (requestId === detailRequest.current) {
        setDetailsError(handleApiError(error));
      }
    } finally {
      if (requestId === detailRequest.current) {
        setDetailsLoading(false);
      }
    }
  }, [handleApiError]);

  useEffect(() => {
    let active = true;
    Promise.allSettled([listProjects(), listClients()]).then(
      ([projectResult, clientResult]) => {
        if (!active) {
          return;
        }
        if (projectResult.status === "fulfilled") {
          setProjects(projectResult.value);
          setListError("");
        } else {
          setListError(handleApiError(projectResult.reason));
        }
        if (clientResult.status === "fulfilled") {
          setClients(clientResult.value);
          setClientsError("");
        } else {
          setClientsError(handleApiError(clientResult.reason));
        }
        setClientsLoading(false);
        setLoading(false);
      },
    );
    return () => {
      active = false;
      detailRequest.current += 1;
    };
  }, [clientsRevision, handleApiError]);

  useEffect(() => {
    if (!initialSelectedProjectId) {
      return;
    }
    let active = true;
    const requestId = ++detailRequest.current;
    getProject(initialSelectedProjectId)
      .then((project) => {
        if (active && requestId === detailRequest.current) {
          setSelectedProject(project);
        }
      })
      .catch((error: unknown) => {
        if (active && requestId === detailRequest.current) {
          setDetailsError(handleApiError(error));
        }
      })
      .finally(() => {
        if (active && requestId === detailRequest.current) {
          setDetailsLoading(false);
        }
      });
    return () => {
      active = false;
      detailRequest.current += 1;
    };
  }, [handleApiError, initialSelectedProjectId]);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = readFormValues(form);
    const validationErrors = validateProjectForm(values);
    setCreateErrors(validationErrors);
    setCreateError("");
    setCreateSuccess("");
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setCreating(true);
    try {
      const project = await createProject(projectFieldsFromForm(values));
      form.reset();
      setCreateErrors({});
      setCreateSuccess(`${project.name} was created.`);
      setCreateOpen(false);
      await refreshProjects();
      await selectProject(project.id);
    } catch (error) {
      setCreateError(handleApiError(error));
    } finally {
      setCreating(false);
    }
  }

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedProject) {
      return;
    }
    const values = readFormValues(event.currentTarget);
    const validationErrors = validateProjectForm(values);
    setUpdateErrors(validationErrors);
    setUpdateError("");
    setUpdateSuccess("");
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setUpdating(true);
    try {
      const project = await updateProject(
        selectedProject.id,
        projectFieldsFromForm(values),
      );
      setSelectedProject(project);
      setUpdateErrors({});
      setUpdateSuccess("Project details were saved.");
      setEditOpen(false);
      await refreshProjects();
    } catch (error) {
      setUpdateError(handleApiError(error));
    } finally {
      setUpdating(false);
    }
  }

  async function handleDelete() {
    if (
      !selectedProject ||
      !window.confirm(
        `Delete "${selectedProject.name}" and all associated tasks? This cannot be undone.`,
      )
    ) {
      return;
    }

    setDeleting(true);
    setDeleteError("");
    try {
      await deleteProject(selectedProject.id);
      setSelectedProject(null);
      setSelectedId(null);
      setDetailsError("");
      setEditOpen(false);
      await refreshProjects();
      router.replace("/projects");
    } catch (error) {
      setDeleteError(handleApiError(error));
    } finally {
      setDeleting(false);
    }
  }

  function clientName(clientId: string): string {
    return clients.find((client) => client.id === clientId)?.name ??
      "Client unavailable";
  }

  return (
    <section aria-labelledby="projects-heading" className="mt-0">
      <div className="mb-6">
        <p className="cp-eyebrow">Workspace</p>
        <h1
          id="projects-heading"
          className="mt-2 text-3xl font-bold tracking-[-0.045em] text-[#182230] sm:text-4xl"
        >
          Projects
        </h1>
        <p className="mt-1 text-sm leading-6 text-[#667085]">
          Organize projects around your clients and track their status.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <section className="cp-card p-5 sm:p-6">
          <h3 className="text-lg font-semibold text-[#182230]">
            Create a project
          </h3>
          {clientsError ? (
            <div className="cp-alert-error mt-4 p-4" role="alert">
              <p className="text-sm leading-5">{clientsError}</p>
              <button
                type="button"
                onClick={() => void loadClients()}
                className="mt-3 text-sm font-semibold text-[#343a40] transition-colors hover:text-[#212529] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c757d]/40"
              >
                Reload clients
              </button>
            </div>
          ) : clientsLoading ? (
            <p role="status" className="mt-4 text-sm text-[#667085]">
              Loading clients…
            </p>
          ) : clients.length === 0 ? (
            <p className="cp-empty mt-4 p-4 text-sm leading-6">
              Add a client before creating a project.{" "}
              <Link
                href="/clients"
                className="font-semibold text-[#4355d9] hover:underline"
              >
                Go to Clients
              </Link>
            </p>
          ) : (
            <>
            <Button type="button" onClick={() => setCreateOpen(true)} className="mt-6">
              + New project
            </Button>
            <Dialog open={createOpen} title="Create a project" description="Link the project to one of your owner-scoped clients." onClose={() => setCreateOpen(false)}>
            <form className="mt-5 space-y-4" onSubmit={handleCreate} noValidate>
              {createError ? (
                <p role="alert" className="cp-alert-error px-4 py-3 text-sm leading-5">
                  {createError}
                </p>
              ) : null}
              {createSuccess ? (
                <p role="status" className="cp-alert-success px-4 py-3 text-sm leading-5">
                  {createSuccess}
                </p>
              ) : null}
              <FormField
                id="new-project-client"
                label="Client"
                error={createErrors.client_id}
              >
                <select
                  id="new-project-client"
                  name="client_id"
                  defaultValue=""
                  aria-invalid={Boolean(createErrors.client_id)}
                  aria-describedby={
                    createErrors.client_id
                      ? "new-project-client-error"
                      : undefined
                  }
                  className="cp-control h-11 w-full px-4 text-sm"
                >
                  <option value="" disabled>
                    Select a client
                  </option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField
                id="new-project-name"
                label="Project name"
                error={createErrors.name}
                hint="Required; up to 255 characters."
              >
                <Input
                  id="new-project-name"
                  name="name"
                  type="text"
                  placeholder="Project name"
                  maxLength={255}
                  aria-invalid={Boolean(createErrors.name)}
                  aria-describedby={
                    createErrors.name
                      ? "new-project-name-error"
                      : "new-project-name-hint"
                  }
                />
              </FormField>
              <FormField
                id="new-project-status"
                label="Status"
                error={createErrors.status}
              >
                <select
                  id="new-project-status"
                  name="status"
                  defaultValue="planned"
                  aria-invalid={Boolean(createErrors.status)}
                  aria-describedby={
                    createErrors.status
                      ? "new-project-status-error"
                      : undefined
                  }
                  className="cp-control h-11 w-full px-4 text-sm capitalize"
                >
                  {PROJECT_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {statusLabel(status)}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField
                id="new-project-due-date"
                label="Due date (optional)"
                error={createErrors.due_date}
                hint="Use a calendar date."
              >
                <Input
                  id="new-project-due-date"
                  name="due_date"
                  type="date"
                  aria-invalid={Boolean(createErrors.due_date)}
                  aria-describedby={
                    createErrors.due_date
                      ? "new-project-due-date-error"
                      : "new-project-due-date-hint"
                  }
                />
              </FormField>
              <Button loading={creating}>Create project</Button>
            </form>
            </Dialog>
            </>
          )}
        </section>

        <section className="cp-card p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
          <div><h3 className="text-lg font-semibold text-[#182230]">Your projects</h3><p className="mt-1 text-sm text-[#667085]">{projects.length} {projects.length === 1 ? "project" : "projects"} in your workspace</p></div>
          </div>
          {loading ? (
            <p role="status" className="mt-5 text-sm text-[#667085]">
              Loading projects…
            </p>
          ) : listError ? (
            <div className="cp-alert-error mt-5 p-4" role="alert">
              <p className="text-sm leading-5 text-[#b42318]">{listError}</p>
              <button
                type="button"
                onClick={() => void refreshProjects()}
                className="mt-3 text-sm font-semibold text-[#343a40] transition-colors hover:text-[#212529] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c757d]/40"
              >
                Try again
              </button>
            </div>
          ) : projects.length === 0 ? (
            <p className="cp-empty mt-5 p-4 text-sm leading-6">
              No projects yet. Create a project for one of your clients.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-[#eaecf0]">
              {projects.map((project) => (
                <li key={project.id}>
                  <Link
                    href={`/projects/${project.id}`}
                    aria-current={
                      selectedId === project.id ? "true" : undefined
                    }
                    className={`block w-full rounded-lg px-3 py-3 text-left transition hover:bg-[#f7f8fc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5969e8] ${
                      selectedId === project.id ? "bg-[#f2f4ff]" : ""
                    }`}
                  >
                    <span className="block font-medium text-[#182230]">
                      {project.name}
                    </span>
                    <span className="mt-1 block text-sm capitalize text-[#667085]">
                      {clientName(project.client_id)} ·{" "}
                      {statusLabel(project.status)}
                      {project.due_date ? ` · Due ${project.due_date}` : ""}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {selectedId ? (
        <section
          aria-labelledby="project-details-heading"
          className="cp-card mt-5 p-5 sm:p-6"
        >
          <h3
            id="project-details-heading"
            className="text-lg font-semibold text-[#182230]"
          >
            Project details
          </h3>
          {detailsLoading ? (
            <p role="status" className="mt-4 text-sm text-[#667085]">
              Loading project details…
            </p>
          ) : detailsError ? (
            <p role="alert" className="cp-alert-error mt-4 px-4 py-3 text-sm">
              {detailsError}
            </p>
          ) : selectedProject ? (
            <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)]">
              {deleteError ? (
                <p role="alert" className="cp-alert-error px-4 py-3 text-sm lg:col-span-2">
                  {deleteError}
                </p>
              ) : null}
              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="font-medium text-[#667085]">Client</dt>
                  <dd className="mt-1 text-[#182230]">
                    <Link
                      href={`/clients/${selectedProject.client_id}`}
                      className="font-medium text-[#4355d9] hover:underline"
                    >
                      {clientName(selectedProject.client_id)}
                    </Link>
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-[#667085]">Created</dt>
                  <dd className="mt-1 text-[#182230]">
                    {formatTimestamp(selectedProject.created_at)}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-[#667085]">Last updated</dt>
                  <dd className="mt-1 text-[#182230]">
                    {formatTimestamp(selectedProject.updated_at)}
                  </dd>
                </div>
              </dl>

              <div className="lg:col-span-1">
                <div className="flex items-center justify-between gap-3"><div><h4 className="font-semibold text-[#182230]">{selectedProject.name}</h4><p className="mt-1 text-sm capitalize text-[#667085]">{statusLabel(selectedProject.status)} · {selectedProject.due_date ? `Due ${selectedProject.due_date}` : "No due date"}</p></div><div className="flex gap-2"><button type="button" onClick={handleDelete} disabled={deleting} className="min-h-10 rounded-xl border border-[#c6cbd1] bg-white px-4 text-sm font-semibold text-[#343a40] transition hover:border-[#6c757d] hover:bg-[#f3f4f5] hover:text-[#212529] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6c757d]/25 disabled:opacity-60">{deleting ? "Deleting…" : "Delete"}</button><button type="button" onClick={() => setEditOpen(true)} className="min-h-10 rounded-xl border border-[#c6cbd1] bg-white px-4 text-sm font-semibold text-[#343a40] transition hover:border-[#6c757d] hover:bg-[#f3f4f5] hover:text-[#212529] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6c757d]/25">Edit</button></div></div>
                <Dialog open={editOpen} title="Edit project" description="Update the project details and delivery status." onClose={() => setEditOpen(false)}>
                <form
                  key={`${selectedProject.id}-${selectedProject.updated_at}`}
                  className="space-y-4"
                  onSubmit={handleUpdate}
                  noValidate
                >
                {updateError ? (
                  <p role="alert" className="cp-alert-error px-4 py-3 text-sm leading-5">
                    {updateError}
                  </p>
                ) : null}
                {updateSuccess ? (
                  <p role="status" className="cp-alert-success px-4 py-3 text-sm leading-5">
                    {updateSuccess}
                  </p>
                ) : null}
                <FormField
                  id="edit-project-client"
                  label="Client"
                  error={updateErrors.client_id}
                >
                  <select
                    id="edit-project-client"
                    name="client_id"
                    defaultValue={selectedProject.client_id}
                    aria-invalid={Boolean(updateErrors.client_id)}
                    aria-describedby={
                      updateErrors.client_id
                        ? "edit-project-client-error"
                        : undefined
                    }
                    className="cp-control h-12 w-full px-4 text-sm"
                  >
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                </FormField>
                <FormField
                  id="edit-project-name"
                  label="Project name"
                  error={updateErrors.name}
                >
                  <Input
                    id="edit-project-name"
                    name="name"
                    type="text"
                    defaultValue={selectedProject.name}
                    maxLength={255}
                    aria-invalid={Boolean(updateErrors.name)}
                    aria-describedby={
                      updateErrors.name ? "edit-project-name-error" : undefined
                    }
                  />
                </FormField>
                <FormField
                  id="edit-project-status"
                  label="Status"
                  error={updateErrors.status}
                >
                  <select
                    id="edit-project-status"
                    name="status"
                    defaultValue={selectedProject.status}
                    aria-invalid={Boolean(updateErrors.status)}
                    aria-describedby={
                      updateErrors.status
                        ? "edit-project-status-error"
                        : undefined
                    }
                    className="cp-control h-12 w-full px-4 text-sm capitalize"
                  >
                    {PROJECT_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {statusLabel(status)}
                      </option>
                    ))}
                  </select>
                </FormField>
                <FormField
                  id="edit-project-due-date"
                  label="Due date"
                  error={updateErrors.due_date}
                  hint="Leave blank to clear the due date."
                >
                  <Input
                    id="edit-project-due-date"
                    name="due_date"
                    type="date"
                    defaultValue={selectedProject.due_date ?? ""}
                    aria-invalid={Boolean(updateErrors.due_date)}
                    aria-describedby={
                      updateErrors.due_date
                        ? "edit-project-due-date-error"
                        : "edit-project-due-date-hint"
                    }
                  />
                </FormField>
                <Button loading={updating}>Save changes</Button>
                </form>
                </Dialog>
              </div>
              <TaskManagement projectId={selectedProject.id} />
            </div>
          ) : null}
        </section>
      ) : null}
    </section>
  );
}
