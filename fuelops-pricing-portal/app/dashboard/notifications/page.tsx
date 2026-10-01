import { getAuthContext } from "@/lib/auth";
import Link from "next/link";
export default async function Notifications() {
  const { profile, supabase } = await getAuthContext();
  const { data } = await supabase
    .from("portal_notifications")
    .select("*")
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false });
  return (
    <div>
      <div className="mb-6">
        <p className="text-sm font-semibold text-cyan-700">Updates</p>
        <h1 className="mt-1 text-3xl font-bold">Notifications</h1>
      </div>
      <div className="space-y-3">
        {data?.map((n: any) => (
          <Link
            key={n.id}
            href={n.href || "/dashboard"}
            className="flex gap-4 rounded-2xl border bg-white p-5 shadow-sm hover:bg-slate-50"
          >
            <div
              className={`mt-2 h-2.5 w-2.5 shrink-0 rounded-full ${n.is_read ? "bg-slate-300" : "bg-cyan-500"}`}
            />
            <div>
              <p className="font-bold">{n.title}</p>
              <p className="mt-1 text-sm text-slate-500">{n.body}</p>
              <p className="mt-2 text-xs text-slate-400">
                {new Date(n.created_at).toLocaleString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
