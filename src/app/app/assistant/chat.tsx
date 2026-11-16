"use client";
import { useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

export default function Chat({ docs, initial, conversationId }: {
  docs: { id: string; title: string }[]; initial: Msg[]; conversationId?: string;
}) {
  const [msgs, setMsgs] = useState<Msg[]>(initial);
  const [cid, setCid] = useState(conversationId);
  const [sel, setSel] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const ta = useRef<HTMLTextAreaElement>(null);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const message = ta.current?.value.trim() ?? "";
    if (!message || busy) return;
    setErr(""); setBusy(true);
    setMsgs((m) => [...m, { role: "user", content: message }]);
    if (ta.current) ta.current.value = "";
    try {
      const r = await fetch("/api/assistant", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: cid, message, documentIds: sel }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Request failed.");
      setCid(j.conversationId);
      setMsgs((m) => [...m, { role: "assistant", content: j.answer }]);
    } catch (x) {
      setErr(x instanceof Error ? x.message : "Request failed.");
      setMsgs((m) => m.slice(0, -1));
      if (ta.current) ta.current.value = message;
    } finally { setBusy(false); }
  }

  return (
    <div className="space-y-4">
      <fieldset className="card p-4">
        <legend className="label px-1">Documents to use (up to 5)</legend>
        {docs.length === 0 ? <p className="text-sm text-ink2">Your Vault is empty. Add a document to ground answers in your own material.</p> : (
          <div className="flex flex-wrap gap-2">{docs.map((d) => {
            const on = sel.includes(d.id);
            return <button type="button" key={d.id} aria-pressed={on}
              onClick={() => setSel((s) => on ? s.filter((x) => x !== d.id) : s.length < 5 ? [...s, d.id] : s)}
              className={`text-sm px-3 py-1 rounded-full border ${on ? "bg-brand text-white border-brand" : "border-line"}`}>{d.title}</button>;
          })}</div>)}
      </fieldset>
      <div className="space-y-3" aria-live="polite">
        {msgs.length === 0 && <p className="text-ink2 text-sm">Try: “What are the termination rights in this agreement?”</p>}
        {msgs.map((m, i) => (
          <div key={i} className={`card p-4 ${m.role === "user" ? "bg-paper2" : ""}`}>
            <p className="label">{m.role === "user" ? "You" : "JurisPilot"}</p>
            <div className="prose-ai text-[0.95rem]">{m.content}</div>
          </div>))}
        {busy && <p className="text-sm text-ink2">Reading and drafting…</p>}
      </div>
      {err && <p role="alert" className="text-sm text-danger">{err}</p>}
      <form onSubmit={send} className="flex gap-2 items-end">
        <textarea ref={ta} rows={3} maxLength={8000} className="input" placeholder="Ask a question…" aria-label="Your question"
          onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) send(e); }} />
        <button className="btn btn-primary" disabled={busy}>Send</button>
      </form>
    </div>
  );
}
