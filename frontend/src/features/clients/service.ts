import { requestJson, requestNoContent } from "../api/client.ts";
import { parseList, parseRecord } from "../api/validation.ts";
import type { Client, ClientFields } from "@/features/clients/types";

function isClient(payload: unknown): payload is Client {
  if (typeof payload !== "object" || payload === null) {
    return false;
  }

  return (
    "id" in payload &&
    typeof payload.id === "string" &&
    "name" in payload &&
    typeof payload.name === "string" &&
    "email" in payload &&
    (typeof payload.email === "string" || payload.email === null) &&
    "company" in payload &&
    (typeof payload.company === "string" || payload.company === null) &&
    "created_at" in payload &&
    typeof payload.created_at === "string" &&
    "updated_at" in payload &&
    typeof payload.updated_at === "string"
  );
}

export async function listClients(): Promise<Client[]> {
  const payload = await requestJson("/api/clients");
  return parseList(payload, "client", isClient);
}

export async function getClient(clientId: string): Promise<Client> {
  const payload = await requestJson(`/api/clients/${clientId}`);
  return parseRecord(payload, "client", isClient);
}

export async function createClient(fields: ClientFields): Promise<Client> {
  const payload = await requestJson("/api/clients", {
    method: "POST",
    body: JSON.stringify(fields),
  });
  return parseRecord(payload, "client", isClient);
}

export async function updateClient(
  clientId: string,
  fields: ClientFields,
): Promise<Client> {
  const payload = await requestJson(`/api/clients/${clientId}`, {
    method: "PATCH",
    body: JSON.stringify(fields),
  });
  return parseRecord(payload, "client", isClient);
}

export async function deleteClient(clientId: string): Promise<void> {
  await requestNoContent(`/api/clients/${encodeURIComponent(clientId)}`, {
    method: "DELETE",
  });
}
