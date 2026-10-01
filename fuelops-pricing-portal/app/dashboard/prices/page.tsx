import { getAuthContext } from "@/lib/auth";
import { StatusPill } from "@/components/dashboard/ui";
function money(v: any) {
  return `$${Number(v).toFixed(3)}`;
}
export default async function PricesPage() {
  const { supabase } = await getAuthContext();
  const { data } = await supabase
    .from("current_fuel_prices")
    .select(
      "id,price,previous_price,status,effective_at,updated_at,site:fuel_sites(name,code,region),product:fuel_products(name,code),supplier:fuel_suppliers(name)",
    )
    .order("updated_at", { ascending: false });
  return (
    <div>
      <div className="mb-6">
        <p className="text-sm font-semibold text-cyan-700">Pricing</p>
        <h1 className="mt-1 text-3xl font-bold">Live fuel pricing</h1>
        <p className="mt-2 text-slate-500">
          Current approved prices across every operating location.
        </p>
      </div>
      <div className="rounded-2xl border bg-white shadow-sm">
        <div className="flex flex-wrap gap-3 border-b p-4">
          <input
            placeholder="Filter by site or product..."
            className="min-w-64 flex-1 rounded-xl border px-4 py-2.5 text-sm"
          />
          <select className="rounded-xl border px-4 py-2.5 text-sm">
            <option>All regions</option>
            <option>North Texas</option>
            <option>Gulf Coast</option>
            <option>Central Texas</option>
            <option>South Texas</option>
            <option>West Texas</option>
          </select>
          <button className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white">
            Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-5 py-3">Site</th>
                <th>Region</th>
                <th>Product</th>
                <th>Supplier</th>
                <th>Previous</th>
                <th>Current</th>
                <th>Movement</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((p: any) => {
                const d = Number(p.price) - Number(p.previous_price);
                return (
                  <tr key={p.id} className="border-t">
                    <td className="px-5 py-4">
                      <p className="font-semibold">{p.site?.name}</p>
                      <p className="text-xs text-slate-400">{p.site?.code}</p>
                    </td>
                    <td>{p.site?.region}</td>
                    <td>{p.product?.name}</td>
                    <td>{p.supplier?.name}</td>
                    <td className="tabular-nums text-slate-500">
                      {money(p.previous_price)}
                    </td>
                    <td className="font-bold tabular-nums">{money(p.price)}</td>
                    <td
                      className={`font-semibold ${d > 0 ? "text-rose-600" : d < 0 ? "text-emerald-600" : "text-slate-400"}`}
                    >
                      {d === 0 ? "—" : `${d > 0 ? "+" : ""}${d.toFixed(3)}`}
                    </td>
                    <td>
                      <StatusPill tone="green">{p.status}</StatusPill>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
