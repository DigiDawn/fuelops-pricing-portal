import Link from "next/link";
import { Icon } from "./icons";
import type { PortalRole } from "@/lib/types";
export function MobileNav({ role }: { role: PortalRole }) {
  const items = [
    { href: "/dashboard", label: "Home", icon: "home" as const },
    { href: "/dashboard/prices", label: "Prices", icon: "droplet" as const },
    { href: "/dashboard/sites", label: "Sites", icon: "map" as const },
    {
      href: role === "viewer" ? "/dashboard/alerts" : "/dashboard/approvals",
      label: role === "viewer" ? "Alerts" : "Approve",
      icon: role === "viewer" ? ("alert" as const) : ("check" as const),
    },
  ];
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-slate-200 bg-white px-2 py-2 lg:hidden">
      {items.map((i) => (
        <Link
          prefetch={false}
          key={i.href}
          href={i.href}
          className="flex flex-col items-center gap-1 rounded-lg py-1.5 text-[11px] font-medium text-slate-500"
        >
          <Icon name={i.icon} className="h-5 w-5" />
          {i.label}
        </Link>
      ))}
    </nav>
  );
}
