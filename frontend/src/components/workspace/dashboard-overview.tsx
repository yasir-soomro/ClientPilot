"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, BarChart3, BriefcaseBusiness, CalendarClock, CheckCircle2, CircleAlert, ListTodo, Users } from "lucide-react";
import { motion, MotionConfig } from "framer-motion";
import { ApiError } from "@/features/api/client";
import { listClients } from "@/features/clients/service";
import type { Client } from "@/features/clients/types";
import { listProjects } from "@/features/projects/service";
import type { Project } from "@/features/projects/types";
import { listTasks } from "@/features/tasks/service";
import type { Task } from "@/features/tasks/types";
import { summarizeTasks, summarizeWorkspace } from "@/features/dashboard/summary";

function prettyStatus(status: string) { return status.replace("_", " "); }
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
        if (requestError instanceof ApiError && requestError.status === 401) { router.replace("/login"); router.refresh(); return; }
        setError(requestError instanceof Error ? requestError.message : "Unable to load workspace overview.");
      } finally { if (active) setLoading(false); }
    }
    void load();
    return () => { active = false; };
  }, [retry, router]);

  const workspace = summarizeWorkspace(clients, projects);
  const taskSummary = useMemo(() => summarizeTasks(tasks, projects), [projects, tasks]);
  const clientNames = useMemo(() => new Map(clients.map((client) => [client.id, client.name])), [clients]);
  const projectById = useMemo(() => new Map(projects.map((project) => [project.id, project])), [projects]);
  const metrics = [
    { label: "Total clients", value: workspace.totalClients, description: "Owner-scoped client records", href: "/clients", icon: Users, tone: "bg-indigo-50 text-indigo-600" },
    { label: "Active projects", value: workspace.activeProjects, description: "Projects currently in progress", href: "/projects", icon: BriefcaseBusiness, tone: "bg-sky-50 text-sky-600" },
    { label: "Pending tasks", value: taskSummary.pendingTasks, description: "Todo and in-progress tasks", href: "/projects", icon: ListTodo, tone: "bg-emerald-50 text-emerald-600" },
    { label: "Overdue tasks", value: taskSummary.overdueTasks, description: "Incomplete tasks past due", href: "/projects", icon: CircleAlert, tone: "bg-rose-50 text-rose-600" },
  ];

  return <MotionConfig reducedMotion="user"><motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, ease: "easeOut" }}>
    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="cp-eyebrow">Workspace overview</p><h1 className="mt-2 text-3xl font-bold tracking-[-0.045em] text-[#182230] sm:text-[38px]">Good work, organized.</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[#667085]">See the work that is moving, what needs attention, and where every client stands.</p></div><div className="flex flex-wrap gap-3"><Link href="/clients" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#e1e4ec] bg-white px-4 text-sm font-semibold text-[#344054] shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50/40">View clients</Link><Link href="/projects" className="inline-flex min-h-11 items-center justify-center rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700">View projects</Link></div></div>
    {loading ? <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" role="status" aria-label="Loading dashboard">{[1, 2, 3, 4].map((item) => <div key={item} className="cp-card h-36 cp-skeleton" />)}</div> : error ? <div className="mt-8 rounded-2xl border border-rose-200 bg-white p-6" role="alert"><p className="text-sm text-rose-700">{error}</p><button type="button" onClick={() => { setLoading(true); setRetry((value) => value + 1); }} className="mt-3 text-sm font-semibold text-indigo-600 hover:underline">Try again</button></div> : <>
      <section aria-label="Workspace metrics" className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map((metric) => <motion.div key={metric.label} whileHover={{ y: -2 }}><Link href={metric.href} className="block rounded-2xl border border-[#e7e9f0] bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-lg sm:p-6"><div className="flex items-center justify-between"><p className="text-sm font-semibold text-[#667085]">{metric.label}</p><span className={`flex size-10 items-center justify-center rounded-xl ${metric.tone}`}><metric.icon size={19} aria-hidden="true" /></span></div><p className="mt-4 text-[34px] font-bold tracking-[-0.045em] text-[#182230]">{metric.value}</p><p className="mt-1 flex items-center justify-between text-xs text-[#98a2b3]"><span>{metric.description}</span><ArrowUpRight size={15} aria-hidden="true" /></p></Link></motion.div>)}</section>
      <section className="mt-7 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-2xl border border-[#e7e9f0] bg-white p-5 shadow-sm sm:p-6"><div className="flex items-center justify-between"><div><h2 className="font-semibold text-[#182230]">Task status</h2><p className="mt-1 text-sm text-[#667085]">A live breakdown from your projects</p></div><BarChart3 size={19} className="text-indigo-500" aria-hidden="true" /></div>{tasks.length === 0 ? <p className="mt-6 rounded-xl bg-[#f7f8fc] p-4 text-sm leading-6 text-[#667085]">No tasks yet. Open a project to add the first delivery task.</p> : <div className="mt-6 space-y-4">{(["todo", "in_progress", "done"] as const).map((status) => { const count = taskSummary.statusCounts[status]; const percent = Math.round((count / tasks.length) * 100); return <div key={status}><div className="flex justify-between text-sm"><span className="font-medium capitalize text-[#344054]">{prettyStatus(status)}</span><span className="text-[#667085]">{count} <span className="text-xs">({percent}%)</span></span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${status === "done" ? "bg-emerald-500" : status === "in_progress" ? "bg-indigo-500" : "bg-slate-400"}`} style={{ width: `${percent}%` }} /></div></div>; })}</div>}</div>
        <div className="rounded-2xl border border-[#e7e9f0] bg-white p-5 shadow-sm sm:p-6"><div className="flex items-center justify-between"><div><h2 className="font-semibold text-[#182230]">Next up</h2><p className="mt-1 text-sm text-[#667085]">Prioritized incomplete tasks</p></div><CalendarClock size={19} className="text-amber-500" aria-hidden="true" /></div>{taskSummary.upcomingTasks.length === 0 ? <p className="mt-6 rounded-xl bg-[#f7f8fc] p-4 text-sm leading-6 text-[#667085]">No upcoming tasks. Add due dates to keep delivery visible.</p> : <ul className="mt-4 space-y-2">{taskSummary.upcomingTasks.map((task) => <li key={task.id}><Link href={`/projects/${task.project_id}`} className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-indigo-50/60"><span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600"><CheckCircle2 size={16} aria-hidden="true" /></span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-[#344054]">{task.title}</span><span className="mt-0.5 block truncate text-xs text-[#667085]">{clientNames.get(projectById.get(task.project_id)?.client_id ?? "") ?? "Project task"} · Due {dateLabel(task.due_date)}</span></span><ArrowUpRight size={15} className="text-[#98a2b3]" aria-hidden="true" /></Link></li>)}</ul>}</div>
      </section>
      <section className="mt-7 rounded-2xl border border-[#e7e9f0] bg-white p-5 shadow-sm sm:p-6"><div className="flex items-center justify-between"><div><h2 className="font-semibold text-[#182230]">Project progress</h2><p className="mt-1 text-sm text-[#667085]">Completion calculated from each project&apos;s tasks</p></div><Link href="/projects" className="text-sm font-semibold text-indigo-600 hover:underline">View all</Link></div>{projects.length === 0 ? <p className="mt-6 rounded-xl bg-[#f7f8fc] p-4 text-sm text-[#667085]">Create a project to start tracking progress.</p> : <div className="mt-5 grid gap-4 md:grid-cols-2">{taskSummary.projectProgress.slice(0, 6).map(({ project, total, progress }) => <Link href={`/projects/${project.id}`} key={project.id} className="rounded-xl border border-slate-100 p-4 transition hover:border-indigo-200 hover:bg-indigo-50/30"><div className="flex items-center justify-between gap-3"><span className="truncate text-sm font-semibold text-[#344054]">{project.name}</span><span className="shrink-0 text-sm font-semibold text-indigo-600">{progress}%</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-indigo-500" style={{ width: `${progress}%` }} /></div><p className="mt-2 text-xs text-[#667085]">{total} {total === 1 ? "task" : "tasks"} · {prettyStatus(project.status)}</p></Link>)}</div>}</section>
    </>}
  </motion.div></MotionConfig>;
}
