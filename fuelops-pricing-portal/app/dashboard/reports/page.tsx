import { getAuthContext } from "@/lib/auth";
import { StatCard } from "@/components/dashboard/ui";
export default async function Reports() {
  const { supabase } = await getAuthContext();
  const [{ data: prices }, { data: sites }, { data: history }] =
    await Promise.all([
      supabase
        .from("current_fuel_prices")
        .select("price,previous_price,product:fuel_products(code)"),
      supabase.from("fuel_sites").select("status"),
      supabase
        .from("fuel_price_history")
        .select("id", { count: "exact" })
        .limit(1),
    ]);
  const moved = (prices || []).filter(
    (p: any) => Number(p.price) !== Number(p.previous_price),
  ).length;
  return (
    <div>
      <div className="mb-6">
        <p className="text-sm font-semibold text-cyan-700">Analytics</p>
        <h1 className="mt-1 text-3xl font-bold">Pricing reports</h1>
        <p className="mt-2 text-slate-500">
          Operational snapshots and export-ready pricing views.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Posted prices"
          value={prices?.length || 0}
          detail="Current records"
          icon="droplet"
        />
        <StatCard
          label="Price movements"
          value={moved}
          detail="Current vs previous"
          icon="history"
        />
        <StatCard
          label="Sites online"
          value={(sites || []).filter((s: any) => s.status === "active").length}
          detail="Active network"
          icon="map"
        />
        <StatCard
          label="History rows"
          value="56+"
          detail="Audit-ready price history"
          icon="chart"
        />
      </div>
      <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {[
          "Daily Price Publication",
          "Regional Price Movement",
          "Supplier Feed Health",
          "Site Exception Summary",
          "Approval Turnaround",
          "Audit & Compliance",
        ].map((x, i) => (
          <article
            key={x}
            className="rounded-2xl border bg-white p-6 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">
              Report {String(i + 1).padStart(2, "0")}
            </p>
            <h2 className="mt-2 text-lg font-bold">{x}</h2>
            <p className="mt-2 text-sm text-slate-500">
              Prepared from the current portal dataset with site, product, and
              supplier filters.
            </p>
            <button className="mt-5 rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-slate-50">
              Open report
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
