import { getAuthContext } from "@/lib/auth";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { MobileNav } from "@/components/dashboard/mobile-nav";
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile, supabase } = await getAuthContext();
  const { count } = await supabase
    .from("portal_notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", profile.id)
    .eq("is_read", false);
  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <Sidebar role={profile.portal_role} />
      <div className="min-w-0 flex-1">
        <Topbar profile={profile} unread={count || 0} />
        <main className="mx-auto max-w-[1600px] px-5 py-7 pb-24 sm:px-7 lg:pb-10">
          {children}
        </main>
      </div>
      <MobileNav role={profile.portal_role} />
    </div>
  );
}
