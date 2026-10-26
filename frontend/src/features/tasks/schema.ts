import type { TaskFieldErrors, TaskFields, TaskFormValues } from "./types";

function isCalendarDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (year < 1) return false;
  const date = new Date(Date.UTC(year, month - 1, day));
  if (year < 100) date.setUTCFullYear(year);
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function validateTaskForm(values: TaskFormValues): TaskFieldErrors {
  const errors: TaskFieldErrors = {};
  const title = values.title.trim();
  const description = values.description.trim();
  if (!title) errors.title = "Enter a task title.";
  else if (Array.from(title).length > 255) {
    errors.title = "Task title must be 255 characters or fewer.";
  }
  if (Array.from(description).length > 5000) {
    errors.description = "Description must be 5000 characters or fewer.";
  }
  if (values.due_date && !isCalendarDate(values.due_date)) {
    errors.due_date = "Enter a valid date in YYYY-MM-DD format.";
  }
  return errors;
}

export function taskFieldsFromForm(values: TaskFormValues): TaskFields {
  return {
    title: values.title.trim(),
    description: values.description.trim() || null,
    due_date: values.due_date || null,
  };
}
