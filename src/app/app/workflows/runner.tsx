"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const WF = [
  ["contract_review", "Contract review", "Flags risky or one-sided terms with suggested revisions."],
  ["clause_extraction", "Clause extraction", "Pulls out term, liability, governing law and other key clauses."],
  ["document_summary", "Document summary", "A concise overview with obligations and deadlines."],
  ["draft_memo", "Draft memo", "A first-draft internal memo based on the document and your note."],
];

export default function Runner({ docs }: { docs: { id: string; title: string }[] }) {
  const router = useRouter();
  const [wf, setWf] = useState("contract_review");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function run(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const documentId = String(fd.get("documentId") ?? "");
    if (!documentId) return setErr("Choose a document first.");
    setErr(""); setBusy(true);
    try {
      const r = await fetch("/api/workflows", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workflow: wf, documentId, note: String(fd.get("note") ?? "") }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Run failed.");
      router.push(`/app/workflows/${j.runId}`);
    } catch (x) { setErr(x instanceof Error ? x.message : "Run failed."); setBusy(false); }
  }

  if (docs.length === 0) return <div className="card p-6 text-sm text-ink2">Add a document to the Vault before running a workflow.</div>;
  return (
    <form onSubmit={run} className="card p-5 space-y-4">
      <div className="grid sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Workflow">
        {WF.map(([id, t, d]) => (
          <button type="button" key={id} role="radio" aria-checked={wf === id} onClick={() => setWf(id)}
            className={`text-left p-3 rounded border ${wf === id ? "border-brand bg-paper2" : "border-line"}`}>
            <span className="font-medium">{t}</span><span className="block text-xs text-ink2">{d}</span></button>))}
      </div>
      <div><label className="label" htmlFor="documentId">Document</label>
        <select id="documentId" name="documentId" className="input" defaultValue="">
          <option value="" disabled>Select…</option>{docs.map((d) => <option key={d.id} value={d.id}>{d.title}</option>)}</select></div>
      <div><label className="label" htmlFor="note">Instructions (optional, e.g. “we are the supplier”)</label>
        <textarea id="note" name="note" rows={2} maxLength={2000} className="input" /></div>
      {err && <p role="alert" className="text-sm text-danger">{err}</p>}
      <button className="btn btn-primary" disabled={busy}>{busy ? "Analysing… this can take a minute" : "Run workflow"}</button>
    </form>
  );
}
