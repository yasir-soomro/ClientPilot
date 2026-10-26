import assert from "node:assert/strict";
import { test } from "node:test";
import { summarizeWorkspace } from "../src/features/dashboard/summary.ts";

const client = {
  id: "client-1",
  name: "Client",
  email: null,
  company: null,
  created_at: "2026-10-25T12:00:00Z",
  updated_at: "2026-10-25T12:00:00Z",
};

function project(id, status) {
  return {
    id,
    client_id: client.id,
    name: `Project ${id}`,
    status,
    due_date: null,
    created_at: "2026-10-25T12:00:00Z",
    updated_at: "2026-10-25T12:00:00Z",
  };
}

test("workspace summary counts API records and only in-progress active projects", () => {
  assert.deepEqual(
    summarizeWorkspace([client], [
      project("planned", "planned"),
      project("active", "in_progress"),
      project("completed", "completed"),
    ]),
    {
      totalClients: 1,
      totalProjects: 3,
      activeProjects: 1,
    },
  );
});
