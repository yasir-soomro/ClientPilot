import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import {
  createClient,
  getClient,
  listClients,
  updateClient,
} from "../src/features/clients/service.ts";

const originalFetch = globalThis.fetch;
const client = {
  id: "a2d032d1-9b19-4fd6-a6c5-668f4564d443",
  name: "Ali Khan",
  email: "ali@example.com",
  company: "Ali Clothing",
  created_at: "2026-10-25T12:00:00Z",
  updated_at: "2026-10-25T12:00:00Z",
};

afterEach(() => {
  globalThis.fetch = originalFetch;
});

test("client list and detail use the authenticated read routes", async () => {
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    const body = url === "/api/clients" ? [client] : client;
    return new Response(JSON.stringify(body), { status: 200 });
  };

  assert.deepEqual(await listClients(), [client]);
  assert.deepEqual(await getClient(client.id), client);
  assert.deepEqual(
    calls.map(({ url, options }) => [
      url,
      options.method ?? "GET",
      options.credentials,
      options.cache,
    ]),
    [
      ["/api/clients", "GET", "include", "no-store"],
      [`/api/clients/${client.id}`, "GET", "include", "no-store"],
    ],
  );
});

test("client create and update use the documented JSON contracts", async () => {
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return new Response(JSON.stringify(client), { status: 200 });
  };
  const fields = {
    name: client.name,
    email: null,
    company: client.company,
  };

  assert.deepEqual(await createClient(fields), client);
  assert.deepEqual(await updateClient(client.id, fields), client);
  assert.deepEqual(
    calls.map(({ url, options }) => [
      url,
      options.method,
      JSON.parse(options.body),
      new Headers(options.headers).get("content-type"),
    ]),
    [
      ["/api/clients", "POST", fields, "application/json"],
      [`/api/clients/${client.id}`, "PATCH", fields, "application/json"],
    ],
  );
});

test("client create, list, details, and update flow refreshes persisted data", async () => {
  let stored = null;
  let nextUpdatedAt = 0;
  globalThis.fetch = async (url, options = {}) => {
    const path = new URL(url, "http://localhost").pathname;
    if (path === "/api/clients" && (options.method ?? "GET") === "GET") {
      return new Response(JSON.stringify(stored ? [stored] : []), { status: 200 });
    }
    if (path === "/api/clients" && options.method === "POST") {
      stored = {
        id: client.id,
        ...JSON.parse(options.body),
        created_at: client.created_at,
        updated_at: client.updated_at,
      };
      return new Response(JSON.stringify(stored), { status: 201 });
    }
    if (path === `/api/clients/${client.id}` && (options.method ?? "GET") === "GET") {
      return new Response(JSON.stringify(stored), { status: 200 });
    }
    if (path === `/api/clients/${client.id}` && options.method === "PATCH") {
      stored = {
        ...stored,
        ...JSON.parse(options.body),
        updated_at: `2026-10-25T12:0${++nextUpdatedAt}:00Z`,
      };
      return new Response(JSON.stringify(stored), { status: 200 });
    }
    return new Response(JSON.stringify({ detail: "Not found" }), { status: 404 });
  };

  const created = await createClient({
    name: "First name",
    email: null,
    company: null,
  });
  assert.equal(created.name, "First name");
  assert.deepEqual(await listClients(), [created]);
  assert.deepEqual(await getClient(created.id), created);

  const updated = await updateClient(created.id, {
    name: "Updated name",
    email: "updated@example.com",
    company: "Updated company",
  });
  const refreshedList = await listClients();

  assert.equal(updated.name, "Updated name");
  assert.equal(updated.updated_at > created.updated_at, true);
  assert.deepEqual(refreshedList, [updated]);
});

test("client service surfaces backend validation and expired-session errors", async () => {
  globalThis.fetch = async () =>
    new Response(
      JSON.stringify({
        detail: [{ msg: "Name must not be blank." }],
      }),
      { status: 422 },
    );
  await assert.rejects(createClient({ name: "", email: null, company: null }), {
    name: "ApiError",
    status: 422,
    message: "Name must not be blank.",
  });

  globalThis.fetch = async () =>
    new Response(JSON.stringify({ detail: "Not authenticated" }), {
      status: 401,
    });
  await assert.rejects(listClients(), {
    name: "ApiError",
    status: 401,
    message: "Not authenticated",
  });
});

test("client service rejects malformed backend response shapes", async () => {
  globalThis.fetch = async () =>
    new Response(JSON.stringify({ unexpected: true }), { status: 200 });
  await assert.rejects(getClient(client.id), {
    name: "Error",
    message: "The server returned an invalid client response.",
  });

  globalThis.fetch = async () =>
    new Response(JSON.stringify({ not: "a list" }), { status: 200 });
  await assert.rejects(listClients(), {
    name: "Error",
    message: "The server returned an invalid client list.",
  });
});
