import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import {
  createProject,
  getProject,
  listProjects,
  updateProject,
} from "../src/features/projects/service.ts";

const originalFetch = globalThis.fetch;
const project = {
  id: "a2d032d1-9b19-4fd6-a6c5-668f4564d443",
  client_id: "ae382d74-16f0-4be8-b8a5-79181da81ab1",
  name: "Website refresh",
  status: "planned",
  due_date: "2027-04-15",
  created_at: "2026-10-25T12:00:00Z",
  updated_at: "2026-10-25T12:00:00Z",
};

afterEach(() => {
  globalThis.fetch = originalFetch;
});

test("project list and detail use the authenticated read routes", async () => {
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    const body = url === "/api/projects" ? [project] : project;
    return new Response(JSON.stringify(body), { status: 200 });
  };

  assert.deepEqual(await listProjects(), [project]);
  assert.deepEqual(await getProject(project.id), project);
  assert.deepEqual(
    calls.map(({ url, options }) => [
      url,
      options.method ?? "GET",
      options.credentials,
      options.cache,
    ]),
    [
      ["/api/projects", "GET", "include", "no-store"],
      [`/api/projects/${project.id}`, "GET", "include", "no-store"],
    ],
  );
});

test("project create and update use documented JSON contracts", async () => {
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return new Response(JSON.stringify(project), { status: 200 });
  };
  const fields = {
    client_id: project.client_id,
    name: project.name,
    status: "planned",
    due_date: project.due_date,
  };

  assert.deepEqual(await createProject(fields), project);
  assert.deepEqual(await updateProject(project.id, fields), project);
  assert.deepEqual(
    calls.map(({ url, options }) => [
      url,
      options.method,
      JSON.parse(options.body),
      new Headers(options.headers).get("content-type"),
      options.credentials,
    ]),
    [
      ["/api/projects", "POST", fields, "application/json", "include"],
      [
        `/api/projects/${project.id}`,
        "PATCH",
        fields,
        "application/json",
        "include",
      ],
    ],
  );
});

test("project service surfaces validation and expired-session errors", async () => {
  globalThis.fetch = async () =>
    new Response(
      JSON.stringify({
        detail: [{ msg: "Name must not be blank." }],
      }),
      { status: 422 },
    );
  await assert.rejects(createProject({
    client_id: project.client_id,
    name: "",
    status: "planned",
    due_date: null,
  }), {
    name: "ApiError",
    status: 422,
    message: "Name must not be blank.",
  });

  globalThis.fetch = async () =>
    new Response(JSON.stringify({ detail: "Session expired" }), {
      status: 401,
    });
  await assert.rejects(listProjects(), {
    name: "ApiError",
    status: 401,
    message: "Session expired",
  });
});

test("project service rejects malformed server response shapes", async () => {
  globalThis.fetch = async () =>
    new Response(JSON.stringify({ unexpected: true }), { status: 200 });
  await assert.rejects(getProject(project.id), {
    name: "Error",
    message: "The server returned an invalid project response.",
  });

  globalThis.fetch = async () =>
    new Response(JSON.stringify([{ ...project, status: "archived" }]), {
      status: 200,
    });
  await assert.rejects(listProjects(), {
    name: "Error",
    message: "The server returned an invalid project response.",
  });

  globalThis.fetch = async () =>
    new Response(JSON.stringify({ ...project, due_date: "2027-02-30" }), {
      status: 200,
    });
  await assert.rejects(getProject(project.id), {
    name: "Error",
    message: "The server returned an invalid project response.",
  });
});

test("project create and update results are visible through refreshed list reads", async () => {
  let stored = null;
  globalThis.fetch = async (url, options = {}) => {
    const path = new URL(url, "http://localhost").pathname;
    if (path === "/api/projects" && (options.method ?? "GET") === "GET") {
      return new Response(JSON.stringify(stored ? [stored] : []), { status: 200 });
    }
    if (path === "/api/projects" && options.method === "POST") {
      stored = {
        ...project,
        ...JSON.parse(options.body),
      };
      return new Response(JSON.stringify(stored), { status: 201 });
    }
    if (path === `/api/projects/${project.id}` && options.method === "PATCH") {
      stored = {
        ...stored,
        ...JSON.parse(options.body),
        updated_at: "2026-10-25T12:01:00Z",
      };
      return new Response(JSON.stringify(stored), { status: 200 });
    }
    return new Response(JSON.stringify({ detail: "Not found" }), { status: 404 });
  };

  assert.deepEqual(await listProjects(), []);
  const created = await createProject({
    client_id: project.client_id,
    name: "Created project",
    status: "planned",
    due_date: null,
  });
  assert.deepEqual(await listProjects(), [created]);

  const updated = await updateProject(project.id, {
    client_id: project.client_id,
    name: "Updated project",
    status: "completed",
    due_date: null,
  });

  assert.equal((await listProjects())[0].name, "Updated project");
  assert.equal((await listProjects())[0].updated_at, updated.updated_at);
});
