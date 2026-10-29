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
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Search, UserRound } from "lucide-react";
import { ClientProjectList } from "@/components/clients/client-project-list";
import { FormField } from "@/components/auth/form-field";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/features/api/client";
import {
  clientFieldsFromForm,
  validateClientForm,
} from "@/features/clients/schema";
import {
  createClient,
  deleteClient,
  getClient,
  listClients,
  updateClient,
} from "@/features/clients/service";
import type {
  Client,
  ClientFieldErrors,
  ClientFormValues,
} from "@/features/clients/types";

function readFormValues(form: HTMLFormElement): ClientFormValues {
  const formData = new FormData(form);
  return {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    company: String(formData.get("company") ?? ""),
  };
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function ClientManagement({
  onClientsChanged,
  initialSelectedClientId,
}: {
  onClientsChanged?: () => void;
  initialSelectedClientId?: string;
}) {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(
    initialSelectedClientId ?? null,
  );
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(
    Boolean(initialSelectedClientId),
  );
  const [listError, setListError] = useState("");
  const [detailsError, setDetailsError] = useState("");
  const [createErrors, setCreateErrors] = useState<ClientFieldErrors>({});
  const [updateErrors, setUpdateErrors] = useState<ClientFieldErrors>({});
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");
  const [updateError, setUpdateError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
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

  const refreshClients = useCallback(async () => {
    setLoading(true);
    setListError("");
    try {
      setClients(await listClients());
    } catch (error) {
      setListError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  }, [handleApiError]);

  const selectClient = useCallback(async (clientId: string) => {
    const requestId = ++detailRequest.current;
    setSelectedId(clientId);
    setSelectedClient(null);
    setDetailsError("");
    setDetailsLoading(true);
    setUpdateError("");
    setUpdateSuccess("");
    try {
      const client = await getClient(clientId);
      if (requestId === detailRequest.current) {
        setSelectedClient(client);
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
    listClients()
      .then((result) => {
        if (active) {
          setClients(result);
          setListError("");
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setListError(handleApiError(error));
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });
    return () => {
      active = false;
      detailRequest.current += 1;
    };
  }, [handleApiError]);

  useEffect(() => {
    if (!initialSelectedClientId) {
      return;
    }
    let active = true;
    const requestId = ++detailRequest.current;
    getClient(initialSelectedClientId)
      .then((client) => {
        if (active && requestId === detailRequest.current) {
          setSelectedClient(client);
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
  }, [handleApiError, initialSelectedClientId]);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = readFormValues(form);
    const validationErrors = validateClientForm(values);
    setCreateErrors(validationErrors);
    setCreateError("");
    setCreateSuccess("");
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setCreating(true);
    try {
      const client = await createClient(clientFieldsFromForm(values));
      onClientsChanged?.();
      form.reset();
      setCreateErrors({});
      setCreateSuccess(`${client.name} was added.`);
      setCreateOpen(false);
      await refreshClients();
      await selectClient(client.id);
    } catch (error) {
      setCreateError(handleApiError(error));
    } finally {
      setCreating(false);
    }
  }

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedClient) {
      return;
    }
    const values = readFormValues(event.currentTarget);
    const validationErrors = validateClientForm(values);
    setUpdateErrors(validationErrors);
    setUpdateError("");
    setUpdateSuccess("");
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setUpdating(true);
    try {
      const client = await updateClient(
        selectedClient.id,
        clientFieldsFromForm(values),
      );
      onClientsChanged?.();
      setSelectedClient(client);
      setUpdateErrors({});
      setUpdateSuccess("Client details were saved.");
      setEditOpen(false);
      await refreshClients();
    } catch (error) {
      setUpdateError(handleApiError(error));
    } finally {
      setUpdating(false);
    }
  }

  async function handleDelete() {
    if (
      !selectedClient ||
      !window.confirm(
        `Delete "${selectedClient.name}" and all associated projects and tasks? This cannot be undone.`,
      )
    ) {
      return;
    }

    setDeleting(true);
    setDeleteError("");
    try {
      await deleteClient(selectedClient.id);
      setSelectedClient(null);
      setSelectedId(null);
      setDetailsError("");
      setEditOpen(false);
      onClientsChanged?.();
      await refreshClients();
      router.replace("/clients");
    } catch (error) {
      setDeleteError(handleApiError(error));
    } finally {
      setDeleting(false);
    }
  }

  const filteredClients = clients.filter((client) => {
    const query = search.trim().toLowerCase();
    return !query || [client.name, client.email ?? "", client.company ?? ""].some((value) => value.toLowerCase().includes(query));
  });

  return (
    <section aria-labelledby="clients-heading" className="mt-0">
      <div className="mb-6">
        <p className="cp-eyebrow">Workspace</p>
        <h1
          id="clients-heading"
          className="mt-2 text-3xl font-bold tracking-[-0.045em] text-[#182230] sm:text-4xl"
        >
          Clients
        </h1>
        <p className="mt-1 text-sm leading-6 text-[#667085]">
          Keep your client contact details organized in one place.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <section className="cp-card p-5 sm:p-6">
          <div className="flex items-start gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"><UserRound size={18} /></span><div><h3 className="text-lg font-semibold text-[#182230]">Add a client</h3><p className="mt-1 text-sm text-[#667085]">Keep their details close to the work.</p></div></div>
          <Button type="button" onClick={() => setCreateOpen(true)} className="mt-6">
            + Add client
          </Button>
          <Dialog open={createOpen} title="Add a client" description="Create an owner-scoped client record." onClose={() => setCreateOpen(false)}>
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
              id="new-client-name"
              label="Name"
              error={createErrors.name}
            >
              <Input
                id="new-client-name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Client name"
                aria-invalid={Boolean(createErrors.name)}
                aria-describedby={
                  createErrors.name ? "new-client-name-error" : undefined
                }
              />
            </FormField>
            <FormField
              id="new-client-email"
              label="Email (optional)"
              error={createErrors.email}
            >
              <Input
                id="new-client-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="client@example.com"
                aria-invalid={Boolean(createErrors.email)}
                aria-describedby={
                  createErrors.email ? "new-client-email-error" : undefined
                }
              />
            </FormField>
            <FormField
              id="new-client-company"
              label="Company (optional)"
              error={createErrors.company}
              hint="Up to 255 characters."
            >
              <Input
                id="new-client-company"
                name="company"
                type="text"
                autoComplete="organization"
                placeholder="Company name"
                aria-invalid={Boolean(createErrors.company)}
                aria-describedby={
                  createErrors.company
                    ? "new-client-company-error"
                    : "new-client-company-hint"
                }
              />
            </FormField>
            <Button loading={creating}>Add client</Button>
          </form>
          </Dialog>
        </section>

        <section className="cp-card p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4"><div><h3 className="text-lg font-semibold text-[#182230]">Your clients</h3><p className="mt-1 text-sm text-[#667085]">{clients.length} {clients.length === 1 ? "client" : "clients"} in your workspace</p></div></div>
          <label className="relative mt-5 block">
            <span className="sr-only">Search clients</span>
            <Search size={17} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#98a2b3]" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, company, or email"
              className="cp-control h-11 w-full bg-[var(--cp-surface-subtle)] pl-10 pr-4 text-sm placeholder:text-[#98a2b3] focus:bg-white"
            />
          </label>
          {loading ? (
            <p role="status" className="mt-5 text-sm text-[#667085]">
              Loading clients…
            </p>
          ) : listError ? (
            <div className="cp-alert-error mt-5 p-4" role="alert">
              <p className="text-sm leading-5 text-[#b42318]">{listError}</p>
              <button
                type="button"
                onClick={() => void refreshClients()}
                className="mt-3 text-sm font-semibold text-[#343a40] transition-colors hover:text-[#212529] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c757d]/40"
              >
                Try again
              </button>
            </div>
          ) : clients.length === 0 ? (
            <p className="cp-empty mt-5 p-4 text-sm leading-6">
              No clients yet. Add your first client using the form.
            </p>
          ) : filteredClients.length === 0 ? (
            <p className="cp-empty mt-5 p-6 text-center text-sm leading-6">No clients match “{search}”.</p>
          ) : (
            <ul className="mt-4 divide-y divide-[#eaecf0]">
              {filteredClients.map((client) => (
                <li key={client.id}>
                  <Link
                    href={`/clients/${client.id}`}
                    aria-current={selectedId === client.id ? "true" : undefined}
                    className={`block w-full rounded-lg px-3 py-3 text-left transition hover:bg-[#f7f8fc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5969e8] ${
                      selectedId === client.id ? "bg-[#f2f4ff]" : ""
                    }`}
                  >
                    <span className="block font-medium text-[#182230]">
                      {client.name}
                    </span>
                    <span className="mt-1 block text-sm text-[#667085]">
                      {client.company ?? client.email ?? "No contact details"}
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
          aria-labelledby="client-details-heading"
          className="cp-card mt-5 p-5 sm:p-6"
        >
          <h3
            id="client-details-heading"
            className="text-lg font-semibold text-[#182230]"
          >
            Client details
          </h3>
          {detailsLoading ? (
            <p role="status" className="mt-4 text-sm text-[#667085]">
              Loading client details…
            </p>
          ) : detailsError ? (
            <p role="alert" className="cp-alert-error mt-4 px-4 py-3 text-sm">
              {detailsError}
            </p>
          ) : selectedClient ? (
            <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)]">
              {deleteError ? (
                <p role="alert" className="cp-alert-error px-4 py-3 text-sm lg:col-span-2">
                  {deleteError}
                </p>
              ) : null}
              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="font-medium text-[#667085]">Created</dt>
                  <dd className="mt-1 text-[#182230]">
                    {formatDate(selectedClient.created_at)}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-[#667085]">Last updated</dt>
                  <dd className="mt-1 text-[#182230]">
                    {formatDate(selectedClient.updated_at)}
                  </dd>
                </div>
              </dl>

              <div>
                <div className="flex items-center justify-between gap-3"><div><h4 className="font-semibold text-[#182230]">{selectedClient.name}</h4><p className="mt-1 text-sm text-[#667085]">{selectedClient.company ?? selectedClient.email ?? "No contact details"}</p></div><div className="flex gap-2"><button type="button" onClick={handleDelete} disabled={deleting} className="min-h-10 rounded-xl border border-[#c6cbd1] bg-white px-4 text-sm font-semibold text-[#343a40] transition hover:border-[#6c757d] hover:bg-[#f3f4f5] hover:text-[#212529] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6c757d]/25 disabled:opacity-60">{deleting ? "Deleting…" : "Delete"}</button><button type="button" onClick={() => setEditOpen(true)} className="min-h-10 rounded-xl border border-[#c6cbd1] bg-white px-4 text-sm font-semibold text-[#343a40] transition hover:border-[#6c757d] hover:bg-[#f3f4f5] hover:text-[#212529] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6c757d]/25">Edit</button></div></div>
                <Dialog open={editOpen} title="Edit client" description="Update this client's details." onClose={() => setEditOpen(false)}>
                <form
                  key={`${selectedClient.id}-${selectedClient.updated_at}`}
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
                  id="edit-client-name"
                  label="Name"
                  error={updateErrors.name}
                >
                  <Input
                    id="edit-client-name"
                    name="name"
                    type="text"
                    defaultValue={selectedClient.name}
                    aria-invalid={Boolean(updateErrors.name)}
                    aria-describedby={
                      updateErrors.name ? "edit-client-name-error" : undefined
                    }
                  />
                </FormField>
                <FormField
                  id="edit-client-email"
                  label="Email"
                  error={updateErrors.email}
                  hint="Leave blank to clear the email."
                >
                  <Input
                    id="edit-client-email"
                    name="email"
                    type="email"
                    defaultValue={selectedClient.email ?? ""}
                    aria-invalid={Boolean(updateErrors.email)}
                    aria-describedby={
                      updateErrors.email
                        ? "edit-client-email-error"
                        : "edit-client-email-hint"
                    }
                  />
                </FormField>
                <FormField
                  id="edit-client-company"
                  label="Company"
                  error={updateErrors.company}
                  hint="Leave blank to clear the company."
                >
                  <Input
                    id="edit-client-company"
                    name="company"
                    type="text"
                    defaultValue={selectedClient.company ?? ""}
                    aria-invalid={Boolean(updateErrors.company)}
                    aria-describedby={
                      updateErrors.company
                        ? "edit-client-company-error"
                        : "edit-client-company-hint"
                    }
                  />
                </FormField>
                <Button loading={updating}>Save changes</Button>
                </form>
                </Dialog>
              </div>
            </div>
          ) : null}
        </section>
      ) : null}
      {selectedClient ? (
        <ClientProjectList clientId={selectedClient.id} />
      ) : null}
    </section>
  );
}
