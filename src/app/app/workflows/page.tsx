import Link from "next/link";
import { getContext } from "@/lib/session";
import Runner from "./runner";

export default async function Workflows() {
  const { supabase } = (await getContext())!;
  const [{ data: docs }, { data: runs }] = await Promise.all([
    supabase.from("documents").select("id,title").order("created_at", { ascending: false }),
    supabase.from("workflow_runs").select("id,workflow,created_at,documents(title)").order("created_at", { ascending: false }).limit(20),
  ]);
  return (
    <div className="space-y-8">
      <div><h1 className="text-4xl">Workflows</h1><p className="text-ink2">Run a repeatable review on a document in your Vault. Each run is saved.</p></div>
      <Runner docs={docs ?? []} />
      <div className="card p-5"><h2 className="text-xl mb-3">History</h2>
        {runs?.length ? runs.map((r) => (
          <Link key={r.id} href={`/app/workflows/${r.id}`} className="flex justify-between py-2 border-t border-line text-sm hover:underline">
            <span>{r.workflow.replace("_", " ")} · {(r.documents as unknown as { title: string } | null)?.title ?? "deleted document"}</span>
            <span className="text-ink2">{new Date(r.created_at).toLocaleDateString()}</span></Link>
        )) : <p className="text-sm text-ink2">No runs yet.</p>}</div>
    </div>
  );
}
