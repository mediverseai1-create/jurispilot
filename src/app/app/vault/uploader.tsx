"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Uploader({ matters }: { matters: { id: string; name: string }[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");
    const form = e.currentTarget;
    const fd = new FormData(form);
    const file = fd.get("file") as File;
    if ((!file || file.size === 0) && !String(fd.get("text") ?? "").trim()) return setErr("Choose a file or paste some text.");
    setBusy(true);
    try {
      const r = await fetch("/api/documents", { method: "POST", body: fd });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Upload failed.");
      form.reset();
      router.refresh();
    } catch (x) { setErr(x instanceof Error ? x.message : "Upload failed."); }
    finally { setBusy(false); }
  }

  return (
    <form onSubmit={submit} className="card p-5 space-y-3">
      <h2 className="text-xl">Add a document</h2>
      <div className="grid sm:grid-cols-2 gap-3">
        <div><label className="label" htmlFor="file">File (PDF, TXT, MD · max 8 MB)</label><input id="file" name="file" type="file" accept=".pdf,.txt,.md" className="input" /></div>
        <div><label className="label" htmlFor="title">Title (optional)</label><input id="title" name="title" maxLength={200} className="input" /></div>
      </div>
      <div><label className="label" htmlFor="text">…or paste text</label><textarea id="text" name="text" rows={4} className="input" /></div>
      <div><label className="label" htmlFor="matterId">Matter</label>
        <select id="matterId" name="matterId" className="input"><option value="">None</option>{matters.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</select></div>
      {err && <p role="alert" className="text-sm text-danger">{err}</p>}
      <button className="btn btn-primary" disabled={busy}>{busy ? "Uploading…" : "Add to Vault"}</button>
    </form>
  );
}
