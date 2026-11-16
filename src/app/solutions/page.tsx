import Link from "next/link";
import { Shell } from "@/components/site";

const s = [
  ["Law firms", "Standardise first-pass review across every matter and partner. Each run is recorded against the document it was applied to, giving the firm an auditable review trail."],
  ["In-house legal departments", "Triage vendor paper at volume. The AI extracts term, liability caps and governing law into a consistent record, so counsel negotiate only what deviates from policy."],
  ["Transactional teams", "Extract and compare clauses across agreements in a deal and generate first-draft internal memos from the documents in the data room."],
  ["Operations and procurement", "Give business teams a defined path to legal review. Contracts enter the queue, ranked findings come back, and legal approves."],
];

export default function Solutions() {
  return (
    <Shell>
      <section className="max-w-5xl mx-auto px-5 pt-20">
        <h1 className="text-5xl">Deployed where contract volume meets risk.</h1>
        <div className="mt-12 grid md:grid-cols-2 gap-5">
          {s.map(([t, d]) => (<div key={t} className="card p-7"><h2 className="text-2xl">{t}</h2><p className="mt-2 text-ink2">{d}</p></div>))}
        </div>
        <Link href="/signup" className="btn btn-primary mt-10">Sign up</Link>
      </section>
    </Shell>
  );
}
