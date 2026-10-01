import { getAuthContext } from "@/lib/auth";
export default async function Settings() {
  const { profile } = await getAuthContext();
  return (
    <div>
      <div className="mb-6">
        <p className="text-sm font-semibold text-cyan-700">Account</p>
        <h1 className="mt-1 text-3xl font-bold">Settings</h1>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="font-bold">Profile</h2>
          <div className="mt-5 space-y-4">
            <label className="block text-sm font-medium">
              Full name
              <input
                defaultValue={profile.full_name || ""}
                className="mt-1 w-full rounded-xl border px-4 py-2.5"
              />
            </label>
            <label className="block text-sm font-medium">
              Email
              <input
                value={profile.email}
                disabled
                className="mt-1 w-full rounded-xl border bg-slate-50 px-4 py-2.5 text-slate-500"
              />
            </label>
            <label className="block text-sm font-medium">
              Portal role
              <input
                value={profile.portal_role.replace("_", " ")}
                disabled
                className="mt-1 w-full rounded-xl border bg-slate-50 px-4 py-2.5 capitalize text-slate-500"
              />
            </label>
            <button className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white">
              Save profile
            </button>
          </div>
        </section>
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="font-bold">Preferences</h2>
          <div className="mt-5 space-y-4 text-sm">
            <label className="flex items-center justify-between rounded-xl border p-4">
              <span>
                <b>Email price alerts</b>
                <span className="block text-slate-500">
                  Receive critical supplier and price exceptions.
                </span>
              </span>
              <input type="checkbox" defaultChecked />
            </label>
            <label className="flex items-center justify-between rounded-xl border p-4">
              <span>
                <b>Approval reminders</b>
                <span className="block text-slate-500">
                  Notify when a request is waiting for review.
                </span>
              </span>
              <input type="checkbox" defaultChecked />
            </label>
          </div>
        </section>
      </div>
    </div>
  );
}
