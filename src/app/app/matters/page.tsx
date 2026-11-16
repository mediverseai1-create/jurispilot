import { getContext } from "@/lib/session";
import { createMatter, deleteMatter } from "../actions";

export default async function Matters() {
  const { supabase } = (await getContext())!;
  const { data: matters } = await supabase.from("matters").select("id,name,client,created_at,documents(count)").order("created_at", { ascending: false });
  return (
    <div className="space-y-8">
      <div><h1 className="text-4xl">Matters</h1><p className="text-ink2">Group documents by client engagement.</p></div>
      <form action={createMatter} className="card p-5 grid sm:grid-cols-[1fr_1fr_auto] gap-3 items-end">
        <div><label className="label" htmlFor="name">Matter name</label><input id="name" name="name" required maxLength={200} className="input" /></div>
        <div><label className="label" htmlFor="client">Client (optional)</label><input id="client" name="client" maxLength={200} className="input" /></div>
        <button className="btn btn-primary">Create</button>
      </form>
      <div className="card divide-y divide-line">
        {matters?.length ? matters.map((m) => (
          <div key={m.id} className="p-4 flex justify-between items-center">
            <div><p className="font-medium">{m.name}</p><p className="text-xs text-ink2">{m.client || "No client"} · {(m.documents as unknown as { count: number }[])?.[0]?.count ?? 0} documents</p></div>
            <form action={deleteMatter}><input type="hidden" name="id" value={m.id} /><button className="text-sm text-danger underline">Delete</button></form>
          </div>)) : <p className="p-6 text-sm text-ink2">No matters yet.</p>}
      </div>
    </div>
  );
}
