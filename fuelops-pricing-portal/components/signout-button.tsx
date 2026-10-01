"use client";
import { createClient } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";
export function SignOutButton() {
  const r = useRouter();
  return (
    <button
      className="rounded-lg border px-3 py-2 text-sm"
      onClick={async () => {
        await createClient().auth.signOut();
        r.push("/login");
        r.refresh();
      }}
    >
      Sign out
    </button>
  );
}
