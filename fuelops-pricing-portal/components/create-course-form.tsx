"use client";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";
export function CreateCourseForm({ teacherId }: { teacherId: string }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [msg, setMsg] = useState("");
  const r = useRouter();
  async function submit(e: FormEvent) {
    e.preventDefault();
    const { error } = await createClient()
      .from("courses")
      .insert({ title, description, teacher_id: teacherId, published: false });
    setMsg(error ? error.message : "Course created");
    if (!error) {
      setTitle("");
      setDescription("");
      r.refresh();
    }
  }
  return (
    <form onSubmit={submit} className="rounded-2xl bg-white p-6 shadow">
      <h2 className="font-semibold">Create course</h2>
      <input
        required
        placeholder="Course title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mt-4 w-full rounded-xl border px-4 py-3"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="mt-3 min-h-24 w-full rounded-xl border px-4 py-3"
      />
      <button className="mt-3 rounded-xl bg-slate-900 px-4 py-3 text-white">
        Create
      </button>
      {msg && <p className="mt-3 text-sm text-slate-600">{msg}</p>}
    </form>
  );
}
