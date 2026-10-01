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
            A secure workspace for fuel pricing operations.
          </p>
          <p className="mt-5 max-w-md text-slate-400">
            New accounts begin with viewer access and can be upgraded by an
            administrator.
          </p>
        </div>
        <p className="text-sm text-slate-500">
          Role-based access · audit-ready workflows
        </p>
      </section>
      <section className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-10 flex items-center gap-2 font-bold lg:hidden"
          >
            <Icon name="droplet" className="h-5 w-5" />
            FuelOps Portal
          </Link>
          <h1 className="text-3xl font-bold">Create account</h1>
          <p className="mt-2 text-slate-500">
            Request access to the pricing workspace.
          </p>
          <div className="mt-7">
            <AuthForm mode="signup" />
          </div>
          <p className="mt-6 text-sm text-slate-500">
            Already registered?{" "}
            <Link className="font-semibold text-cyan-700" href="/login">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
