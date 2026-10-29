import { requestJson, requestNoContent } from "../api/client.ts";
import { isCalendarDate, parseList, parseRecord } from "../api/validation.ts";
import { isProjectStatus } from "./types.ts";
import type { Project, ProjectFields } from "./types";

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

export async function listProjects(): Promise<Project[]> {
  const payload = await requestJson("/api/projects");
  return parseList(payload, "project", isProject);
}

export async function getProject(projectId: string): Promise<Project> {
  const payload = await requestJson(`/api/projects/${encodeURIComponent(projectId)}`);
  return parseRecord(payload, "project", isProject);
}

export async function createProject(fields: ProjectFields): Promise<Project> {
  const payload = await requestJson("/api/projects", {
    method: "POST",
    body: JSON.stringify(fields),
  });
  return parseRecord(payload, "project", isProject);
}

export async function updateProject(
  projectId: string,
  fields: ProjectFields,
): Promise<Project> {
  const payload = await requestJson(`/api/projects/${encodeURIComponent(projectId)}`, {
    method: "PATCH",
    body: JSON.stringify(fields),
  });
  return parseRecord(payload, "project", isProject);
}

export async function deleteProject(projectId: string): Promise<void> {
  await requestNoContent(
    `/api/projects/${encodeURIComponent(projectId)}`,
    { method: "DELETE" },
  );
}
