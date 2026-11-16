import Link from "next/link";
import { Shell } from "@/components/site";

const sections = [
  ["Assistant", "An AI analyst that answers questions across up to five selected documents. Responses are structured, quote the source text, and state plainly when the documents do not contain the answer. Every conversation is retained."],
  ["Vault", "A private document library with automatic text extraction from PDF, TXT and MD files. Originals are stored in an isolated bucket and organised by matter. Scanned PDFs without a text layer are rejected rather than misread."],
  ["Workflows", "Contract review, clause extraction, document summary and memo drafting. Each run returns a summary, itemised findings ranked by severity, and a statement of limitations. Quotes are verified against the document before display."],
  ["Matters", "Matter-level organisation that keeps documents, conversations and workflow runs attached to the engagement they belong to."],
  ["Usage and plan controls", "Each plan carries a monthly allowance of AI actions and a document limit. Consumption is visible to the team on the dashboard and the billing page."],
];

export default function Product() {
  return (
    <Shell>
      <section className="max-w-4xl mx-auto px-5 pt-20">
        <h1 className="text-5xl">One AI platform for the full document lifecycle.</h1>
        <p className="mt-5 text-lg text-ink2">Five modules, one model layer, one library. Findings from one module feed the next.</p>
        <div className="mt-12 divide-y divide-line border-y border-line">
          {sections.map(([t, d]) => (
            <div key={t} className="py-8 grid md:grid-cols-3 gap-4"><h2 className="text-2xl">{t}</h2><p className="md:col-span-2 text-ink2">{d}</p></div>
          ))}
        </div>
        <Link href="/signup" className="btn btn-primary mt-10">Sign up</Link>
      </section>
    </Shell>
  );
}
