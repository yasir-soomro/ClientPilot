import { requestJson } from "../api/client.ts";
import { isProjectStatus } from "./types.ts";
import type { Project, ProjectFields } from "./types";

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
  if (year < 100) {
    date.setUTCFullYear(year);
  }
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function isProject(payload: unknown): payload is Project {
  if (typeof payload !== "object" || payload === null) {
    return false;
  }
  return (
    "id" in payload &&
    typeof payload.id === "string" &&
    "client_id" in payload &&
    typeof payload.client_id === "string" &&
    "name" in payload &&
    typeof payload.name === "string" &&
    "status" in payload &&
    typeof payload.status === "string" &&
    isProjectStatus(payload.status) &&
    "due_date" in payload &&
    (payload.due_date === null ||
      (typeof payload.due_date === "string" &&
        isCalendarDate(payload.due_date))) &&
    "created_at" in payload &&
    typeof payload.created_at === "string" &&
    "updated_at" in payload &&
    typeof payload.updated_at === "string"
  );
}

function parseProject(payload: unknown): Project {
  if (!isProject(payload)) {
    throw new Error("The server returned an invalid project response.");
  }
  return payload;
}

export async function listProjects(): Promise<Project[]> {
  const payload = await requestJson("/api/projects");
  if (!Array.isArray(payload)) {
    throw new Error("The server returned an invalid project list.");
  }
  return payload.map(parseProject);
}

export async function getProject(projectId: string): Promise<Project> {
  return parseProject(
    await requestJson(`/api/projects/${encodeURIComponent(projectId)}`),
  );
}

export async function createProject(fields: ProjectFields): Promise<Project> {
  return parseProject(
    await requestJson("/api/projects", {
      method: "POST",
      body: JSON.stringify(fields),
    }),
  );
}

export async function updateProject(
  projectId: string,
  fields: ProjectFields,
): Promise<Project> {
  return parseProject(
    await requestJson(`/api/projects/${encodeURIComponent(projectId)}`, {
      method: "PATCH",
      body: JSON.stringify(fields),
    }),
  );
}
