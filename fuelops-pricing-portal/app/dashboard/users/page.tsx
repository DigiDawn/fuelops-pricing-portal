import { getAuthContext } from "@/lib/auth";
import { StatusPill } from "@/components/dashboard/ui";
export default async function Users() {
  const { profile, supabase } = await getAuthContext();
  if (profile.portal_role !== "admin")
    return (
      <div className="rounded-2xl border bg-white p-8">
        Administrator access is required.
      </div>
    );
  const { data } = await supabase
    .from("profiles")
    .select("id,full_name,email,portal_role,title,created_at")
    .order("created_at", { ascending: false });
  return (
    <div>
      <div className="mb-6">
        <p className="text-sm font-semibold text-cyan-700">Administration</p>
        <h1 className="mt-1 text-3xl font-bold">Users & access</h1>
        <p className="mt-2 text-slate-500">
          Manage portal roles and access levels.
        </p>
      </div>
      <div className="rounded-2xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-5 py-3">User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Title</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((u: any) => (
                <tr key={u.id} className="border-t">
                  <td className="px-5 py-4 font-semibold">{u.full_name}</td>
                  <td>{u.email}</td>
                  <td>
                    <StatusPill
                      tone={
                        u.portal_role === "admin"
                          ? "blue"
                          : u.portal_role === "pricing_manager"
                            ? "green"
                            : "slate"
                      }
                    >
                      {u.portal_role.replace("_", " ")}
                    </StatusPill>
                  </td>
                  <td>{u.title || "—"}</td>
                  <td className="text-slate-500">
                    {new Date(u.created_at).toLocaleDateString()}
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
