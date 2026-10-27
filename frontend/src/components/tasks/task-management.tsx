"use client";

import { useRouter } from "next/navigation";
import { CalendarDays, CheckCircle2, Circle } from "lucide-react";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { FormField } from "@/components/auth/form-field";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/features/api/client";
import { createTask, listTasks, updateTaskStatus } from "@/features/tasks/service";
import { taskFieldsFromForm, validateTaskForm } from "@/features/tasks/schema";
import { TASK_STATUSES, type Task, type TaskFieldErrors, type TaskStatus } from "@/features/tasks/types";

function statusLabel(status: TaskStatus): string {
  return status.replace("_", " ");
}

export function TaskManagement({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<TaskFieldErrors>({});
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");
  const [creating, setCreating] = useState(false);
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);
  const [statusError, setStatusError] = useState("");
  const [createOpen, setCreateOpen] = useState(false);

  const handleError = useCallback((error: unknown): string => {
    if (error instanceof ApiError && error.status === 401) {
      router.replace("/login");
      router.refresh();
      return "Your session has expired. Redirecting to sign in.";
    }
    return error instanceof Error ? error.message : "Unable to complete the request. Please try again.";
  }, [router]);

  const refreshTasks = useCallback(async () => {
    setLoading(true);
    setListError("");
    try {
      setTasks(await listTasks(projectId));
    } catch (error) {
      setListError(handleError(error));
    } finally {
      setLoading(false);
    }
  }, [handleError, projectId]);

  useEffect(() => {
    let active = true;
    listTasks(projectId)
      .then((result) => {
        if (active) {
          setTasks(result);
          setListError("");
        }
      })
      .catch((error: unknown) => {
        if (active) setListError(handleError(error));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [handleError, projectId]);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const values = {
      title: String(data.get("title") ?? ""),
      description: String(data.get("description") ?? ""),
      due_date: String(data.get("due_date") ?? ""),
    };
    const errors = validateTaskForm(values);
    setFieldErrors(errors);
    setFormError("");
    setSuccess("");
    if (Object.keys(errors).length > 0) return;

    setCreating(true);
    try {
      const task = await createTask(projectId, taskFieldsFromForm(values));
      form.reset();
      setFieldErrors({});
      setSuccess(`${task.title} was created.`);
      setCreateOpen(false);
      await refreshTasks();
    } catch (error) {
      setFormError(handleError(error));
    } finally {
      setCreating(false);
    }
  }

  async function handleStatusChange(task: Task, value: string) {
    if (value === task.status || !TASK_STATUSES.includes(value as TaskStatus)) return;
    setUpdatingTaskId(task.id);
    setStatusError("");
    setSuccess("");
    try {
      const updated = await updateTaskStatus(projectId, task.id, value as TaskStatus);
      setTasks((current) => current.map((item) => item.id === updated.id ? updated : item));
      setSuccess(`${updated.title} is now ${statusLabel(updated.status)}.`);
    } catch (error) {
      setStatusError(handleError(error));
    } finally {
      setUpdatingTaskId(null);
    }
  }

  return (
    <section aria-labelledby="tasks-heading" className="lg:col-span-2">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-indigo-600">Delivery</p><h4 id="tasks-heading" className="mt-1 font-semibold text-[#182230]">Tasks</h4></div>
        <span className="rounded-full bg-[#f3f4f8] px-2.5 py-1 text-xs font-semibold text-[#667085]">{tasks.length} {tasks.length === 1 ? "task" : "tasks"}</span>
      </div>

      <button type="button" onClick={() => setCreateOpen(true)} className="mt-5 inline-flex min-h-10 items-center justify-center rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700">+ Add task</button>
      <Dialog open={createOpen} title="Add a task" description="Add the next actionable step for this project." onClose={() => setCreateOpen(false)}>
      <form className="grid gap-4 rounded-2xl border border-[#e7e9f0] bg-[#fafbfc] p-4 sm:p-5 md:grid-cols-2" onSubmit={handleCreate} noValidate>
        <div className="md:col-span-2">
          <FormField id="new-task-title" label="Task title" error={fieldErrors.title}>
            <Input id="new-task-title" name="title" maxLength={255} placeholder="Task title" aria-invalid={Boolean(fieldErrors.title)} />
          </FormField>
        </div>
        <FormField id="new-task-description" label="Description (optional)" error={fieldErrors.description}>
          <textarea id="new-task-description" name="description" maxLength={5000} rows={3} aria-invalid={Boolean(fieldErrors.description)} className="w-full rounded-xl border border-[#dfe2ea] bg-white px-4 py-3 text-sm text-[#182230] shadow-[0_1px_2px_rgba(16,24,40,0.03)] outline-none transition hover:border-[#c7cad5] focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" />
        </FormField>
        <FormField id="new-task-due-date" label="Due date (optional)" error={fieldErrors.due_date}>
          <Input id="new-task-due-date" name="due_date" type="date" aria-invalid={Boolean(fieldErrors.due_date)} />
        </FormField>
        <div className="md:col-span-2">
          {formError ? <p role="alert" className="mb-3 text-sm text-[#b42318]">{formError}</p> : null}
          {success ? <p role="status" className="mb-3 text-sm text-[#067647]">{success}</p> : null}
          <Button loading={creating} className="md:w-auto">Create task</Button>
        </div>
      </form>
      </Dialog>

      {loading ? (
        <p role="status" className="mt-4 text-sm text-[#667085]">Loading tasks…</p>
      ) : listError ? (
        <div role="alert" className="mt-4">
          <p className="text-sm text-[#b42318]">{listError}</p>
          <button type="button" onClick={() => void refreshTasks()} className="mt-2 text-sm font-semibold text-[#4355d9] hover:underline">Try again</button>
        </div>
      ) : tasks.length === 0 ? (
        <p className="mt-4 rounded-xl bg-[#f7f8fc] p-4 text-sm text-[#667085]">No tasks yet. Add the first task for this project.</p>
      ) : (
        <ul className="mt-4 divide-y divide-[#eaecf0] rounded-xl border border-[#eaecf0] bg-white px-4">
          {[...tasks].sort((a, b) => {
            if (a.status === "done" && b.status !== "done") return 1;
            if (a.status !== "done" && b.status === "done") return -1;
            return (a.due_date ?? "9999-12-31").localeCompare(b.due_date ?? "9999-12-31");
          }).map((task) => (
            <li key={task.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 gap-3">
                <span className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg ${task.status === "done" ? "bg-emerald-50 text-emerald-600" : "bg-indigo-50 text-indigo-600"}`} aria-hidden="true">
                  {task.status === "done" ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                </span>
                <div className="min-w-0"><p className="font-medium text-[#182230]">{task.title}</p>
                {task.description ? <p className="mt-1 whitespace-pre-wrap text-sm leading-5 text-[#667085]">{task.description}</p> : null}
                {task.due_date ? <p className={`mt-2 flex items-center gap-1.5 text-xs ${task.status !== "done" && task.due_date < new Date().toISOString().slice(0, 10) ? "font-semibold text-rose-600" : "text-[#667085]"}`}><CalendarDays aria-hidden="true" size={13} />{task.status !== "done" && task.due_date < new Date().toISOString().slice(0, 10) ? "Overdue" : "Due"} {task.due_date}</p> : null}</div>
              </div>
              <label className="flex shrink-0 items-center gap-2 text-sm text-[#667085]">
                <span className="sr-only">Status for {task.title}</span>
                <select value={task.status} disabled={updatingTaskId === task.id} onChange={(event) => void handleStatusChange(task, event.currentTarget.value)} className="min-h-10 rounded-lg border border-[#dfe2ea] bg-white px-3 py-2 text-sm capitalize text-[#344054] shadow-sm transition hover:border-[#c7cad5] focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 disabled:opacity-60">
                  {TASK_STATUSES.map((status) => <option key={status} value={status}>{statusLabel(status)}</option>)}
                </select>
              </label>
            </li>
          ))}
        </ul>
      )}
      {statusError ? <p role="alert" className="mt-3 text-sm text-[#b42318]">{statusError}</p> : null}
    </section>
  );
}
