"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
    <div>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-[#4355d9]">
            Your private workspace
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.035em] text-[#182230] sm:text-4xl">
            Overview
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#667085]">
            A current view of client and project records in your workspace.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/clients"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#d0d5dd] bg-white px-4 text-sm font-semibold text-[#344054] transition hover:bg-[#f9fafb] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#5969e8]/20"
          >
            Add client
          </Link>
          <Link
            href="/projects"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#4355d9] px-4 text-sm font-semibold text-white transition hover:bg-[#3343bc] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#5969e8]/25"
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
            className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
          >
            {[
              {
                label: "Total clients",
                value: summary.totalClients,
                href: "/clients",
                description: "Client records in your workspace",
              },
              {
                label: "Total projects",
                value: summary.totalProjects,
                href: "/projects",
                description: "Projects linked to your clients",
              },
              {
                label: "In progress",
                value: summary.activeProjects,
                href: "/projects",
                description: "Projects currently being worked on",
              },
            ].map((metric) => (
              <Link
                key={metric.label}
                href={metric.href}
                className="rounded-2xl border border-[#eaecf0] bg-white p-5 shadow-[0_8px_28px_rgba(16,24,40,0.03)] transition hover:border-[#c7cdfa] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#5969e8]/20"
              >
                <p className="text-sm font-medium text-[#667085]">
                  {metric.label}
                </p>
                <p className="mt-3 text-3xl font-semibold tracking-tight text-[#182230]">
                  {metric.value}
                </p>
                <p className="mt-1 text-xs text-[#98a2b3]">
                  {metric.description}
                </p>
              </Link>
            ))}
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-[#eaecf0] bg-white p-6">
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

            <div className="rounded-2xl border border-[#eaecf0] bg-white p-6">
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
    </div>
  );
}
