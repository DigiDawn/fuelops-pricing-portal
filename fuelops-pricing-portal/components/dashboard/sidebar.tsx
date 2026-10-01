"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, IconName } from "./icons";
import type { PortalRole } from "@/lib/types";
const common = [
  { href: "/dashboard", label: "Overview", icon: "home" as IconName },
  {
    href: "/dashboard/prices",
    label: "Fuel Pricing",
    icon: "droplet" as IconName,
  },
  { href: "/dashboard/sites", label: "Sites", icon: "map" as IconName },
  {
    href: "/dashboard/suppliers",
    label: "Suppliers",
    icon: "truck" as IconName,
  },
  {
    href: "/dashboard/history",
    label: "Price History",
    icon: "history" as IconName,
  },
  { href: "/dashboard/alerts", label: "Alerts", icon: "alert" as IconName },
  { href: "/dashboard/reports", label: "Reports", icon: "chart" as IconName },
];
const manager = [
  {
    href: "/dashboard/approvals",
    label: "Approvals",
    icon: "check" as IconName,
  },
  { href: "/dashboard/imports", label: "Imports", icon: "upload" as IconName },
];
const admin = [
  {
    href: "/dashboard/users",
    label: "Users & Access",
    icon: "users" as IconName,
  },
  { href: "/dashboard/audit", label: "Audit Log", icon: "shield" as IconName },
];
export function Sidebar({ role }: { role: PortalRole }) {
  const path = usePathname();
  const items = [
    ...common,
    ...(role !== "viewer" ? manager : []),
    ...(role === "admin" ? admin : []),
  ];
  return (
    <aside className="hidden w-72 shrink-0 border-r border-slate-800 bg-slate-950 text-white lg:flex lg:flex-col">
      <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-500 text-slate-950">
          <Icon name="droplet" className="h-5 w-5" />
        </div>
        <div>
          <p className="font-bold tracking-tight">FuelOps Portal</p>
          <p className="text-xs text-slate-400">Pricing operations</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        <p className="px-3 pb-2 pt-2 text-[11px] font-semibold uppercase tracking-[.16em] text-slate-500">
          Operations
        </p>
        {items.map((i) => {
          const active =
            i.href === "/dashboard" ? path === i.href : path.startsWith(i.href);
          return (
            <Link
              prefetch={false}
              key={i.href}
              href={i.href}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${active ? "bg-cyan-400/15 text-cyan-300 ring-1 ring-cyan-400/20" : "text-slate-400 hover:translate-x-0.5 hover:bg-white/5 hover:text-white"}`}
            >
              <Icon
                name={i.icon}
                className={`h-[18px] w-[18px] ${active ? "text-cyan-300" : "text-slate-500 group-hover:text-slate-300"}`}
              />
              {i.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 p-4">
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white"
        >
          <Icon name="settings" className="h-[18px] w-[18px]" />
          Settings
        </Link>
      </div>
    </aside>
  );
}
