"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type NavigationStartEvent = CustomEvent<string | undefined>;

export function startNavigationProgress(href?: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("clientpilot:navigation-start", { detail: href }),
    );
  }
}

export function NavigationProgress() {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const currentPathname = useRef(pathname);
  const pendingPathname = useRef<string | null>(null);

  useEffect(() => {
    currentPathname.current = pathname;
    if (
      isNavigating &&
      (!pendingPathname.current || pendingPathname.current === pathname)
    ) {
      pendingPathname.current = null;
      setIsNavigating(false);
    }
  }, [isNavigating, pathname]);

  useEffect(() => {
    function beginNavigation(path?: string) {
      pendingPathname.current = path ?? null;
      setIsNavigating(true);
    }

    function handleNavigationStart(event: Event) {
      const { detail } = event as NavigationStartEvent;
      beginNavigation(detail);
    }

    function handleClick(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const link = target.closest<HTMLAnchorElement>("a[href]");
      if (!link || link.target || link.hasAttribute("download")) {
        return;
      }

      const destination = new URL(link.href, window.location.href);
      if (
        destination.origin !== window.location.origin ||
        destination.pathname === currentPathname.current
      ) {
        return;
      }

      beginNavigation(destination.pathname);
    }

    function handlePopState() {
      if (window.location.pathname !== currentPathname.current) {
        beginNavigation(window.location.pathname);
      }
    }

    window.addEventListener("clientpilot:navigation-start", handleNavigationStart);
    window.addEventListener("popstate", handlePopState);
    document.addEventListener("click", handleClick, true);

    return () => {
      window.removeEventListener("clientpilot:navigation-start", handleNavigationStart);
      window.removeEventListener("popstate", handlePopState);
      document.removeEventListener("click", handleClick, true);
    };
  }, []);

  if (!isNavigating) {
    return null;
  }

  return (
    <div
      className="cp-navigation-progress"
      role="progressbar"
      aria-label="Loading page"
      aria-valuetext="Loading next page"
    >
      <span />
    </div>
  );
}
