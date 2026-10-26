export const TASK_STATUSES = ["todo", "in_progress", "done"] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

export function isTaskStatus(value: string): value is TaskStatus {
  return TASK_STATUSES.some((status) => status === value);
}

export type Task = {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
};

export type TaskFields = {
  title: string;
  description: string | null;
  due_date: string | null;
};

export type TaskFormValues = {
  title: string;
  description: string;
  due_date: string;
};

export type TaskFieldErrors = Partial<Record<keyof TaskFormValues, string>>;
