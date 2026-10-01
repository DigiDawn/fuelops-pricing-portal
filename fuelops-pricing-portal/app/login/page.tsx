import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { Icon } from "@/components/dashboard/icons";
export default function Page() {
  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-2">
      <section className="hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-400 text-slate-950">
            <Icon name="droplet" className="h-5 w-5" />
          </div>
          <p className="font-bold">FuelOps Portal</p>
        </div>
        <div>
          <p className="max-w-lg text-4xl font-bold leading-tight">
            Pricing, suppliers, approvals, alerts, and audit history in one
            operational workspace.
          </p>
          <p className="mt-5 max-w-md text-slate-400">
            Secure access for pricing operators, reviewers, and administrators.
          </p>
        </div>
        <p className="text-sm text-slate-500">
          Fuel pricing operations platform
        </p>
      </section>
      <section className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-10 flex items-center gap-2 font-bold lg:hidden"
          >
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-950 text-cyan-300">
              <Icon name="droplet" className="h-4 w-4" />
            </div>
            FuelOps Portal
          </Link>
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="mt-2 text-slate-500">
            Sign in with your email or full name.
          </p>
          <div className="mt-7">
            <AuthForm mode="login" />
          </div>
        </div>
      </section>
    </main>
  );
}
