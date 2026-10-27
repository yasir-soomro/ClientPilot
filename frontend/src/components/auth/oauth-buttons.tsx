const providers = [
  { name: "Google", slug: "google", className: "border-slate-200 bg-white text-slate-700 hover:bg-slate-50" },
  { name: "GitHub", slug: "github", className: "border-slate-800 bg-slate-900 text-white hover:bg-slate-800" },
] as const;

export function OAuthButtons() {
  return <div className="grid gap-3 sm:grid-cols-2">{providers.map(({ name, slug, className }) => <a key={slug} href={`/api/auth/oauth/${slug}/start`} className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-colors ${className}`}><span aria-hidden="true" className="text-sm font-bold">{slug === "github" ? "◉" : "G"}</span> Continue with {name}</a>)}</div>;
}
