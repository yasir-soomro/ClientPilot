import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { createTask, getTask, listTasks, updateTaskStatus } from "../src/features/tasks/service.ts";

const originalFetch = globalThis.fetch;
const task = {
  id: "a2d032d1-9b19-4fd6-a6c5-668f4564d443",
  project_id: "ae382d74-16f0-4be8-b8a5-79181da81ab1",
  title: "Build UI", description: null, due_date: null, status: "todo",
  created_at: "2026-10-25T12:00:00Z", updated_at: "2026-10-25T12:00:00Z",
};

afterEach(() => { globalThis.fetch = originalFetch; });

test("task service uses authenticated project-scoped routes and status-only updates", async () => {
  const calls = [];
  globalThis.fetch = async (url, options = {}) => {
    calls.push({ url, options });
    const body = url.endsWith("/tasks") && (options.method ?? "GET") === "GET" ? [task] : task;
    return new Response(JSON.stringify(body), { status: 200 });
  };
  assert.deepEqual(await listTasks(task.project_id), [task]);
  assert.deepEqual(await getTask(task.project_id, task.id), task);
  await createTask(task.project_id, { title: task.title, description: null, due_date: null });
  await updateTaskStatus(task.project_id, task.id, "done");
  assert.deepEqual(calls.map(({ url, options }) => [url, options.method ?? "GET"]), [
    [`/api/projects/${task.project_id}/tasks`, "GET"],
    [`/api/projects/${task.project_id}/tasks/${task.id}`, "GET"],
    [`/api/projects/${task.project_id}/tasks`, "POST"],
    [`/api/projects/${task.project_id}/tasks/${task.id}`, "PATCH"],
  ]);
  assert.deepEqual(JSON.parse(calls[3].options.body), { status: "done" });
  assert.equal(calls[0].options.credentials, "include");
});

test("task service surfaces API failures and rejects malformed responses", async () => {
  globalThis.fetch = async () => new Response(JSON.stringify({ detail: "Task not found" }), { status: 404 });
  await assert.rejects(listTasks(task.project_id), { name: "ApiError", status: 404, message: "Task not found" });
  globalThis.fetch = async () => new Response(JSON.stringify({ ...task, status: "archived" }), { status: 200 });
  await assert.rejects(getTask(task.project_id, task.id), { message: "The server returned an invalid task response." });
});
