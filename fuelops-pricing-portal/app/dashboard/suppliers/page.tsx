import { getAuthContext } from "@/lib/auth";
import { StatusPill } from "@/components/dashboard/ui";
function ago(v: string) {
  const m = Math.round((Date.now() - new Date(v).getTime()) / 60000);
  return m < 60 ? `${m} min ago` : `${Math.round(m / 60)} hr ago`;
}
export default async function Suppliers() {
  const { supabase } = await getAuthContext();
  const { data } = await supabase
    .from("fuel_suppliers")
    .select("*,prices:current_fuel_prices(id)")
    .order("name");
  return (
    <div>
      <div className="mb-6">
        <p className="text-sm font-semibold text-cyan-700">Supply network</p>
        <h1 className="mt-1 text-3xl font-bold">Suppliers</h1>
        <p className="mt-2 text-slate-500">
          Monitor feed health and supplier coverage.
        </p>
      </div>
      <div className="rounded-2xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-5 py-3">Supplier</th>
                <th>Status</th>
                <th>Last feed</th>
                <th>Prices served</th>
                <th>Contact</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((s: any) => (
                <tr key={s.id} className="border-t">
                  <td className="px-5 py-4">
                    <p className="font-semibold">{s.name}</p>
                    <p className="text-xs text-slate-400">{s.code}</p>
                  </td>
                  <td>
                    <StatusPill
                      tone={
                        s.status === "active"
                          ? "green"
                          : s.status === "delayed"
                            ? "amber"
                            : "rose"
                      }
                    >
                      {s.status}
                    </StatusPill>
                  </td>
                  <td>{s.last_feed_at ? ago(s.last_feed_at) : "—"}</td>
                  <td>{s.prices?.length || 0}</td>
                  <td>
                    <p>{s.contact_name}</p>
                    <p className="text-xs text-slate-400">{s.contact_email}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
