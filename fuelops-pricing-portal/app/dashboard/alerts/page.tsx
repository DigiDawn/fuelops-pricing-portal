import { getAuthContext } from "@/lib/auth";
import { StatusPill } from "@/components/dashboard/ui";
export default async function Alerts() {
  const { supabase } = await getAuthContext();
  const { data } = await supabase
    .from("fuel_alerts")
    .select("*,site:fuel_sites(name,code),product:fuel_products(name)")
    .order("created_at", { ascending: false });
  return (
    <div>
      <div className="mb-6">
        <p className="text-sm font-semibold text-cyan-700">Exceptions</p>
        <h1 className="mt-1 text-3xl font-bold">Alerts</h1>
        <p className="mt-2 text-slate-500">
          Operational, feed, and pricing exceptions that require review.
        </p>
      </div>
      <div className="space-y-3">
        {data?.map((a: any) => (
          <div key={a.id} className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="flex flex-wrap justify-between gap-3">
              <div>
                <p className="font-bold">{a.title}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {a.site?.name || "Platform"}
                  {a.product?.name ? ` · ${a.product.name}` : ""}
                </p>
              </div>
              <div className="flex gap-2">
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
                <StatusPill>{a.status}</StatusPill>
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-600">{a.body}</p>
            <p className="mt-3 text-xs text-slate-400">
              {new Date(a.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
