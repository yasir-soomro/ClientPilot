import assert from "node:assert/strict";
import test from "node:test";
import {
  projectFieldsFromForm,
  validateProjectForm,
} from "../src/features/projects/schema.ts";

test("project form trims names and maps an empty due date to null", () => {
  const values = {
    client_id: "a2d032d1-9b19-4fd6-a6c5-668f4564d443",
    name: "  Website refresh  ",
    status: "planned",
    due_date: "",
  };

  assert.deepEqual(validateProjectForm(values), {});
  assert.deepEqual(projectFieldsFromForm(values), {
    client_id: values.client_id,
    name: "Website refresh",
    status: "planned",
    due_date: null,
  });
});

test("project form accepts exact statuses and valid date-only values", () => {
  const base = {
    client_id: "a2d032d1-9b19-4fd6-a6c5-668f4564d443",
    name: "Project",
    due_date: "2028-02-29",
  };

  for (const status of ["planned", "in_progress", "completed"]) {
    assert.deepEqual(validateProjectForm({ ...base, status }), {});
  }
  assert.equal(
    validateProjectForm({ ...base, due_date: "2027-02-29", status: "planned" })
      .due_date,
    "Enter a valid date in YYYY-MM-DD format.",
  );
});

test("project form rejects missing and invalid client, name, status, and date", () => {
  assert.deepEqual(
    validateProjectForm({
      client_id: "",
      name: " ",
      status: "active",
      due_date: "2027-W01-1",
    }),
    {
      client_id: "Select a client.",
      name: "Enter a project name.",
      status: "Select a valid project status.",
      due_date: "Enter a valid date in YYYY-MM-DD format.",
    },
  );
  assert.equal(
    validateProjectForm({
      client_id: "client-id",
      name: "x".repeat(256),
      status: "planned",
      due_date: "",
    }).name,
    "Project name must be 255 characters or fewer.",
  );
});

test("project name length counts Unicode code points like the backend", () => {
  assert.deepEqual(
    validateProjectForm({
      client_id: "client-id",
      name: "😀".repeat(255),
      status: "planned",
      due_date: "",
    }),
    {},
  );
});
