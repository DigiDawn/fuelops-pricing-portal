import Link from "next/link";
import { Icon } from "@/components/dashboard/icons";
export function PublicHeader() {
  return (
    <header className="border-b border-slate-100 bg-white">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-950 text-cyan-300">
            <Icon name="droplet" className="h-5 w-5" />
          </div>
          <div>
            <p className="font-bold">FuelOps Portal</p>
            <p className="text-xs text-slate-500">Pricing operations</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          <Link href="/solutions" className="hover:text-slate-950">
            Solutions
          </Link>
          <Link href="/company" className="hover:text-slate-950">
            Company
          </Link>
          <Link href="/contact" className="hover:text-slate-950">
            Contact
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-semibold text-slate-700"
          >
            Sign in
          </Link>
          <Link
            href="/login"
            className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white"
          >
            Open portal
          </Link>
        </div>
      </div>
    </header>
  );
}
