import Link from "next/link";
import { Shell } from "@/components/site";

const modules = [
  ["Assistant", "Ask questions in plain language and get structured answers drawn from the documents you select, with the source text quoted back to you."],
  ["Vault", "Keep contracts, pleadings and correspondence in one private library, organised by matter and searchable by the Assistant."],
  ["Workflows", "Run repeatable reviews: contract risk review, clause extraction, summaries and first-draft memos, each saved with its result."],
  ["Matters", "Group documents, conversations and workflow runs by client matter so work stays together."],
];

export default function Home() {
  return (
    <Shell>
      <section className="max-w-6xl mx-auto px-5 pt-20 pb-16 md:pt-28">
        <p className="text-sm tracking-widest uppercase text-accent mb-5">AI workspace for legal teams</p>
        <h1 className="text-5xl md:text-7xl leading-[1.05] max-w-4xl">Review faster. Draft sooner. Stay in control of the work.</h1>
        <p className="mt-6 text-lg text-ink2 max-w-2xl">JurisPilot gives lawyers an assistant that reads the documents you upload, flags what matters, and shows its sources, so you spend your time on judgment rather than first-pass reading.</p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link href="/signup" className="btn btn-primary">Start free</Link>
          <Link href="/pricing" className="btn btn-ghost">See pricing</Link>
        </div>
        <p className="mt-4 text-sm text-ink2">No card needed for the Starter plan.</p>
      </section>

      <section className="bg-paper2 border-y border-line">
        <div className="max-w-6xl mx-auto px-5 py-16 grid md:grid-cols-3 gap-10">
          {[["Grounded", "Findings quote your documents. Quotes that cannot be matched to the source text are removed."],
            ["Private", "Your documents are stored in a private library and visible only to your account."],
            ["Reviewable", "Every result is a draft for a lawyer to check, with limitations listed alongside it."]].map(([t, d]) => (
            <div key={t}><h3 className="text-2xl">{t}</h3><p className="mt-2 text-ink2">{d}</p></div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 pt-20">
        <h2 className="text-4xl md:text-5xl max-w-2xl">One workspace, connected end to end</h2>
        <div className="mt-10 grid md:grid-cols-2 gap-5">
          {modules.map(([t, d]) => (
            <div key={t} className="card p-7"><h3 className="text-2xl">{t}</h3><p className="mt-2 text-ink2">{d}</p></div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 pt-20">
        <div className="bg-brand text-white rounded-lg p-10 md:p-14">
          <h2 className="text-3xl md:text-4xl max-w-xl">Put your next contract through JurisPilot.</h2>
          <p className="mt-3 text-white/70 max-w-xl">Upload a document, pick a workflow, and read the findings in minutes.</p>
          <Link href="/signup" className="btn bg-white text-brand mt-7">Create your account</Link>
        </div>
      </section>
    </Shell>
  );
}
