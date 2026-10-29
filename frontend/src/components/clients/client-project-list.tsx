"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ApiError } from "@/features/api/client";
import { startNavigationProgress } from "@/components/layout/navigation-progress";
import { listProjects } from "@/features/projects/service";
import type { Project } from "@/features/projects/types";

export function ClientProjectList({ clientId }: { clientId: string }) {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;
    listProjects()
      .then((allProjects) => {
        if (active) {
          setProjects(
            allProjects.filter((project) => project.client_id === clientId),
          );
        }
      })
      .catch((requestError: unknown) => {
        if (!active) {
          return;
        }
        if (requestError instanceof ApiError && requestError.status === 401) {
          startNavigationProgress("/");
          router.replace("/");
          router.refresh();
          return;
        }
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load this client's projects.",
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
  }, [clientId, retry, router]);

  return (
    <section
      aria-labelledby="client-projects-heading"
      className="cp-card mt-6 p-5 sm:p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <h3
          id="client-projects-heading"
          className="text-lg font-semibold text-[#182230]"
        >
          Client projects
        </h3>
        <Link
          href="/projects"
          className="text-sm font-semibold text-[#4355d9] hover:underline"
        >
          All projects
        </Link>
      </div>
      {loading ? (
        <p role="status" className="mt-4 text-sm text-[#667085]">
          Loading projects…
        </p>
      ) : error ? (
        <div className="cp-alert-error mt-4 p-4" role="alert">
          <p className="text-sm leading-5 text-[#b42318]">{error}</p>
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              setError("");
              setRetry((attempt) => attempt + 1);
            }}
            className="mt-3 text-sm font-semibold text-[#343a40] transition-colors hover:text-[#212529] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c757d]/40"
          >
            Try again
          </button>
        </div>
      ) : projects.length === 0 ? (
        <p className="cp-empty mt-4 p-4 text-sm leading-6">
          No projects are linked to this client yet.
        </p>
      ) : (
        <ul className="mt-3 divide-y divide-[#eaecf0]">
          {projects.map((project) => (
            <li key={project.id}>
              <Link
                href={`/projects/${project.id}`}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg px-3 py-3 transition hover:bg-[#f7f8fc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5969e8]"
              >
                <span className="font-medium text-[#182230]">
                  {project.name}
                </span>
                <span className="text-sm capitalize text-[#667085]">
                  {project.status.replace("_", " ")}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-4 text-xs leading-5 text-[#98a2b3]">
        Open a project to review its delivery tasks and update progress.
      </p>
    </section>
  );
}
