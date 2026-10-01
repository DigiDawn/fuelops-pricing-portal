import { getAuthContext } from "@/lib/auth";
export default async function Audit() {
  const { profile, supabase } = await getAuthContext();
  if (profile.portal_role !== "admin")
    return (
      <div className="rounded-2xl border bg-white p-8">
        Administrator access is required.
      </div>
    );
  const { data } = await supabase
    .from("fuel_audit_events")
    .select("*,actor:profiles(full_name,email)")
    .order("created_at", { ascending: false });
  return (
    <div>
      <div className="mb-6">
        <p className="text-sm font-semibold text-cyan-700">Compliance</p>
        <h1 className="mt-1 text-3xl font-bold">Audit log</h1>
        <p className="mt-2 text-slate-500">
          Immutable operational activity for pricing and feed workflows.
        </p>
      </div>
      <div className="rounded-2xl border bg-white shadow-sm">
        {data?.map((a: any) => (
          <div
            key={a.id}
            className="grid gap-2 border-b p-5 last:border-0 md:grid-cols-[180px,1fr,220px]"
          >
            <div>
              <p className="text-xs font-semibold text-cyan-700">
                {a.event_type.replaceAll("_", " ")}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                {new Date(a.created_at).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="font-semibold">{a.entity_label}</p>
              <p className="mt-1 text-sm text-slate-500">{a.detail}</p>
            </div>
            <div className="text-sm text-slate-500 md:text-right">
              {a.actor?.full_name || "System"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
