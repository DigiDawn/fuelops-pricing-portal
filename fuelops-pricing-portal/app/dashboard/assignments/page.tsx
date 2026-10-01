import { getAuthContext } from "@/lib/auth";
import { StatusPill, EmptyState } from "@/components/dashboard/ui";

function fmt(v: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(v));
}
export default async function AssignmentsPage() {
  const { profile, supabase } = await getAuthContext();
  if (profile.role === "student") {
    const { data } = await supabase
      .from("submissions")
      .select(
        "id,status,score,assignment:assignments(id,title,instructions,due_at,max_points,course:courses(title))",
      )
      .eq("student_id", profile.id);
    const rows = (data || [])
      .filter((x: any) => x.assignment)
      .sort(
        (a: any, b: any) =>
          +new Date(a.assignment.due_at) - +new Date(b.assignment.due_at),
      );
    return (
      <div>
        <div className="mb-7">
          <p className="text-sm font-semibold text-indigo-600">Coursework</p>
          <h1 className="mt-1 text-3xl font-bold">Assignments</h1>
          <p className="mt-2 text-slate-500">
            Track deadlines, submissions, and grades.
          </p>
        </div>
        {rows.length ? (
          <div className="grid gap-4">
            {rows.map((s: any) => (
              <div
                key={s.id}
                className="rounded-2xl border bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {s.assignment.course?.title}
                    </p>
                    <h2 className="mt-1 text-lg font-bold">
                      {s.assignment.title}
                    </h2>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                      {s.assignment.instructions}
                    </p>
                  </div>
                  <StatusPill
                    tone={
                      s.status === "graded"
                        ? "green"
                        : s.status === "submitted"
                          ? "blue"
                          : s.status === "in_progress"
                            ? "amber"
                            : "slate"
                    }
                  >
                    {s.status.replace("_", " ")}
                  </StatusPill>
                </div>
                <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t pt-4 text-sm text-slate-500">
                  <span>
                    Due{" "}
                    <strong className="text-slate-800">
                      {fmt(s.assignment.due_at)}
                    </strong>
                  </span>
                  <span>
                    Points{" "}
                    <strong className="text-slate-800">
                      {s.assignment.max_points}
                    </strong>
                  </span>
                  {s.score != null && (
                    <span>
                      Score{" "}
                      <strong className="text-emerald-700">
                        {s.score}/{s.assignment.max_points}
                      </strong>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No assignments"
            body="Course assignments will appear here."
          />
        )}
      </div>
    );
  }
  const query =
    profile.role === "teacher"
      ? supabase
          .from("assignments")
          .select(
            "id,title,instructions,due_at,status,course:courses!inner(id,title,teacher_id),submissions(id,status,score,student:profiles(full_name))",
          )
          .eq("course.teacher_id", profile.id)
      : supabase
          .from("assignments")
          .select(
            "id,title,instructions,due_at,status,course:courses(id,title),submissions(id,status,score,student:profiles(full_name))",
          );
  const { data } = await query.order("due_at");
  return (
    <div>
      <div className="mb-7">
        <p className="text-sm font-semibold text-indigo-600">
          {profile.role === "teacher" ? "Teaching" : "Administration"}
        </p>
        <h1 className="mt-1 text-3xl font-bold">Assignments</h1>
        <p className="mt-2 text-slate-500">
          Review deadlines and submission activity.
        </p>
      </div>
      <div className="grid gap-4">
        {data?.map((a: any) => {
          const submitted = (a.submissions || []).filter(
            (s: any) => s.status === "submitted",
          ).length;
          const graded = (a.submissions || []).filter(
            (s: any) => s.status === "graded",
          ).length;
          return (
            <div
              key={a.id}
              className="rounded-2xl border bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {a.course?.title}
                  </p>
                  <h2 className="mt-1 text-lg font-bold">{a.title}</h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Due {fmt(a.due_at)}
                  </p>
                </div>
                <StatusPill tone={a.status === "open" ? "green" : "slate"}>
                  {a.status}
                </StatusPill>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Total submissions</p>
                  <p className="mt-1 text-2xl font-bold">
                    {a.submissions?.length || 0}
                  </p>
                </div>
                <div className="rounded-xl bg-amber-50 p-4">
                  <p className="text-xs text-amber-700">Needs review</p>
                  <p className="mt-1 text-2xl font-bold text-amber-800">
                    {submitted}
                  </p>
                </div>
                <div className="rounded-xl bg-emerald-50 p-4">
                  <p className="text-xs text-emerald-700">Graded</p>
                  <p className="mt-1 text-2xl font-bold text-emerald-800">
                    {graded}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
