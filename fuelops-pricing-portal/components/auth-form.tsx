"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage("");

    if (mode === "login") {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      const result = await response
        .json()
        .catch(() => ({ error: "Unable to sign in." }));
      if (!response.ok) {
        setMessage(result.error || "Unable to sign in.");
        setBusy(false);
        return;
      }
      router.push("/dashboard");
      router.refresh();
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    setMessage(
      error
        ? error.message
        : "Account created. Check email if confirmation is enabled.",
    );
    setBusy(false);
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {mode === "signup" && (
        <input
          required
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border px-4 py-3"
        />
      )}
      {mode === "login" ? (
        <input
          required
          type="text"
          autoComplete="username"
          placeholder="Email or full name"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="w-full rounded-xl border px-4 py-3"
        />
      ) : (
        <input
          required
          type="email"
          autoComplete="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border px-4 py-3"
        />
      )}
      <input
        required
        minLength={8}
        type="password"
        autoComplete={mode === "login" ? "current-password" : "new-password"}
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full rounded-xl border px-4 py-3"
      />
      <button
        disabled={busy}
        className="w-full rounded-xl bg-slate-900 px-4 py-3 font-medium text-white disabled:opacity-50"
      >
        {busy
          ? "Please wait..."
          : mode === "login"
            ? "Sign in"
            : "Create account"}
      </button>
      {message && <p className="text-sm text-slate-600">{message}</p>}
    </form>
  );
}
