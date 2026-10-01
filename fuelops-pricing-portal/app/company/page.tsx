import { PublicHeader } from "@/components/public/header";
export default function Company() {
  return (
    <main className="min-h-screen bg-white">
      <PublicHeader />
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold text-cyan-700">Company</p>
          <h1 className="mt-2 text-5xl font-bold tracking-tight">
            Software built around real pricing operations.
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            FuelOps is designed for teams that need a clean, secure view of
            supplier data, posted prices, approvals, and exceptions without
            losing the audit trail behind each change.
          </p>
        </div>
        <div className="rounded-3xl bg-slate-950 p-8 text-white">
          <p className="text-sm font-semibold text-cyan-300">
            Operating principles
          </p>
          <div className="mt-6 space-y-6">
            {[
              [
                "Reliable by default",
                "Pricing data should stay traceable from source to publication.",
              ],
              [
                "Clear ownership",
                "Role-based workflows make it obvious who can view, propose, approve, and administer.",
              ],
              [
                "Fast to review",
                "Operational screens prioritize exceptions and changes rather than burying them.",
              ],
            ].map(([t, b]) => (
              <div key={t}>
                <h2 className="font-bold">{t}</h2>
                <p className="mt-1 text-sm leading-6 text-slate-400">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
