import { getAuthContext } from "@/lib/auth";
import { StatusPill } from "@/components/dashboard/ui";
export default async function Sites() {
  const { supabase } = await getAuthContext();
  const { data: sites } = await supabase
    .from("fuel_sites")
    .select(
      "*,prices:current_fuel_prices(id,price,product:fuel_products(code))",
    )
    .order("name");
  return (
    <div>
      <div className="mb-6">
        <p className="text-sm font-semibold text-cyan-700">Network</p>
        <h1 className="mt-1 text-3xl font-bold">Sites</h1>
        <p className="mt-2 text-slate-500">
          Location status and current market coverage.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sites?.map((s: any) => (
          <article
            key={s.id}
            className="rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {s.code}
                </p>
                <h2 className="mt-1 text-lg font-bold">{s.name}</h2>
                <p className="mt-1 text-sm text-slate-500">
                  {s.city}, {s.state} · {s.region}
                </p>
              </div>
              <StatusPill
                tone={
                  s.status === "active"
                    ? "green"
                    : s.status === "maintenance"
                      ? "amber"
                      : "slate"
                }
              >
                {s.status}
              </StatusPill>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {s.prices?.slice(0, 4).map((p: any) => (
                <div key={p.id} className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">{p.product?.code}</p>
                  <p className="mt-1 font-bold">
                    ${Number(p.price).toFixed(3)}
                  </p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
