import Link from "next/link";
import { Shell } from "@/components/site";

const s = [
  ["Solo practitioners", "Get a first read on incoming contracts and keep a searchable library of your own work product without buying enterprise software."],
  ["Small and mid-size firms", "Standardise first-pass review across matters, with every run saved against the document it was run on."],
  ["In-house counsel", "Triage vendor paper and pull key terms such as term, liability caps and governing law into a consistent summary."],
  ["Transactional teams", "Extract and compare clauses across agreements and draft internal memos from the documents in front of you."],
];

export default function Solutions() {
  return (
    <Shell>
      <section className="max-w-5xl mx-auto px-5 pt-20">
        <h1 className="text-5xl">Built for the way legal work actually flows</h1>
        <div className="mt-12 grid md:grid-cols-2 gap-5">
          {s.map(([t, d]) => (<div key={t} className="card p-7"><h2 className="text-2xl">{t}</h2><p className="mt-2 text-ink2">{d}</p></div>))}
        </div>
        <Link href="/signup" className="btn btn-primary mt-10">Start free</Link>
      </section>
    </Shell>
  );
}
