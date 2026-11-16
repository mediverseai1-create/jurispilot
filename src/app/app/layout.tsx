import Link from "next/link";
import { redirect } from "next/navigation";
import { getContext, monthlyUsage } from "@/lib/session";
import { Logo } from "@/components/site";
import { signOut } from "./actions";

const nav = [
  ["/app", "Dashboard"], ["/app/assistant", "Assistant"], ["/app/vault", "Vault"],
  ["/app/workflows", "Workflows"], ["/app/matters", "Matters"], ["/app/billing", "Billing"], ["/app/settings", "Settings"],
];

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const ctx = await getContext();
  if (!ctx) redirect("/login");
  const used = await monthlyUsage(ctx.supabase, ctx.user.id);
  return (
    <div className="flex-1 md:grid md:grid-cols-[230px_1fr]">
      <aside className="border-b md:border-b-0 md:border-r border-line bg-paper2 md:min-h-screen p-4 md:p-5">
        <Logo />
        <nav className="mt-4 md:mt-8 flex md:flex-col gap-1 overflow-x-auto text-sm">
          {nav.map(([h, l]) => <Link key={h} href={h} className="px-3 py-2 rounded hover:bg-paper whitespace-nowrap">{l}</Link>)}
          <form action={signOut}><button className="px-3 py-2 rounded hover:bg-paper whitespace-nowrap text-left">Log out</button></form>
        </nav>
        <div className="hidden md:block mt-8 text-xs text-ink2 space-y-1">
          <p className="font-medium text-ink">{ctx.plan.name} plan</p>
          <p>{used} / {ctx.plan.aiActions} AI actions this month</p>
          
        </div>
      </aside>
      <div className="p-5 md:p-10 max-w-5xl w-full">{children}</div>
    </div>
  );
}
