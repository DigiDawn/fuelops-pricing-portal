import Link from "next/link";
import { Icon } from "./icons";
import { SignOutButton } from "@/components/signout-button";
import type { Profile } from "@/lib/types";
function initials(name: string) {
  return name
    .split(/\s+/)
    .map((x) => x[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
export function Topbar({
  profile,
  unread,
}: {
  profile: Profile;
  unread: number;
}) {
  const name = profile.full_name || profile.email;
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex h-20 items-center gap-4 px-5 sm:px-7">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-bold lg:hidden"
        >
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-950 text-cyan-300">
            <Icon name="droplet" className="h-4 w-4" />
          </div>
          <span>FuelOps</span>
        </Link>
        <form
          action="/dashboard/search"
          className="hidden w-full max-w-xl sm:block"
        >
          <div className="relative">
            <Icon
              name="search"
              className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            />
            <input
              name="q"
              placeholder="Search sites, suppliers, products..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-50"
            />
          </div>
        </form>
        <div className="ml-auto hidden items-center gap-1 xl:flex">
          <Link
            href="/dashboard/prices"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Live prices
          </Link>
          <Link
            href="/dashboard/reports"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Reports
          </Link>
          <Link
            href="/dashboard/alerts"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Operations
          </Link>
        </div>
        <Link
          href="/dashboard/notifications"
          className="relative grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
        >
          <Icon name="bell" className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-rose-500 px-1 text-center text-[10px] font-bold leading-5 text-white">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </Link>
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 rounded-xl px-1.5 py-1 hover:bg-slate-50"
        >
          <div className="grid h-10 w-10 place-items-center rounded-full bg-slate-900 text-sm font-bold text-cyan-300">
            {initials(name)}
          </div>
          <div className="hidden md:block">
            <p className="max-w-40 truncate text-sm font-semibold">{name}</p>
            <p className="text-xs capitalize text-slate-500">
              {profile.portal_role.replace("_", " ")}
            </p>
          </div>
        </Link>
        <div className="hidden 2xl:block">
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
