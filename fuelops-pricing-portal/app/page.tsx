import Link from "next/link";
import { Icon } from "@/components/dashboard/icons";
export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-slate-100">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-950 text-cyan-300">
              <Icon name="droplet" className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold">FuelOps Portal</p>
              <p className="text-xs text-slate-500">Pricing operations</p>
            </div>
          </div>
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <Link href="/solutions">Solutions</Link>
            <Link href="/company">Company</Link>
            <Link href="/contact">Contact</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-semibold text-slate-700"
            >
              Sign in
            </Link>
            <Link
              href="/login"
              className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white"
            >
              Open portal
            </Link>
          </div>
        </div>
      </header>
      <section className="mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-1.5 text-sm font-semibold text-cyan-800">
            <Icon name="shield" className="h-4 w-4" /> Secure fuel pricing
            operations
          </div>
          <h1 className="mt-6 max-w-2xl text-5xl font-bold tracking-tight text-slate-950 sm:text-6xl">
            Move fuel pricing from feed to publication with confidence.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Monitor supplier feeds, review price changes, manage site
            exceptions, and keep an audit-ready history across your network.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/login"
              className="rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white shadow-sm"
            >
              Sign in to portal
            </Link>
            <a
              href="#platform"
              className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700"
            >
              Explore platform
            </a>
          </div>
          <div className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t pt-6">
            <div>
              <p className="text-2xl font-bold">6</p>
              <p className="text-sm text-slate-500">Sites</p>
            </div>
            <div>
              <p className="text-2xl font-bold">24</p>
              <p className="text-sm text-slate-500">Live prices</p>
            </div>
            <div>
              <p className="text-2xl font-bold">4</p>
              <p className="text-sm text-slate-500">Supplier feeds</p>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-cyan-100 to-slate-100 blur-2xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 p-5 shadow-2xl">
            <div className="rounded-2xl bg-white p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">North Texas pricing</p>
                  <p className="mt-1 text-2xl font-bold">Market snapshot</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Feeds healthy
                </span>
              </div>
              <div className="mt-6 space-y-3">
                {[
                  ["Dallas Central", "Regular", "$3.129", "+0.020"],
                  ["Fort Worth West", "Diesel", "$3.549", "-0.030"],
                  ["Houston East", "Regular", "$3.089", "-0.030"],
                ].map(([a, b, c, d]) => (
                  <div
                    key={a}
                    className="grid grid-cols-[1fr,100px,80px] items-center rounded-xl border p-4"
                  >
                    <div>
                      <p className="font-semibold">{a}</p>
                      <p className="text-xs text-slate-500">{b}</p>
                    </div>
                    <p className="font-bold">{c}</p>
                    <p
                      className={`text-right text-sm font-semibold ${d.startsWith("+") ? "text-rose-600" : "text-emerald-600"}`}
                    >
                      {d}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="platform" className="border-t bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-sm font-semibold text-cyan-700">
            Built for pricing teams
          </p>
          <h2 className="mt-2 max-w-2xl text-3xl font-bold">
            One operational view from supplier feed to audit trail.
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              [
                "Live pricing",
                "Current prices, movements, sites, and supplier source in one view.",
              ],
              [
                "Approval workflow",
                "Controlled review for manual adjustments before publication.",
              ],
              [
                "Audit & reporting",
                "History, imports, exceptions, and activity ready for review.",
              ],
            ].map(([t, b]) => (
              <div key={t} className="rounded-2xl border bg-white p-6">
                <h3 className="font-bold">{t}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
