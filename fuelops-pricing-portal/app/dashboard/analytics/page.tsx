import { redirect } from "next/navigation";
import { getAuthContext } from "@/lib/auth";
import { ProgressBar, StatCard } from "@/components/dashboard/ui";
export default async function AnalyticsPage() {
  const { profile, supabase } = await getAuthContext();
  if (profile.role !== "admin") redirect("/dashboard");
  const [
    { data: users },
    { data: courses },
    { data: progress },
    { data: submissions },
  ] = await Promise.all([
    supabase.from("profiles").select("role"),
    supabase.from("courses").select("id,title,published,enrollments(count)"),
    supabase
      .from("course_progress")
      .select("course_id,progress_percent,course:courses(title)"),
    supabase.from("submissions").select("status,score"),
  ]);
  const avg = progress?.length
    ? Math.round(
        progress.reduce((s, p) => s + p.progress_percent, 0) / progress.length,
      )
    : 0;
  const graded = submissions?.filter((s) => s.status === "graded") || [];
  const avgScore = graded.length
    ? Math.round(graded.reduce((s, x) => s + (x.score || 0), 0) / graded.length)
    : 0;
  const byCourse = new Map<string, { title: string; sum: number; n: number }>();
  for (const p of progress || []) {
    const k = p.course_id;
    const title = (p.course as any)?.title || "Course";
    const x = byCourse.get(k) || { title, sum: 0, n: 0 };
    x.sum += p.progress_percent;
    x.n++;
    byCourse.set(k, x);
  }
  return (
    <div>
      <div className="mb-7">
        <p className="text-sm font-semibold text-indigo-600">Administration</p>
        <h1 className="mt-1 text-3xl font-bold">Analytics</h1>
        <p className="mt-2 text-slate-500">
          A quick view of learning engagement and platform health.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Students"
          value={users?.filter((u) => u.role === "student").length || 0}
          icon="users"
        />
        <StatCard
          label="Published courses"
          value={courses?.filter((c) => c.published).length || 0}
          icon="book"
        />
        <StatCard label="Average progress" value={`${avg}%`} icon="chart" />
        <StatCard
          label="Average graded score"
          value={`${avgScore}%`}
          icon="check"
        />
      </div>
      <div className="mt-7 rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold">Average progress by course</h2>
        <p className="mt-1 text-sm text-slate-500">
          Based on all current enrollments.
        </p>
        <div className="mt-6 space-y-5">
          {Array.from(byCourse.entries()).map(([id, x]) => {
            const v = Math.round(x.sum / x.n);
            return (
              <div key={id}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-medium">{x.title}</span>
                  <span className="font-semibold text-indigo-600">{v}%</span>
                </div>
                <ProgressBar value={v} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
