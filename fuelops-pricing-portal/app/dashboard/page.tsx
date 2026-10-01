import Link from "next/link";
import { getAuthContext } from "@/lib/auth";
import { Icon } from "@/components/dashboard/icons";
import { SectionTitle, StatCard, StatusPill } from "@/components/dashboard/ui";
function money(v: number) {
  return `$${Number(v).toFixed(3)}`;
}
function ago(v: string) {
  const m = Math.round((Date.now() - new Date(v).getTime()) / 60000);
  return m < 60 ? `${m}m ago` : `${Math.round(m / 60)}h ago`;
}
export default async function Dashboard() {
  const { profile, supabase } = await getAuthContext();
  const [
    { data: sites },
    { data: prices },
    { data: alerts },
    { data: reqs },
    { data: imports },
    { data: audit },
  ] = await Promise.all([
    supabase.from("fuel_sites").select("id,name,code,status,region"),
    supabase
      .from("current_fuel_prices")
      .select(
        "id,price,previous_price,updated_at,site:fuel_sites(name,code),product:fuel_products(name,code),supplier:fuel_suppliers(name)",
      )
      .order("updated_at", { ascending: false }),
    supabase
      .from("fuel_alerts")
      .select("id,severity,title,body,status,created_at,site:fuel_sites(name)")
      .neq("status", "resolved")
      .order("created_at", { ascending: false }),
    supabase
      .from("price_change_requests")
      .select(
        "id,status,requested_price,current_price,requested_at,site:fuel_sites(name),product:fuel_products(name),requester:profiles!price_change_requests_requested_by_fkey(full_name)",
      )
      .eq("status", "pending")
      .order("requested_at", { ascending: false }),
    supabase
      .from("fuel_imports")
      .select("*")
      .order("started_at", { ascending: false })
      .limit(4),
    supabase
      .from("fuel_audit_events")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);
  const regular = (prices || []).filter(
    (p: any) => p.product?.code === "UNL87",
  );
  const avg = regular.length
    ? regular.reduce((s: number, p: any) => s + Number(p.price), 0) /
      regular.length
    : 0;
  const changes = (prices || []).filter(
    (p: any) => Number(p.price) !== Number(p.previous_price),
  ).length;
  return (
    <div>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-cyan-700">
            Fuel pricing operations
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
            Good evening, {(profile.full_name || "Operator").split(" ")[0]}
          </h1>
          <p className="mt-2 text-slate-500">
            Monitor posted prices, supplier feeds, approvals, and site
            exceptions from one place.
          </p>
        </div>
        {profile.portal_role !== "viewer" && (
          <Link
            href="/dashboard/approvals"
            className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
          >
            Review pending changes
          </Link>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Active sites"
          value={(sites || []).filter((s: any) => s.status === "active").length}
          detail={`${sites?.length || 0} total locations`}
          icon="map"
        />
        <StatCard
          label="Avg. regular"
          value={money(avg)}
          detail="Across active locations"
          icon="droplet"
        />
        <StatCard
          label="Price movements"
          value={changes}
          detail="Since previous posting"
          icon="history"
        />
        <StatCard
          label="Open alerts"
          value={alerts?.length || 0}
          detail={`${(alerts || []).filter((a: any) => a.severity === "critical").length} critical`}
          icon="alert"
        />
      </div>
      <div className="mt-7 grid gap-6 xl:grid-cols-[1.5fr,.85fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionTitle
            title="Live posted prices"
            subtitle="Latest values by site and product"
            href="/dashboard/prices"
          />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="pb-3">Site</th>
                  <th className="pb-3">Product</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3">Change</th>
                  <th className="pb-3">Supplier</th>
                  <th className="pb-3">Updated</th>
                </tr>
              </thead>
              <tbody>
                {prices?.slice(0, 9).map((p: any) => {
                  const diff = Number(p.price) - Number(p.previous_price);
                  return (
                    <tr
                      key={p.id}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="py-3 font-semibold">{p.site?.name}</td>
                      <td className="py-3 text-slate-600">{p.product?.name}</td>
                      <td className="py-3 font-semibold tabular-nums">
                        {money(p.price)}
                      </td>
                      <td
                        className={`py-3 font-medium ${diff > 0 ? "text-rose-600" : diff < 0 ? "text-emerald-600" : "text-slate-400"}`}
                      >
                        {diff === 0
                          ? "—"
                          : `${diff > 0 ? "+" : ""}${diff.toFixed(3)}`}
                      </td>
                      <td className="py-3 text-slate-600">
                        {p.supplier?.name}
                      </td>
                      <td className="py-3 text-slate-500">
                        {ago(p.updated_at)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionTitle
            title="Exceptions"
            subtitle="Items that need attention"
            href="/dashboard/alerts"
          />
          {alerts?.map((a: any) => (
            <Link
              href="/dashboard/alerts"
              key={a.id}
              className="mb-3 block rounded-xl border border-slate-200 p-4 hover:bg-slate-50"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{a.title}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {a.site?.name || "Platform"} · {ago(a.created_at)}
                  </p>
                </div>
                <StatusPill
                  tone={
                    a.severity === "critical"
                      ? "rose"
                      : a.severity === "warning"
                        ? "amber"
                        : "blue"
                  }
                >
                  {a.severity}
                </StatusPill>
              </div>
              <p className="mt-2 text-sm text-slate-600">{a.body}</p>
            </Link>
          ))}
        </section>
      </div>
      <div className="mt-7 grid gap-6 xl:grid-cols-3">
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <SectionTitle title="Pending approvals" href="/dashboard/approvals" />
          {reqs?.length ? (
            reqs.slice(0, 4).map((r: any) => (
              <div key={r.id} className="border-b py-3 last:border-0">
                <div className="flex justify-between gap-3">
                  <div>
                    <p className="font-semibold">{r.site?.name}</p>
                    <p className="text-xs text-slate-500">{r.product?.name}</p>
                  </div>
                  <p className="font-bold">{money(r.requested_price)}</p>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  from {money(r.current_price)} · {r.requester?.full_name}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">No pending price changes.</p>
          )}
        </section>
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <SectionTitle title="Supplier imports" href="/dashboard/imports" />
          {imports?.map((i: any) => (
            <div
              key={i.id}
              className="flex items-center justify-between border-b py-3 last:border-0"
            >
              <div>
                <p className="font-semibold">{i.provider}</p>
                <p className="text-xs text-slate-500">
                  {i.rows_processed} rows · {ago(i.started_at)}
                </p>
              </div>
              <StatusPill
                tone={
                  i.status === "completed"
                    ? "green"
                    : i.status === "failed"
                      ? "rose"
                      : "amber"
                }
              >
                {i.status.replaceAll("_", " ")}
              </StatusPill>
            </div>
          ))}
        </section>
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <SectionTitle title="Recent activity" href="/dashboard/audit" />
          {audit?.map((a: any) => (
            <div key={a.id} className="border-b py-3 last:border-0">
              <p className="font-semibold">{a.entity_label}</p>
              <p className="mt-1 text-xs text-slate-500">
                {a.event_type.replaceAll("_", " ")} · {ago(a.created_at)}
              </p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
