"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Activity, ArrowUpRight, BriefcaseBusiness, Users } from "lucide-react";
import { motion, MotionConfig } from "framer-motion";
import { ApiError } from "@/features/api/client";
import { listClients } from "@/features/clients/service";
import type { Client } from "@/features/clients/types";
import { listProjects } from "@/features/projects/service";
import type { Project } from "@/features/projects/types";
import { summarizeWorkspace } from "@/features/dashboard/summary";

export function DashboardOverview() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;
    Promise.all([listClients(), listProjects()])
      .then(([clientRecords, projectRecords]) => {
        if (active) {
          setClients(clientRecords);
          setProjects(projectRecords);
        }
      })
      .catch((requestError: unknown) => {
        if (!active) {
          return;
        }
        if (requestError instanceof ApiError && requestError.status === 401) {
          router.replace("/login");
          router.refresh();
          return;
        }
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load workspace overview.",
        );
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [retry, router]);

  const summary = summarizeWorkspace(clients, projects);

  return (
    <MotionConfig reducedMotion="user">
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, ease: "easeOut" }}>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-600">
            Workspace overview
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-[-0.045em] text-[#182230] sm:text-[38px]">
            Good work, organized.
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#667085]">
            Keep a clear view of your clients, active work, and what’s moving forward.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/clients"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#e1e4ec] bg-white px-4 text-sm font-semibold text-[#344054] shadow-sm transition hover:border-[#c7cad5] hover:bg-[#fafbff] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20"
          >
            Add client
          </Link>
          <Link
            href="/projects"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/25"
          >
            New project
          </Link>
        </div>
      </div>

      {loading ? (
        <div
          role="status"
          className="mt-8 rounded-2xl border border-[#eaecf0] bg-white p-6 text-sm text-[#667085]"
        >
          Loading your workspace overview…
        </div>
      ) : error ? (
        <div
          role="alert"
          className="mt-8 rounded-2xl border border-[#fecdca] bg-white p-6"
        >
          <p className="text-sm leading-6 text-[#b42318]">{error}</p>
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              setError("");
              setRetry((attempt) => attempt + 1);
            }}
            className="mt-3 text-sm font-semibold text-[#4355d9] hover:underline"
          >
            Try again
          </button>
        </div>
      ) : (
        <>
          <section
            aria-label="Workspace metrics"
            className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
          >
            {[
              {
                label: "Total clients",
                value: summary.totalClients,
                href: "/clients",
                description: "Client records in your workspace",
                icon: Users,
                tone: "bg-indigo-50 text-indigo-600",
              },
              {
                label: "Total projects",
                value: summary.totalProjects,
                href: "/projects",
                description: "Projects linked to your clients",
                icon: BriefcaseBusiness,
                tone: "bg-sky-50 text-sky-600",
              },
              {
                label: "In progress",
                value: summary.activeProjects,
                href: "/projects",
                description: "Projects currently being worked on",
                icon: Activity,
                tone: "bg-emerald-50 text-emerald-600",
              },
            ].map((metric) => (
              <motion.div key={metric.label} whileHover={{ y: -2 }} transition={{ duration: 0.16 }}>
              <Link
                key={metric.label}
                href={metric.href}
                className="block rounded-2xl border border-[#e7e9f0] bg-white p-5 shadow-[0_2px_8px_rgba(16,24,40,0.025)] transition hover:border-[#c7c9ef] hover:shadow-[0_12px_28px_rgba(16,24,40,0.07)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20 sm:p-6"
              >
                <div className="flex items-center justify-between"><p className="text-sm font-semibold text-[#667085]">{metric.label}</p><span className={`flex size-10 items-center justify-center rounded-xl ${metric.tone}`}><metric.icon aria-hidden="true" size={19} strokeWidth={1.8} /></span></div>
                <p className="mt-4 text-[34px] font-bold tracking-[-0.045em] text-[#182230]">
                  {metric.value}
                </p>
                <p className="mt-1 flex items-center justify-between text-xs text-[#98a2b3]"><span>{metric.description}</span><ArrowUpRight aria-hidden="true" size={15} /></p>
              </Link>
              </motion.div>
            ))}
          </section>

          <section className="mt-7 grid gap-5 lg:grid-cols-2">
            <div className="rounded-2xl border border-[#e7e9f0] bg-white p-5 shadow-[0_2px_8px_rgba(16,24,40,0.025)] sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-[#182230]">Clients</h2>
                  <p className="mt-1 text-sm text-[#667085]">
                    Your most recently added client records
                  </p>
                </div>
                <Link
                  href="/clients"
                  className="text-sm font-semibold text-[#4355d9] hover:underline"
                >
                  View all
                </Link>
              </div>
              {clients.length === 0 ? (
                <p className="mt-5 rounded-xl bg-[#f7f8fc] p-4 text-sm leading-6 text-[#667085]">
                  No clients yet. Add a client to start organizing your
                  workspace.
                </p>
              ) : (
                <ul className="mt-4 divide-y divide-[#eaecf0]">
                  {clients.slice(0, 5).map((client) => (
                    <li key={client.id}>
                      <Link
                        href={`/clients/${client.id}`}
                        className="block rounded-lg px-3 py-3 transition hover:bg-[#f7f8fc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5969e8]"
                      >
                        <span className="block text-sm font-medium text-[#182230]">
                          {client.name}
                        </span>
                        <span className="mt-1 block text-xs text-[#667085]">
                          {client.company ?? client.email ?? "No contact details"}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="rounded-2xl border border-[#e7e9f0] bg-white p-5 shadow-[0_2px_8px_rgba(16,24,40,0.025)] sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-[#182230]">Projects</h2>
                  <p className="mt-1 text-sm text-[#667085]">
                    Projects and their current status
                  </p>
                </div>
                <Link
                  href="/projects"
                  className="text-sm font-semibold text-[#4355d9] hover:underline"
                >
                  View all
                </Link>
              </div>
              {projects.length === 0 ? (
                <p className="mt-5 rounded-xl bg-[#f7f8fc] p-4 text-sm leading-6 text-[#667085]">
                  No projects yet. Create a project linked to one of your
                  clients.
                </p>
              ) : (
                <ul className="mt-4 divide-y divide-[#eaecf0]">
                  {projects.slice(0, 5).map((project) => (
                    <li key={project.id}>
                      <Link
                        href={`/projects/${project.id}`}
                        className="flex items-center justify-between gap-4 rounded-lg px-3 py-3 transition hover:bg-[#f7f8fc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5969e8]"
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium text-[#182230]">
                            {project.name}
                          </span>
                          <span className="mt-1 block text-xs capitalize text-[#667085]">
                            {project.status.replace("_", " ")}
                          </span>
                        </span>
                        <span className="shrink-0 text-xs text-[#667085]">
                          {project.due_date
                            ? `Due ${project.due_date}`
                            : "No due date"}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </>
      )}
    </motion.div>
    </MotionConfig>
  );
}
