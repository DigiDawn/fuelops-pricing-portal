import { getAuthContext } from "@/lib/auth";
import { EmptyState, StatusPill } from "@/components/dashboard/ui";
export default async function MessagesPage() {
  const { profile, supabase } = await getAuthContext();
  const { data } = await supabase
    .from("messages")
    .select(
      "id,subject,body,is_read,created_at,sender:profiles!messages_sender_id_fkey(full_name,role),recipient:profiles!messages_recipient_id_fkey(full_name,role),sender_id,recipient_id",
    )
    .or(`sender_id.eq.${profile.id},recipient_id.eq.${profile.id}`)
    .order("created_at", { ascending: false });
  return (
    <div>
      <div className="mb-7">
        <p className="text-sm font-semibold text-indigo-600">Communication</p>
        <h1 className="mt-1 text-3xl font-bold">Messages</h1>
        <p className="mt-2 text-slate-500">
          Conversations with your learning community.
        </p>
      </div>
      {data?.length ? (
        <div className="grid gap-3">
          {data.map((m: any) => {
            const incoming = m.recipient_id === profile.id;
            const other = incoming ? m.sender : m.recipient;
            return (
              <div
                key={m.id}
                className="rounded-2xl border bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold">{other?.full_name || "User"}</p>
                      <span className="text-xs capitalize text-slate-400">
                        {incoming ? "from" : "to"} {other?.role}
                      </span>
                      {incoming && !m.is_read && (
                        <span className="h-2 w-2 rounded-full bg-indigo-500" />
                      )}
                    </div>
                    <h2 className="mt-2 font-semibold text-slate-800">
                      {m.subject}
                    </h2>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                      {m.body}
                    </p>
                  </div>
                  <StatusPill>
                    {new Intl.DateTimeFormat("en-US", {
                      month: "short",
                      day: "numeric",
                    }).format(new Date(m.created_at))}
                  </StatusPill>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No messages yet"
          body="Messages from students, instructors, or admins will appear here."
        />
      )}
    </div>
  );
}
