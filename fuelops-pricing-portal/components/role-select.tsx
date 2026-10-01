"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { UserRole } from "@/lib/types";
export function RoleSelect({
  userId,
  currentRole,
}: {
  userId: string;
  currentRole: UserRole;
}) {
  const [role, setRole] = useState<UserRole>(currentRole);
  const [busy, setBusy] = useState(false);
  const r = useRouter();
  async function update(next: UserRole) {
    setRole(next);
    setBusy(true);
    const res = await fetch("/api/admin/roles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role: next }),
    });
    if (!res.ok) {
      setRole(currentRole);
      alert("Update failed");
    }
    setBusy(false);
    r.refresh();
  }
  return (
    <select
      disabled={busy}
      value={role}
      onChange={(e) => update(e.target.value as UserRole)}
      className="rounded-lg border bg-white px-3 py-2 text-sm"
    >
      <option value="student">Student</option>
      <option value="teacher">Teacher</option>
      <option value="admin">Admin</option>
    </select>
  );
}
