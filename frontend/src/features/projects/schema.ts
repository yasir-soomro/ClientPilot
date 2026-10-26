import { isProjectStatus } from "./types.ts";
import type {
  ProjectFieldErrors,
  ProjectFields,
  ProjectFormValues,
} from "./types";

function characterCount(value: string): number {
  return Array.from(value).length;
}

function isCalendarDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    return false;
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (year < 1) {
    return false;
  }
  const date = new Date(Date.UTC(year, month - 1, day));
  if (year >= 0 && year < 100) {
    date.setUTCFullYear(year);
  }
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function validateProjectForm(
  values: ProjectFormValues,
): ProjectFieldErrors {
  const errors: ProjectFieldErrors = {};
  const name = values.name.trim();

  if (!values.client_id) {
    errors.client_id = "Select a client.";
  }
  if (!name) {
    errors.name = "Enter a project name.";
  } else if (characterCount(name) > 255) {
    errors.name = "Project name must be 255 characters or fewer.";
  }
  if (!isProjectStatus(values.status)) {
    errors.status = "Select a valid project status.";
  }
  if (values.due_date && !isCalendarDate(values.due_date)) {
    errors.due_date = "Enter a valid date in YYYY-MM-DD format.";
  }
  return errors;
}

export function projectFieldsFromForm(
  values: ProjectFormValues,
): ProjectFields {
  if (!isProjectStatus(values.status)) {
    throw new Error("Select a valid project status.");
  }
  return {
    client_id: values.client_id,
    name: values.name.trim(),
    status: values.status,
    due_date: values.due_date || null,
  };
}
