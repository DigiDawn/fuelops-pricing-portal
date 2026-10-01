import { PublicHeader } from "@/components/public/header";
export default function Contact() {
  return (
    <main className="min-h-screen bg-slate-50">
      <PublicHeader />
      <section className="mx-auto max-w-3xl px-6 py-20">
        <p className="text-sm font-semibold text-cyan-700">Contact</p>
        <h1 className="mt-2 text-5xl font-bold tracking-tight">
          Talk with the operations team.
        </h1>
        <p className="mt-5 text-lg text-slate-600">
          Questions about access, supplier integrations, or pricing workflows?
          Send a note below.
        </p>
        <form className="mt-10 space-y-4 rounded-3xl border bg-white p-7 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium">
              Name
              <input
                className="mt-1 w-full rounded-xl border px-4 py-3"
                placeholder="Your name"
              />
            </label>
            <label className="text-sm font-medium">
              Work email
              <input
                className="mt-1 w-full rounded-xl border px-4 py-3"
                placeholder="you@company.com"
              />
            </label>
          </div>
          <label className="block text-sm font-medium">
            Topic
            <select className="mt-1 w-full rounded-xl border px-4 py-3">
              <option>Portal access</option>
              <option>Supplier feed</option>
              <option>Pricing workflow</option>
              <option>Technical support</option>
            </select>
          </label>
          <label className="block text-sm font-medium">
            Message
            <textarea
              className="mt-1 min-h-36 w-full rounded-xl border px-4 py-3"
              placeholder="How can we help?"
            />
          </label>
          <button className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white">
            Send message
          </button>
        </form>
      </section>
    </main>
  );
}
