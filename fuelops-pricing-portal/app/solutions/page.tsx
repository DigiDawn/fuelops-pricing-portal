import { PublicHeader } from "@/components/public/header";
import { Icon } from "@/components/dashboard/icons";
export default function Solutions() {
  return (
    <main className="min-h-screen bg-slate-50">
      <PublicHeader />
      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-sm font-semibold text-cyan-700">Solutions</p>
        <h1 className="mt-2 max-w-3xl text-5xl font-bold tracking-tight">
          Operational control for fuel pricing teams.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-slate-600">
          From supplier feed ingestion through approval and publication, FuelOps
          keeps pricing workflows visible and auditable.
        </p>
        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[
            [
              "droplet",
              "Live pricing",
              "Monitor current and previous prices by location, product, supplier, and region.",
            ],
            [
              "upload",
              "Supplier feeds",
              "Track imports, warnings, failed files, and freshness against expected feed cadence.",
            ],
            [
              "check",
              "Approval workflow",
              "Review manual adjustments with clear before-and-after values and reasons.",
            ],
            [
              "alert",
              "Exception management",
              "Surface feed delays, site maintenance, and price movements outside thresholds.",
            ],
            [
              "history",
              "Historical pricing",
              "Retain price history with effective timestamps and source attribution.",
            ],
            [
              "shield",
              "Audit & access",
              "Role-based access and activity records support controlled operational changes.",
            ],
          ].map(([i, t, b]) => (
            <article
              key={t}
              className="rounded-2xl border bg-white p-6 shadow-sm"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-cyan-50 text-cyan-700">
                <Icon name={i as any} className="h-5 w-5" />
              </div>
              <h2 className="mt-5 text-lg font-bold">{t}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">{b}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
