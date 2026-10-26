import assert from "node:assert/strict";
import test from "node:test";
import { taskFieldsFromForm, validateTaskForm } from "../src/features/tasks/schema.ts";

test("task form trims values and clears optional fields to null", () => {
  const values = { title: "  Build UI  ", description: "  Notes  ", due_date: "2028-02-29" };
  assert.deepEqual(validateTaskForm(values), {});
  assert.deepEqual(taskFieldsFromForm(values), {
    title: "Build UI", description: "Notes", due_date: "2028-02-29",
  });
  assert.deepEqual(taskFieldsFromForm({ title: "Task", description: " ", due_date: "" }), {
    title: "Task", description: null, due_date: null,
  });
});

test("task form validates required title, length, description, and calendar date", () => {
  assert.deepEqual(validateTaskForm({ title: " ", description: "", due_date: "2027-02-29" }), {
    title: "Enter a task title.", due_date: "Enter a valid date in YYYY-MM-DD format.",
  });
  assert.equal(validateTaskForm({ title: "x".repeat(256), description: "", due_date: "" }).title,
    "Task title must be 255 characters or fewer.");
  assert.equal(validateTaskForm({ title: "Okay", description: "x".repeat(5001), due_date: "" }).description,
    "Description must be 5000 characters or fewer.");
});
