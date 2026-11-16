import Link from "next/link";
import { notFound } from "next/navigation";
import { getContext } from "@/lib/session";

type Result = {
  summary: string; caveats: string[];
  items: { title: string; severity: string; quote: string; explanation: string; suggestion: string }[];
  sections: { heading: string; body: string }[];
};
const sev: Record<string, string> = { high: "bg-danger text-white", medium: "bg-accent text-white", low: "bg-paper2", info: "bg-paper2" };

export default async function Run({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const { supabase } = (await getContext())!;
  const { data: run } = await supabase.from("workflow_runs").select("*,documents(title)").eq("id", id).single();
  if (!run) notFound();
  const r = run.result as Result;
  return (
    <div className="space-y-6">
      <Link href="/app/workflows" className="text-sm underline">← Workflows</Link>
      <div><h1 className="text-4xl capitalize">{run.workflow.replace("_", " ")}</h1>
        <p className="text-ink2 text-sm">{(run.documents as unknown as { title: string } | null)?.title ?? "Deleted document"} · {new Date(run.created_at).toLocaleString()}</p></div>
      <div className="card p-5"><h2 className="text-xl mb-2">Summary</h2><p className="prose-ai">{r.summary}</p></div>
      {r.sections?.map((s, i) => <div key={i} className="card p-5"><h2 className="text-xl mb-2">{s.heading}</h2><p className="prose-ai">{s.body}</p></div>)}
      {r.items?.length > 0 && <div className="space-y-3"><h2 className="text-2xl">Findings</h2>
        {r.items.map((it, i) => (
          <div key={i} className="card p-5"><div className="flex items-center gap-2"><span className={`text-xs px-2 py-0.5 rounded uppercase ${sev[it.severity] ?? sev.info}`}>{it.severity}</span><h3 className="text-lg">{it.title}</h3></div>
            {it.quote && <blockquote className="mt-3 border-l-2 border-accent pl-3 text-sm italic text-ink2">“{it.quote}”</blockquote>}
            <p className="mt-3 text-sm prose-ai">{it.explanation}</p>
            {it.suggestion && <p className="mt-2 text-sm"><strong>Suggestion:</strong> {it.suggestion}</p>}</div>))}</div>}
      <div className="card p-5 bg-paper2"><h2 className="text-lg mb-2">Limitations</h2>
        <ul className="list-disc ml-5 text-sm text-ink2 space-y-1">
          {r.caveats?.map((c, i) => <li key={i}>{c}</li>)}
          <li>AI-generated draft. A qualified professional must review before any reliance. Not legal advice.</li></ul></div>
    </div>
  );
}
