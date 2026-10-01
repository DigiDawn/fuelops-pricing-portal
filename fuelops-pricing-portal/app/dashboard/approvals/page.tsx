import { getAuthContext } from "@/lib/auth";
import { StatusPill } from "@/components/dashboard/ui";
export default async function Approvals() {
  const { profile, supabase } = await getAuthContext();
  if (profile.portal_role === "viewer")
    return (
      <div className="rounded-2xl border bg-white p-8">
        You do not have approval access.
      </div>
    );
  const { data } = await supabase
    .from("price_change_requests")
    .select(
      "id,requested_price,current_price,reason,status,requested_at,site:fuel_sites(name,code),product:fuel_products(name),requester:profiles!price_change_requests_requested_by_fkey(full_name,email)",
    )
    .order("requested_at", { ascending: false });
  return (
    <div>
      <div className="mb-6">
        <p className="text-sm font-semibold text-cyan-700">Workflow</p>
        <h1 className="mt-1 text-3xl font-bold">Price approvals</h1>
        <p className="mt-2 text-slate-500">
          Review manual pricing changes before publication.
        </p>
      </div>
      <div className="space-y-4">
        {data?.map((r: any) => (
          <article
            key={r.id}
            className="rounded-2xl border bg-white p-6 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold">{r.site?.name}</h2>
                  <StatusPill
                    tone={
                      r.status === "pending"
                        ? "amber"
                        : r.status === "approved"
                          ? "green"
                          : "rose"
                    }
                  >
                    {r.status}
                  </StatusPill>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {r.product?.name} · requested by {r.requester?.full_name}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">Requested price</p>
                <p className="text-2xl font-bold">
                  ${Number(r.requested_price).toFixed(3)}
                </p>
                <p className="text-xs text-slate-500">
                  Current ${Number(r.current_price).toFixed(3)}
                </p>
              </div>
            </div>
            <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
              {r.reason || "No reason provided."}
            </p>
            {r.status === "pending" && (
              <div className="mt-4 flex gap-2">
                <button className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">
                  Approve
                </button>
                <button className="rounded-xl border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700">
                  Reject
                </button>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
