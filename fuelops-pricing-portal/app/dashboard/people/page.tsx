import { redirect } from "next/navigation";
import { getAuthContext } from "@/lib/auth";
import { ProgressBar } from "@/components/dashboard/ui";
export default async function PeoplePage() {
  const { profile, supabase } = await getAuthContext();
  if (profile.role !== "teacher") redirect("/dashboard");
  const { data } = await supabase
    .from("enrollments")
    .select(
      "id,student_id,student:profiles(id,full_name,email,title),course:courses!inner(id,title,teacher_id),progress:course_progress(progress_percent)",
    )
    .eq("course.teacher_id", profile.id);
  const groups = new Map<string, any>();
  for (const e of data || []) {
    const s = (e as any).student;
    if (!s) continue;
    if (!groups.has(s.id)) groups.set(s.id, { ...s, courses: [] });
    groups
      .get(s.id)
      .courses.push({
        title: (e as any).course?.title,
        progress: (e as any).progress?.[0]?.progress_percent || 0,
      });
  }
  return (
    <div>
      <div className="mb-7">
        <p className="text-sm font-semibold text-indigo-600">Teaching</p>
        <h1 className="mt-1 text-3xl font-bold">Students</h1>
        <p className="mt-2 text-slate-500">
          People enrolled in your courses and their learning progress.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from(groups.values()).map((s: any) => (
          <div key={s.id} className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-indigo-100 font-bold text-indigo-700">
                {s.full_name
                  ?.split(/\s+/)
                  .map((x: string) => x[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div>
                <p className="font-bold">{s.full_name}</p>
                <p className="text-xs text-slate-500">{s.email}</p>
              </div>
            </div>
            <div className="mt-5 space-y-4">
              {s.courses.map((c: any, i: number) => (
                <div key={i}>
                  <div className="mb-2 flex justify-between gap-3 text-xs">
                    <span className="truncate text-slate-600">{c.title}</span>
                    <span className="font-semibold">{c.progress}%</span>
                  </div>
                  <ProgressBar value={c.progress} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
