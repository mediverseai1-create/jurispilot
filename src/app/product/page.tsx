import Link from "next/link";
import { Shell } from "@/components/site";

const sections = [
  ["Assistant", "A conversation that can be anchored to up to five documents at a time. Answers are structured, quote the source, and say so when the documents do not contain the answer. Every conversation is saved."],
  ["Vault", "Upload PDF or text files, or paste text. JurisPilot extracts the text, stores the original in a private bucket and keeps the library organised by matter. Scanned PDFs without a text layer are rejected rather than silently misread."],
  ["Workflows", "Contract review, clause extraction, document summary and draft memo. Each run returns a summary, itemised findings with severity, and a list of limitations. Quotes are checked against the document text before they are shown."],
  ["Matters", "Create a matter for each client engagement and attach documents to it."],
  ["Usage and billing", "Each plan includes a monthly allowance of AI actions and a document limit. Your current usage is always visible on the dashboard and billing page."],
];

export default function Product() {
  return (
    <Shell>
      <section className="max-w-4xl mx-auto px-5 pt-20">
        <h1 className="text-5xl">What is inside JurisPilot</h1>
        <p className="mt-5 text-lg text-ink2">A small set of modules that work together on the same documents.</p>
        <div className="mt-12 divide-y divide-line border-y border-line">
          {sections.map(([t, d]) => (
            <div key={t} className="py-8 grid md:grid-cols-3 gap-4"><h2 className="text-2xl">{t}</h2><p className="md:col-span-2 text-ink2">{d}</p></div>
          ))}
        </div>
        <Link href="/signup" className="btn btn-primary mt-10">Start free</Link>
      </section>
    </Shell>
  );
}
