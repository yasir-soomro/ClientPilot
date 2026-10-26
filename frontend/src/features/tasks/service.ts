import { requestJson } from "../api/client.ts";
import { isTaskStatus } from "./types.ts";
import type { Task, TaskFields, TaskStatus } from "./types";

function isCalendarDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (year < 1) return false;
  const date = new Date(Date.UTC(year, month - 1, day));
  if (year < 100) date.setUTCFullYear(year);
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

function isTask(payload: unknown): payload is Task {
  if (typeof payload !== "object" || payload === null) return false;
  return (
    "id" in payload && typeof payload.id === "string" &&
    "project_id" in payload && typeof payload.project_id === "string" &&
    "title" in payload && typeof payload.title === "string" &&
    "description" in payload && (payload.description === null || typeof payload.description === "string") &&
    "due_date" in payload && (payload.due_date === null || (typeof payload.due_date === "string" && isCalendarDate(payload.due_date))) &&
    "status" in payload && typeof payload.status === "string" && isTaskStatus(payload.status) &&
    "created_at" in payload && typeof payload.created_at === "string" &&
    "updated_at" in payload && typeof payload.updated_at === "string"
  );
}

function parseTask(payload: unknown): Task {
  if (!isTask(payload)) throw new Error("The server returned an invalid task response.");
  return payload;
}

function taskPath(projectId: string): string {
  return `/api/projects/${encodeURIComponent(projectId)}/tasks`;
}

export async function listTasks(projectId: string): Promise<Task[]> {
  const payload = await requestJson(taskPath(projectId));
  if (!Array.isArray(payload)) throw new Error("The server returned an invalid task list.");
  return payload.map(parseTask);
}

export async function getTask(projectId: string, taskId: string): Promise<Task> {
  return parseTask(await requestJson(`${taskPath(projectId)}/${encodeURIComponent(taskId)}`));
}

export async function createTask(projectId: string, fields: TaskFields): Promise<Task> {
  return parseTask(await requestJson(taskPath(projectId), {
    method: "POST",
    body: JSON.stringify(fields),
  }));
}

export async function updateTaskStatus(
  projectId: string,
  taskId: string,
  status: TaskStatus,
): Promise<Task> {
  return parseTask(await requestJson(`${taskPath(projectId)}/${encodeURIComponent(taskId)}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  }));
}
