import { requestJson, requestNoContent } from "../api/client.ts";
import { isCalendarDate, parseList, parseRecord } from "../api/validation.ts";
import { isTaskStatus } from "./types.ts";
import type { Task, TaskFields, TaskStatus } from "./types";

function isTask(payload: unknown): payload is Task {
  if (typeof payload !== "object" || payload === null) {
    return false;
  }

  return (
    "id" in payload &&
    typeof payload.id === "string" &&
    "project_id" in payload &&
    typeof payload.project_id === "string" &&
    "title" in payload &&
    typeof payload.title === "string" &&
    "description" in payload &&
    (payload.description === null || typeof payload.description === "string") &&
    "due_date" in payload &&
    (payload.due_date === null ||
      (typeof payload.due_date === "string" &&
        isCalendarDate(payload.due_date))) &&
    "status" in payload &&
    typeof payload.status === "string" &&
    isTaskStatus(payload.status) &&
    "created_at" in payload &&
    typeof payload.created_at === "string" &&
    "updated_at" in payload &&
    typeof payload.updated_at === "string"
  );
}

function taskPath(projectId: string): string {
  return `/api/projects/${encodeURIComponent(projectId)}/tasks`;
}

export async function listTasks(projectId: string): Promise<Task[]> {
  const payload = await requestJson(taskPath(projectId));
  return parseList(payload, "task", isTask);
}

export async function getTask(projectId: string, taskId: string): Promise<Task> {
  const payload = await requestJson(
    `${taskPath(projectId)}/${encodeURIComponent(taskId)}`,
  );
  return parseRecord(payload, "task", isTask);
}

export async function createTask(
  projectId: string,
  fields: TaskFields,
): Promise<Task> {
  const payload = await requestJson(taskPath(projectId), {
    method: "POST",
    body: JSON.stringify(fields),
  });
  return parseRecord(payload, "task", isTask);
}

export async function updateTaskStatus(
  projectId: string,
  taskId: string,
  status: TaskStatus,
): Promise<Task> {
  const payload = await requestJson(
    `${taskPath(projectId)}/${encodeURIComponent(taskId)}`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    },
  );
  return parseRecord(payload, "task", isTask);
}

export async function deleteTask(
  projectId: string,
  taskId: string,
): Promise<void> {
  await requestNoContent(
    `${taskPath(projectId)}/${encodeURIComponent(taskId)}`,
    { method: "DELETE" },
  );
}
