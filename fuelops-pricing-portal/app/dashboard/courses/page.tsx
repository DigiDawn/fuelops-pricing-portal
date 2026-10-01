import Link from "next/link";
import { getAuthContext } from "@/lib/auth";
import {
  ProgressBar,
  SectionTitle,
  StatusPill,
  EmptyState,
} from "@/components/dashboard/ui";
import { CreateCourseForm } from "@/components/create-course-form";

export default async function CoursesPage() {
  const { profile, supabase } = await getAuthContext();
  if (profile.role === "student") {
    const [{ data: enrollments }, { data: progressRows }] = await Promise.all([
      supabase
        .from("enrollments")
        .select("course_id,course:courses(id,title,description,category,level)")
        .eq("student_id", profile.id),
      supabase
        .from("course_progress")
        .select(
          "course_id,progress_percent,completed_lessons,total_lessons,last_lesson_title",
        )
        .eq("student_id", profile.id),
    ]);
    const progressByCourse = new Map(
      (progressRows || []).map((p: any) => [p.course_id, p]),
    );
    const data = (enrollments || []).map((row: any) => ({
      ...row,
      progress: progressByCourse.get(row.course_id),
    }));
    return (
      <div>
        <div className="mb-7">
          <p className="text-sm font-semibold text-indigo-600">Learning</p>
          <h1 className="mt-1 text-3xl font-bold">My courses</h1>
          <p className="mt-2 text-slate-500">
            All of your active learning in one place.
          </p>
        </div>
        {data.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {data.map((row: any) => {
              const p = row.progress;
              return (
                <Link
                  key={row.course_id}
                  href={`/dashboard/courses/${row.course_id}`}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 font-bold text-indigo-600">
                      {row.course?.title?.[0]}
                    </div>
                    <StatusPill tone="blue">{row.course?.level}</StatusPill>
                  </div>
                  <h2 className="mt-5 text-lg font-bold group-hover:text-indigo-700">
                    {row.course?.title}
                  </h2>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                    {row.course?.description}
                  </p>
                  <div className="mt-5">
                    <div className="mb-2 flex justify-between text-xs text-slate-500">
                      <span>
                        {p?.completed_lessons || 0}/{p?.total_lessons || 5}{" "}
                        lessons
                      </span>
                      <span>{p?.progress_percent || 0}%</span>
                    </div>
                    <ProgressBar value={p?.progress_percent || 0} />
                  </div>
                  <p className="mt-4 text-xs text-slate-400">
                    Last: {p?.last_lesson_title || "Course orientation"}
                  </p>
                </Link>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No courses yet"
            body="Your enrolled courses will appear here."
          />
        )}
      </div>
    );
  }
  if (profile.role === "teacher") {
    const { data } = await supabase
      .from("courses")
      .select(
        "id,title,description,published,category,level,enrollments(count),lessons(count)",
      )
      .eq("teacher_id", profile.id)
      .order("created_at", { ascending: false });
    return (
      <div>
        <div className="mb-7">
          <p className="text-sm font-semibold text-indigo-600">Teaching</p>
          <h1 className="mt-1 text-3xl font-bold">My courses</h1>
          <p className="mt-2 text-slate-500">
            Manage course content, students, and publishing status.
          </p>
        </div>
        <div className="grid gap-6 xl:grid-cols-[360px,1fr]">
          <CreateCourseForm teacherId={profile.id} />
          <div>
            <SectionTitle
              title="Course library"
              subtitle={`${data?.length || 0} courses`}
            />
            <div className="grid gap-4 md:grid-cols-2">
              {data?.map((c: any) => (
                <Link
                  key={c.id}
                  href={`/dashboard/courses/${c.id}`}
                  className="rounded-2xl border bg-white p-5 shadow-sm hover:border-indigo-200"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="font-bold">{c.title}</h2>
                    <StatusPill tone={c.published ? "green" : "amber"}>
                      {c.published ? "Published" : "Draft"}
                    </StatusPill>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                    {c.description}
                  </p>
                  <div className="mt-5 flex gap-4 text-xs text-slate-500">
                    <span>{c.enrollments?.[0]?.count || 0} students</span>
                    <span>{c.lessons?.[0]?.count || 0} lessons</span>
                    <span>{c.level}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  const { data } = await supabase
    .from("courses")
    .select(
      "id,title,description,published,category,level,teacher:profiles(full_name),enrollments(count)",
    )
    .order("created_at", { ascending: false });
  return (
    <div>
      <div className="mb-7">
        <p className="text-sm font-semibold text-indigo-600">
          Catalog management
        </p>
        <h1 className="mt-1 text-3xl font-bold">Courses</h1>
        <p className="mt-2 text-slate-500">
          Review every course and its publishing status.
        </p>
      </div>
      <div className="rounded-2xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-4">Course</th>
                <th className="px-5 py-4">Instructor</th>
                <th className="px-5 py-4">Students</th>
                <th className="px-5 py-4">Level</th>
                <th className="px-5 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((c: any) => (
                <tr
                  key={c.id}
                  className="border-b last:border-0 hover:bg-slate-50"
                >
                  <td className="px-5 py-4">
                    <Link
                      href={`/dashboard/courses/${c.id}`}
                      className="font-semibold text-slate-900 hover:text-indigo-600"
                    >
                      {c.title}
                    </Link>
                    <p className="mt-1 text-xs text-slate-500">{c.category}</p>
                  </td>
                  <td className="px-5 py-4">{c.teacher?.full_name || "—"}</td>
                  <td className="px-5 py-4">
                    {c.enrollments?.[0]?.count || 0}
                  </td>
                  <td className="px-5 py-4">{c.level}</td>
                  <td className="px-5 py-4">
                    <StatusPill tone={c.published ? "green" : "amber"}>
                      {c.published ? "Published" : "Draft"}
                    </StatusPill>
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
