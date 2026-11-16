import Link from "next/link";
import { getContext, monthlyUsage } from "@/lib/session";

export default async function Dashboard() {
  const ctx = (await getContext())!;
  const { supabase, user, profile, plan } = ctx;
  const used = await monthlyUsage(supabase, user.id);
  const [{ count: docs }, { count: matters }, { data: runs }, { data: convs }] = await Promise.all([
    supabase.from("documents").select("id", { count: "exact", head: true }),
    supabase.from("matters").select("id", { count: "exact", head: true }),
    supabase.from("workflow_runs").select("id,workflow,created_at,documents(title)").order("created_at", { ascending: false }).limit(5),
    supabase.from("conversations").select("id,title,created_at").order("created_at", { ascending: false }).limit(5),
  ]);
  const pct = Math.min(100, Math.round((used / plan.aiActions) * 100));
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl">Welcome{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}</h1>
        <p className="text-ink2 mt-1">Here is where your work stands.</p>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="card p-5"><p className="label">AI actions this month</p><p className="serif text-3xl">{used} <span className="text-base text-ink2">/ {plan.aiActions}</span></p>
          <div className="h-1.5 bg-paper2 rounded mt-3"><div className="h-1.5 bg-brand rounded" style={{ width: `${pct}%` }} /></div></div>
        <div className="card p-5"><p className="label">Documents</p><p className="serif text-3xl">{docs ?? 0} <span className="text-base text-ink2">/ {plan.documents}</span></p></div>
        <div className="card p-5"><p className="label">Matters</p><p className="serif text-3xl">{matters ?? 0}</p></div>
      </div>
      {(docs ?? 0) === 0 && (
        <div className="card p-6"><h2 className="text-2xl">Add your first document</h2>
          <p className="text-ink2 mt-1">Add a contract to the Vault, then run a workflow or put questions to the Assistant.</p>
          <Link href="/app/vault" className="underline mt-4 inline-block">Go to the Vault</Link></div>
      )}
      <div className="grid md:grid-cols-2 gap-5">
        <div className="card p-5"><h2 className="text-xl mb-3">Recent workflow runs</h2>
          {runs?.length ? runs.map((r) => (
            <Link key={r.id} href={`/app/workflows/${r.id}`} className="block py-2 border-t border-line text-sm hover:underline">
              {r.workflow.replace("_", " ")} · {(r.documents as unknown as { title: string } | null)?.title ?? "deleted document"}
            </Link>)) : <p className="text-sm text-ink2">No runs yet.</p>}</div>
        <div className="card p-5"><h2 className="text-xl mb-3">Recent conversations</h2>
          {convs?.length ? convs.map((c) => (
            <Link key={c.id} href={`/app/assistant?c=${c.id}`} className="block py-2 border-t border-line text-sm hover:underline">{c.title}</Link>
          )) : <p className="text-sm text-ink2">No conversations yet.</p>}</div>
      </div>
    </div>
  );
}
