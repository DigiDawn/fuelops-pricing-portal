import { getAuthContext } from "@/lib/auth";
import { StatusPill } from "@/components/dashboard/ui";
export default async function Imports() {
  const { profile, supabase } = await getAuthContext();
  if (profile.portal_role === "viewer")
    return (
      <div className="rounded-2xl border bg-white p-8">
        You do not have import access.
      </div>
    );
  const { data } = await supabase
    .from("fuel_imports")
    .select("*")
    .order("started_at", { ascending: false });
  return (
    <div>
      <div className="mb-6 flex flex-wrap justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-cyan-700">Data pipeline</p>
          <h1 className="mt-1 text-3xl font-bold">Supplier imports</h1>
          <p className="mt-2 text-slate-500">
            Track automated and manual price-feed ingestion.
          </p>
        </div>
        <button className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white">
          Upload price file
        </button>
      </div>
      <div className="rounded-2xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-5 py-3">Provider</th>
                <th>File</th>
                <th>Status</th>
                <th>Rows</th>
                <th>Errors</th>
                <th>Started</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((i: any) => (
                <tr key={i.id} className="border-t">
                  <td className="px-5 py-4 font-semibold">{i.provider}</td>
                  <td>{i.filename}</td>
                  <td>
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
                  </td>
                  <td>
                    {i.rows_processed}/{i.rows_received}
                  </td>
                  <td>{i.error_count}</td>
                  <td>{new Date(i.started_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
