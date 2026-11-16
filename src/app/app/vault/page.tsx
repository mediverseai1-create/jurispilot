import { getContext } from "@/lib/session";
import { deleteDocument } from "../actions";
import Uploader from "./uploader";

export default async function Vault() {
  const { supabase, plan } = (await getContext())!;
  const [{ data: docs }, { data: matters }] = await Promise.all([
    supabase.from("documents").select("id,title,char_count,created_at,matters(name)").order("created_at", { ascending: false }),
    supabase.from("matters").select("id,name").order("name"),
  ]);
  return (
    <div className="space-y-8">
      <div><h1 className="text-4xl">Vault</h1>
        <p className="text-ink2">{docs?.length ?? 0} of {plan.documents} documents. Accepts PDF (with a text layer), TXT and MD, or pasted text.</p></div>
      <Uploader matters={matters ?? []} />
      <div className="card divide-y divide-line">
        {docs?.length ? docs.map((d) => (
          <div key={d.id} className="p-4 flex items-center justify-between gap-3">
            <div className="min-w-0"><p className="font-medium truncate">{d.title}</p>
              <p className="text-xs text-ink2">{d.char_count.toLocaleString()} characters · {(d.matters as unknown as { name: string } | null)?.name ?? "No matter"} · {new Date(d.created_at).toLocaleDateString()}</p></div>
            <form action={deleteDocument}><input type="hidden" name="id" value={d.id} /><button className="text-sm text-danger underline">Delete</button></form>
          </div>)) : <p className="p-6 text-sm text-ink2">No documents yet. Upload your first one above.</p>}
      </div>
    </div>
  );
}
