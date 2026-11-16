import Link from "next/link";
import { Shell } from "@/components/site";

const engine = [
  ["Analyze", "The AI reads every clause of every agreement in the queue and extracts parties, term, liability caps, termination rights and governing law into structured records."],
  ["Predict", "It ranks each provision by risk severity against the position your team is taking, so reviewers start with the clauses most likely to cost money."],
  ["Decide", "Each finding carries the verbatim source quote, the reasoning and a recommended revision. Partners approve or reject. Nothing leaves the building unreviewed."],
  ["Automate", "Review, extraction, summarisation and memo drafting run as repeatable workflows, saved against the matter and the document."],
];

const outcomes = [
  ["Speed", "First-pass review moves from hours of reading to minutes of review, so deals and disputes keep their momentum."],
  ["Cost", "Senior time goes to judgment calls. The AI absorbs the volume work that currently consumes associate hours."],
  ["Risk", "Every clause is checked, every time. Quotes that cannot be matched to the source text are removed before you see them."],
  ["Decisions", "Leaders see usage, throughput and findings across matters, and decide where capacity should go."],
];

export default function Home() {
  return (
    <Shell>
      <section className="max-w-6xl mx-auto px-5 pt-20 pb-16 md:pt-28">
        <p className="text-sm tracking-widest uppercase text-accent mb-5">The AI operating layer for legal teams</p>
        <h1 className="text-5xl md:text-7xl leading-[1.05] max-w-4xl">AI that reads every contract, ranks the risk and drafts the response.</h1>
        <p className="mt-6 text-lg text-ink2 max-w-2xl">JurisPilot is the AI engine for legal departments and law firms. It analyzes your documents, scores exposure, and automates the review work that slows deals, inflates cost and hides risk.</p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link href="/signup" className="btn btn-primary">Sign up</Link>
          <Link href="/login" className="btn btn-ghost">Log in</Link>
        </div>
      </section>

      <section className="bg-paper2 border-y border-line">
        <div className="max-w-6xl mx-auto px-5 py-16">
          <h2 className="text-3xl md:text-4xl max-w-2xl">Built to move four numbers that leadership watches.</h2>
          <div className="mt-10 grid sm:grid-cols-2 md:grid-cols-4 gap-8">
            {outcomes.map(([t, d]) => (<div key={t}><h3 className="text-2xl">{t}</h3><p className="mt-2 text-ink2 text-sm">{d}</p></div>))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 pt-20">
        <h2 className="text-4xl md:text-5xl max-w-3xl">The AI is the engine, not an add-on.</h2>
        <p className="mt-4 text-ink2 max-w-2xl">Every module in JurisPilot runs on the same model layer and the same document library, so work compounds across matters instead of restarting in each tool.</p>
        <div className="mt-10 grid md:grid-cols-2 gap-5">
          {engine.map(([t, d]) => (
            <div key={t} className="card p-7"><h3 className="text-2xl">{t}</h3><p className="mt-2 text-ink2">{d}</p></div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 pt-20">
        <div className="bg-brand text-white rounded-lg p-10 md:p-14">
          <h2 className="text-3xl md:text-4xl max-w-xl">Put the next agreement in the queue through JurisPilot.</h2>
          <p className="mt-3 text-white/70 max-w-xl">Upload it, select a workflow, and review ranked findings with sources.</p>
          <Link href="/signup" className="btn bg-white text-brand mt-7">Create account</Link>
        </div>
      </section>
    </Shell>
  );
}
