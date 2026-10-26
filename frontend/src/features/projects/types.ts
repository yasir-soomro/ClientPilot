export const PROJECT_STATUSES = [
  "planned",
  "in_progress",
  "completed",
] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export function isProjectStatus(value: string): value is ProjectStatus {
  return PROJECT_STATUSES.some((status) => status === value);
}

export type Project = {
  id: string;
  client_id: string;
  name: string;
  status: ProjectStatus;
  due_date: string | null;
  created_at: string;
  updated_at: string;
};

export type ProjectFields = {
  client_id: string;
  name: string;
  status: ProjectStatus;
  due_date: string | null;
};

export type ProjectFormValues = {
  client_id: string;
  name: string;
  status: string;
  due_date: string;
};

export type ProjectFieldErrors = Partial<
  Record<keyof ProjectFormValues, string>
>;
