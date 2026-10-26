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
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const detailRequest = useRef(0);

  const handleApiError = useCallback(
    (error: unknown): string => {
      if (error instanceof ApiError && error.status === 401) {
        router.replace("/login");
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
      await refreshProjects();
    } catch (error) {
      setUpdateError(handleApiError(error));
    } finally {
      setUpdating(false);
    }
  }

  function clientName(clientId: string): string {
    return clients.find((client) => client.id === clientId)?.name ??
      "Client unavailable";
  }

  return (
    <section aria-labelledby="projects-heading" className="mt-0">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-600">Workspace</p>
        <h2
          id="projects-heading"
          className="mt-2 text-3xl font-bold tracking-[-0.045em] text-[#182230]"
        >
          Projects
        </h2>
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
            <div className="mt-4" role="alert">
              <p className="text-sm leading-5 text-[#b42318]">{clientsError}</p>
              <button
                type="button"
                onClick={() => void loadClients()}
                className="mt-3 text-sm font-semibold text-[#4355d9] hover:underline"
              >
                Reload clients
              </button>
            </div>
          ) : clientsLoading ? (
            <p role="status" className="mt-4 text-sm text-[#667085]">
              Loading clients…
            </p>
          ) : clients.length === 0 ? (
            <p className="mt-4 rounded-xl bg-[#f7f8fc] p-4 text-sm leading-6 text-[#667085]">
              Add a client before creating a project.{" "}
              <Link
                href="/clients"
                className="font-semibold text-[#4355d9] hover:underline"
              >
                Go to Clients
              </Link>
            </p>
          ) : (
            <form className="mt-5 space-y-4" onSubmit={handleCreate} noValidate>
              {createError ? (
                <p role="alert" className="text-sm leading-5 text-[#b42318]">
                  {createError}
                </p>
              ) : null}
              {createSuccess ? (
                <p role="status" className="text-sm leading-5 text-[#067647]">
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
                  className="h-11 w-full rounded-xl border border-[#dfe2ea] bg-white px-4 text-sm text-[#182230] shadow-[0_1px_2px_rgba(16,24,40,0.03)] outline-none transition hover:border-[#c7cad5] focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
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
                  className="h-11 w-full rounded-xl border border-[#dfe2ea] bg-white px-4 text-sm text-[#182230] shadow-[0_1px_2px_rgba(16,24,40,0.03)] outline-none transition hover:border-[#c7cad5] focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
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
          )}
        </section>

        <section className="cp-card p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-[#182230]">
              Your projects
            </h3>
            <span className="text-sm text-[#667085]">
              {projects.length} {projects.length === 1 ? "project" : "projects"}
            </span>
          </div>
          {loading ? (
            <p role="status" className="mt-5 text-sm text-[#667085]">
              Loading projects…
            </p>
          ) : listError ? (
            <div className="mt-5" role="alert">
              <p className="text-sm leading-5 text-[#b42318]">{listError}</p>
              <button
                type="button"
                onClick={() => void refreshProjects()}
                className="mt-3 text-sm font-semibold text-[#4355d9] hover:underline"
              >
                Try again
              </button>
            </div>
          ) : projects.length === 0 ? (
            <p className="mt-5 rounded-xl bg-[#f7f8fc] p-4 text-sm leading-6 text-[#667085]">
              No projects yet. Create a project for one of your clients.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-[#eaecf0]">
              {projects.map((project) => (
                <li key={project.id}>
                  <button
                    type="button"
                    onClick={() => router.push(`/projects/${project.id}`)}
                    aria-current={
                      selectedId === project.id ? "true" : undefined
                    }
                    className={`w-full rounded-lg px-3 py-3 text-left transition hover:bg-[#f7f8fc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5969e8] ${
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
                  </button>
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
            <p role="alert" className="mt-4 text-sm text-[#b42318]">
              {detailsError}
            </p>
          ) : selectedProject ? (
            <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)]">
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

              <form
                key={`${selectedProject.id}-${selectedProject.updated_at}`}
                className="space-y-4"
                onSubmit={handleUpdate}
                noValidate
              >
                <h4 className="font-semibold text-[#182230]">
                  Update project
                </h4>
                {updateError ? (
                  <p role="alert" className="text-sm leading-5 text-[#b42318]">
                    {updateError}
                  </p>
                ) : null}
                {updateSuccess ? (
                  <p role="status" className="text-sm leading-5 text-[#067647]">
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
                    className="h-12 w-full rounded-xl border border-[#d0d5dd] bg-white px-4 text-[15px] text-[#182230] outline-none transition focus:border-[#5969e8] focus:ring-4 focus:ring-[#5969e8]/10"
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
                    className="h-12 w-full rounded-xl border border-[#d0d5dd] bg-white px-4 text-[15px] text-[#182230] outline-none transition focus:border-[#5969e8] focus:ring-4 focus:ring-[#5969e8]/10"
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
              <TaskManagement projectId={selectedProject.id} />
            </div>
          ) : null}
        </section>
      ) : null}
    </section>
  );
}
