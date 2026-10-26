import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-white text-[#182230]">
      <header className="border-b border-[#eaecf0]">
        <nav
          aria-label="Main navigation"
          className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8"
        >
          <Link href="/" className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-[#171a35] text-sm font-bold text-white">
              CP
            </span>
            <span className="text-lg font-semibold tracking-tight">
              ClientPilot
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-lg px-3 py-2 text-sm font-semibold text-[#475467] transition hover:bg-[#f2f4f7] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#5969e8]/20"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-[#4355d9] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#3343bc] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#5969e8]/25"
            >
              Create account
            </Link>
          </div>
        </nav>
      </header>

      <section className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:py-28">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-[#e4e7ec] bg-[#f9fafb] px-3 py-1.5 text-xs font-semibold text-[#475467]">
            <span className="size-2 rounded-full bg-[#4355d9]" />
            A private workspace for independent work
          </p>
          <h1 className="mt-7 max-w-2xl text-4xl font-semibold leading-[1.08] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
            Keep client work clear, from first note to final delivery.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-[#667085] sm:text-lg">
            Organize client records and the projects connected to them in one
            secure workspace built for freelancers and small agencies.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#4355d9] px-6 text-sm font-semibold text-white shadow-[0_5px_12px_rgba(67,85,217,0.18)] transition hover:bg-[#3343bc] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#5969e8]/25"
            >
              Create your workspace
              <span aria-hidden="true" className="ml-2">→</span>
            </Link>
            <Link
              href="/login"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#d0d5dd] bg-white px-6 text-sm font-semibold text-[#344054] transition hover:bg-[#f9fafb] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#5969e8]/20"
            >
              Sign in
            </Link>
          </div>
          <p className="mt-5 text-xs leading-5 text-[#98a2b3]">
            Your workspace is private to your account. Business clients do not
            need a ClientPilot login.
          </p>
        </div>

        <div
          aria-label="ClientPilot workspace preview"
          className="relative mx-auto w-full max-w-xl rounded-[2rem] border border-[#eaecf0] bg-[#f7f8fc] p-4 shadow-[0_28px_80px_rgba(16,24,40,0.12)] sm:p-6"
        >
          <div className="rounded-2xl border border-[#eaecf0] bg-white p-5 sm:p-7">
            <div className="flex items-center justify-between border-b border-[#eaecf0] pb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#667085]">
                  Your workspace
                </p>
                <p className="mt-1 text-lg font-semibold tracking-tight">
                  Work, organized
                </p>
              </div>
              <span className="flex size-10 items-center justify-center rounded-xl bg-[#eef0ff] text-sm font-bold text-[#4355d9]">
                CP
              </span>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-[#eaecf0] p-4">
                <p className="text-sm font-medium text-[#667085]">Clients</p>
                <p className="mt-5 text-sm font-semibold">Private records</p>
                <p className="mt-1 text-xs text-[#98a2b3]">
                  Contact details in one place
                </p>
              </div>
              <div className="rounded-xl border border-[#eaecf0] p-4">
                <p className="text-sm font-medium text-[#667085]">Projects</p>
                <p className="mt-5 text-sm font-semibold">Linked to clients</p>
                <p className="mt-1 text-xs text-[#98a2b3]">
                  Status and due-date tracking
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-3 rounded-xl bg-[#f7f8fc] p-4">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#4355d9]">
                <svg viewBox="0 0 20 20" fill="none" className="size-5" aria-hidden="true">
                  <path d="M10 2.5 3.5 5.2v4.2c0 4 2.8 6.8 6.5 8.1 3.7-1.3 6.5-4.1 6.5-8.1V5.2L10 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                  <path d="m7.3 9.8 1.8 1.8 3.8-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <p className="text-xs leading-5 text-[#667085]">
                Workspace records are private and protected by your account.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#eaecf0] bg-[#f9fafb]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 md:grid-cols-3">
          {[
            ["01", "Keep client details close", "Create and update the records you need for client relationships."],
            ["02", "Connect projects to clients", "See project ownership and status without losing the client context."],
            ["03", "Work in your own space", "Private account access keeps your workspace separate from other owners."],
          ].map(([number, title, description]) => (
            <article key={number} className="max-w-sm">
              <p className="text-xs font-bold tracking-[0.16em] text-[#4355d9]">{number}</p>
              <h2 className="mt-3 text-base font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-[#667085]">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-7 text-xs text-[#98a2b3] sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <span>ClientPilot · A private workspace for client work</span>
        <span>Designed for freelancers and small agencies</span>
      </footer>
    </main>
  );
}
