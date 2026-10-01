import Link from "next/link";
import { notFound } from "next/navigation";
import { getAuthContext } from "@/lib/auth";
import { Icon } from "@/components/dashboard/icons";
import { ProgressBar, StatusPill } from "@/components/dashboard/ui";

export default async function CourseDetail({
  params,
}: {
  params: { id: string };
}) {
  const { profile, supabase } = await getAuthContext();
  const { data: course } = await supabase
    .from("courses")
    .select(
      "id,title,description,published,category,level,teacher:profiles(full_name,title),lessons(id,title,sort_order,duration_minutes,published),assignments(id,title,due_at,status)",
    )
    .eq("id", params.id)
    .single();
  if (!course) notFound();
  let progress: any = null;
  if (profile.role === "student") {
    const { data } = await supabase
      .from("course_progress")
      .select("*")
      .eq("course_id", params.id)
      .eq("student_id", profile.id)
      .maybeSingle();
    progress = data;
  }
  return (
    <div>
      <Link
        href="/dashboard/courses"
        className="text-sm font-semibold text-indigo-600"
      >
        ← Back to courses
      </Link>
      <div className="mt-5 rounded-3xl bg-slate-950 p-7 text-white sm:p-9">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex flex-wrap gap-2">
              <StatusPill tone="blue">{course.category}</StatusPill>
              <span className="rounded-md bg-white/10 px-2.5 py-2.5 text-xs font-semibold text-slate-200">
                {course.level}
              </span>
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              {course.title}
            </h1>
            <p className="mt-3 max-w-2xl leading-7 text-slate-300">
              {course.description}
            </p>
            <p className="mt-5 text-sm text-slate-400">
              Instructor:{" "}
              {(course.teacher as any)?.full_name || "Learning team"}
            </p>
          </div>
          {profile.role !== "student" && (
            <StatusPill tone={course.published ? "green" : "amber"}>
              {course.published ? "Published" : "Draft"}
            </StatusPill>
          )}
        </div>
        {progress && (
          <div className="mt-8 max-w-2xl">
            <div className="mb-2 flex justify-between text-sm text-slate-300">
              <span>Your progress</span>
              <span>{progress.progress_percent}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/15">
              <div
                className="h-2 rounded-full bg-indigo-400"
                style={{ width: `${progress.progress_percent}%` }}
              />
            </div>
          </div>
        )}
      </div>
      <div className="mt-7 grid gap-6 xl:grid-cols-[1.3fr,.7fr]">
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold">Course lessons</h2>
          <p className="mt-1 text-sm text-slate-500">
            Work through the curriculum in order.
          </p>
          <div className="mt-5 space-y-2">
            {(course.lessons as any[])
              ?.sort((a, b) => a.sort_order - b.sort_order)
              .map((l: any, i: number) => (
                <div
                  key={l.id}
                  className="flex items-center gap-4 rounded-xl border border-slate-200 p-4"
                >
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-sm font-bold text-slate-600">
                    {i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{l.title}</p>
                    <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                      <Icon name="clock" className="h-3.5 w-3.5" />
                      {l.duration_minutes} min
                    </div>
                  </div>
                  {profile.role === "student" &&
                    progress &&
                    i < progress.completed_lessons && (
                      <Icon name="check" className="h-5 w-5 text-emerald-500" />
                    )}
                </div>
              ))}
          </div>
        </section>
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold">Assignments</h2>
          <p className="mt-1 text-sm text-slate-500">
            Course work and deadlines.
          </p>
          <div className="mt-5 space-y-3">
            {(course.assignments as any[])?.map((a: any) => (
              <Link
                key={a.id}
                href="/dashboard/assignments"
                className="block rounded-xl border p-4 hover:bg-slate-50"
              >
                <p className="font-semibold">{a.title}</p>
                <p className="mt-2 text-xs text-slate-500">
                  Due{" "}
                  {new Intl.DateTimeFormat("en-US", {
                    month: "short",
                    day: "numeric",
                  }).format(new Date(a.due_at))}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
