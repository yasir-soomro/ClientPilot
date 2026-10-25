import { requestJson } from "../api/client.ts";
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

function parseClient(payload: unknown): Client {
  if (!isClient(payload)) {
    throw new Error("The server returned an invalid client response.");
  }
  return payload;
}

export async function listClients(): Promise<Client[]> {
  const payload = await requestJson("/api/clients");
  if (!Array.isArray(payload)) {
    throw new Error("The server returned an invalid client list.");
  }
  return payload.map(parseClient);
}

export async function getClient(clientId: string): Promise<Client> {
  return parseClient(await requestJson(`/api/clients/${clientId}`));
}

export async function createClient(fields: ClientFields): Promise<Client> {
  return parseClient(
    await requestJson("/api/clients", {
      method: "POST",
      body: JSON.stringify(fields),
    }),
  );
}

export async function updateClient(
  clientId: string,
  fields: ClientFields,
): Promise<Client> {
  return parseClient(
    await requestJson(`/api/clients/${clientId}`, {
      method: "PATCH",
      body: JSON.stringify(fields),
    }),
  );
}
