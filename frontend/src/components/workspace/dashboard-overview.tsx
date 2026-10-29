"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, BarChart3, BriefcaseBusiness, CalendarClock, CheckCircle2, CircleAlert, ListTodo, Users } from "lucide-react";
import { motion, MotionConfig } from "framer-motion";
import { ApiError } from "@/features/api/client";
import { startNavigationProgress } from "@/components/layout/navigation-progress";
import { listClients } from "@/features/clients/service";
import type { Client } from "@/features/clients/types";
import { listProjects } from "@/features/projects/service";
import type { Project } from "@/features/projects/types";
import { listTasks } from "@/features/tasks/service";
import type { Task } from "@/features/tasks/types";
import { summarizeTasks, summarizeWorkspace } from "@/features/dashboard/summary";

function prettyStatus(status: string) { return status === "todo" ? "To do" : status.replace("_", " "); }
function dateLabel(value: string | null) { return value ? new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(new Date(`${value}T00:00:00`)) : "No due date"; }

export function DashboardOverview() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const [clientRecords, projectRecords] = await Promise.all([listClients(), listProjects()]);
        const taskGroups = await Promise.all(projectRecords.map((project) => listTasks(project.id)));
        if (active) { setClients(clientRecords); setProjects(projectRecords); setTasks(taskGroups.flat()); setError(""); }
      } catch (requestError: unknown) {
        if (!active) return;
        if (requestError instanceof ApiError && requestError.status === 401) { startNavigationProgress("/"); router.replace("/"); router.refresh(); return; }
        setError(requestError instanceof Error ? requestError.message : "Unable to load workspace overview.");
      } finally { if (active) setLoading(false); }
    }
    void load();
    return () => { active = false; };
  }, [retry, router]);

  const workspace = summarizeWorkspace(clients, projects);
  const taskSummary = useMemo(() => summarizeTasks(tasks, projects), [projects, tasks]);
  const clientNames = useMemo(() => new Map(clients.map((client) => [client.id, client.name])), [clients]);
  const metrics = [
    { label: "Total clients", value: workspace.totalClients, description: "Owner-scoped client records", href: "/clients", icon: Users },
    { label: "Active projects", value: workspace.activeProjects, description: "Projects currently in progress", href: "/projects", icon: BriefcaseBusiness },
    { label: "Pending tasks", value: taskSummary.pendingTasks, description: "To do and in-progress tasks", href: "/projects", icon: ListTodo },
    { label: "Overdue tasks", value: taskSummary.overdueTasks, description: "Incomplete tasks past due", href: "/projects", icon: CircleAlert },
  ];

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
      >
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="cp-eyebrow !text-[#495057]">Workspace overview</p>
            <h1 className="mt-2 text-3xl font-bold tracking-[-0.045em] text-[#212529] sm:text-[38px]">
              Good work, organized.
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#495057]">
              See the work that is moving, what needs attention, and where every client stands.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Link href="/clients" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#c6cbd1] bg-white px-4 text-sm font-semibold text-[#343a40] shadow-sm transition-colors duration-200 hover:border-[#6c757d] hover:bg-[#f3f4f5] hover:text-[#212529] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6c757d]/25">
              View clients
            </Link>
            <Link href="/projects" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#343a40] bg-[#343a40] px-4 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:border-[#212529] hover:bg-[#212529] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6c757d]/30">
              View projects
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" role="status" aria-label="Loading dashboard">
            {[1, 2, 3, 4].map((item) => <div key={item} className="cp-card cp-skeleton h-36" />)}
          </div>
        ) : error ? (
          <div className="cp-alert-error mt-8 p-6" role="alert">
            <p className="text-sm">{error}</p>
            <button type="button" onClick={() => { setLoading(true); setRetry((value) => value + 1); }} className="mt-3 text-sm font-semibold text-[#343a40] underline underline-offset-4 transition-colors hover:text-[#212529] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c757d]/40">
              Try again
            </button>
          </div>
        ) : (
          <>
            <section aria-label="Workspace metrics" className="mt-7 grid gap-3 sm:mt-9 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
              {metrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.055 }}
                  whileHover={{ y: -2 }}
                >
                  <Link href={metric.href} className="cp-card block min-w-0 p-5 transition duration-200 hover:border-[#adb5bd] hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6c757d]/25 sm:p-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-[#495057]">{metric.label}</p>
                      <span className="flex size-10 items-center justify-center rounded-xl bg-[#f1f3f5] text-[#495057]">
                        <metric.icon size={19} aria-hidden="true" />
                      </span>
                    </div>
                    <p className="mt-4 text-3xl font-bold tabular-nums tracking-[-0.045em] text-[#212529]">{metric.value}</p>
                    <p className="mt-1 flex items-center justify-between gap-2 text-xs leading-5 text-[#6c757d]">
                      <span className="min-w-0">{metric.description}</span>
                      <ArrowUpRight size={15} className="shrink-0" aria-hidden="true" />
                    </p>
                  </Link>
                </motion.div>
              ))}
            </section>

            <div className="mt-5 grid gap-4 sm:mt-7 sm:gap-5 lg:grid-cols-[1.15fr_0.85fr]">
              <section aria-labelledby="task-status-heading" className="cp-card min-w-0 p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 id="task-status-heading" className="font-semibold text-[#212529]">Task status</h2>
                    <p className="mt-1 text-sm text-[#495057]">A live breakdown from your projects</p>
                  </div>
                  <BarChart3 size={19} className="text-[#495057]" aria-hidden="true" />
                </div>
                {tasks.length === 0 ? (
                  <div className="cp-empty mt-6 p-4 text-sm leading-6">
                    No tasks yet. Open a project to add the first delivery task.
                    {" "}<Link href="/projects" className="font-semibold text-[#343a40] underline-offset-4 hover:underline">Browse projects</Link>
                  </div>
                ) : (
                  <div className="mt-6 space-y-5">
                    {(["todo", "in_progress", "done"] as const).map((status) => {
                      const count = taskSummary.statusCounts[status];
                      const percent = Math.round((count / tasks.length) * 100);
                      return (
                        <div key={status}>
                          <div className="flex justify-between gap-3 text-sm">
                            <span className="font-medium capitalize text-[#343a40]">{prettyStatus(status)}</span>
                            <span className="tabular-nums text-[#495057]">{count} <span className="text-xs">({percent}%)</span></span>
                          </div>
                          <div
                            className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"
                            role="progressbar"
                            aria-label={`${prettyStatus(status)} tasks`}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-valuenow={percent}
                          >
                            <div className={`h-full rounded-full transition-[width] duration-500 motion-reduce:transition-none ${status === "done" ? "bg-[#343a40]" : status === "in_progress" ? "bg-[#6c757d]" : "bg-[#adb5bd]"}`} style={{ width: `${percent}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

              <section aria-labelledby="next-up-heading" className="cp-card min-w-0 p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 id="next-up-heading" className="font-semibold text-[#212529]">Next up</h2>
                    <p className="mt-1 text-sm text-[#495057]">Prioritized incomplete tasks</p>
                  </div>
                  <CalendarClock size={19} className="text-[#495057]" aria-hidden="true" />
                </div>
                {taskSummary.upcomingTasks.length === 0 ? (
                  <p className="cp-empty mt-6 p-4 text-sm leading-6">
                    No upcoming tasks. Add due dates to keep delivery visible.
                  </p>
                ) : (
                  <ul className="mt-4 space-y-1">
                    {taskSummary.upcomingTasks.map((task) => (
                      <li key={task.id}>
                        <Link href={`/projects/${task.project_id}`} className="flex items-center gap-3 rounded-xl p-3 transition-colors duration-200 hover:bg-[#f8f9fa] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6c757d]/25">
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#f1f3f5] text-[#495057]">
                            <CheckCircle2 size={16} aria-hidden="true" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-semibold text-[#343a40]">{task.title}</span>
                            <span className="mt-0.5 block truncate text-xs text-[#495057]">{clientNames.get(taskSummary.projectById.get(task.project_id)?.client_id ?? "") ?? "Project task"} · Due {dateLabel(task.due_date)}</span>
                          </span>
                          <ArrowUpRight size={15} className="shrink-0 text-[#6c757d]" aria-hidden="true" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>

            <section aria-labelledby="project-progress-heading" className="cp-card mt-5 p-5 sm:mt-7 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 id="project-progress-heading" className="font-semibold text-[#212529]">Project progress</h2>
                  <p className="mt-1 text-sm text-[#495057]">Completion calculated from each project&apos;s tasks</p>
                </div>
                <Link href="/projects" className="shrink-0 rounded px-1 text-sm font-semibold text-[#343a40] hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6c757d]/25">
                  View all
                </Link>
              </div>
              {projects.length === 0 ? (
                <p className="cp-empty mt-6 p-4 text-sm leading-6">
                  Create a project to start tracking progress.
                  {" "}<Link href="/projects" className="font-semibold text-[#343a40] underline-offset-4 hover:underline">Create a project</Link>
                </p>
              ) : (
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {taskSummary.projectProgress.slice(0, 6).map(({ project, total, progress }) => (
                    <Link href={`/projects/${project.id}`} key={project.id} className="block min-w-0 rounded-xl border border-[#e9ecef] p-4 transition-colors duration-200 hover:border-[#adb5bd] hover:bg-[#f8f9fa] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6c757d]/25">
                      <div className="flex items-center justify-between gap-3">
                        <span className="min-w-0 truncate text-sm font-semibold text-[#343a40]">{project.name}</span>
                        <span className="shrink-0 tabular-nums text-sm font-semibold text-[#343a40]">{progress}%</span>
                      </div>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#e9ecef]" role="progressbar" aria-label={`${project.name} completion`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
                        <div className="h-full rounded-full bg-[#495057] transition-[width] duration-500 motion-reduce:transition-none" style={{ width: `${progress}%` }} />
                      </div>
                      <p className="mt-2 text-xs text-[#495057]">{total} {total === 1 ? "task" : "tasks"} · {prettyStatus(project.status)}</p>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </motion.div>
    </MotionConfig>
  );
}
