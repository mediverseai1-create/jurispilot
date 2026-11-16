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

const steps = [
  ["01", "Load the document", "Upload a PDF, TXT or MD file, or paste the text. JurisPilot extracts the text, stores the original in a private bucket and files it under the matter."],
  ["02", "Select the workflow", "Choose contract review, clause extraction, document summary or memo drafting, and state your position, for example that you act for the supplier."],
  ["03", "Read ranked findings", "The AI returns a summary and itemised findings ordered by severity, each with the exact quote from the document and a suggested revision."],
  ["04", "Approve and move on", "A lawyer reviews, edits and approves. The run stays saved against the document so the trail is there when someone asks."],
];

const modules = [
  ["Assistant", "Put questions to the AI across up to five documents at once. Answers are structured, quote the source, and say so when the documents do not contain the answer."],
  ["Vault", "One private library for agreements, pleadings and correspondence, organised by matter, with text extracted automatically on upload."],
  ["Workflows", "Four repeatable analyses, each saved with its result. Run the same review across a stack of agreements and compare the findings."],
  ["Matters", "Keep documents, conversations and workflow runs attached to the engagement they belong to, so context never leaves the file."],
];

const useCases = [
  ["Vendor and supplier paper", "Triage inbound agreements at volume and escalate only the ones that deviate from policy."],
  ["Due diligence", "Extract term, change-of-control, assignment and liability provisions across a data room and compare them in one view."],
  ["NDA and standard-form review", "Clear routine agreements in minutes and surface the clauses that need a lawyer."],
  ["Internal memos", "Generate a first draft with question presented, facts, analysis and recommendation, ready for partner edit."],
  ["Renewals and obligations", "Pull dates, notice periods and payment terms out of live contracts so nothing lapses by accident."],
  ["Dispute preparation", "Summarise long documents quickly and keep chronology and key terms to hand."],
];

const trust = [
  ["Private by design", "Each account sees only its own documents. Access is enforced in the database with row-level security, not only in the interface."],
  ["Sourced, not asserted", "Findings quote the document. If a quote cannot be matched to the source text, it is removed and the finding says so."],
  ["Human in control", "All output is a draft for professional review. Limitations are listed alongside every result, and nothing is sent anywhere automatically."],
  ["Deterministic where it counts", "Plan limits, usage counts and billing status are computed by the platform, not estimated by a model."],
];

const faq = [
  ["Does JurisPilot replace lawyers?", "No. It performs the first pass: reading, extraction, ranking and drafting. A qualified professional reviews and approves the output before anyone relies on it."],
  ["What file types does the Vault accept?", "PDF files with a text layer, plain text and Markdown, or text pasted directly. Scanned PDFs without a text layer are rejected rather than misread."],
  ["How are findings kept honest?", "Every finding is asked to carry a verbatim quote. The platform checks each quote against the document text and strips any it cannot match."],
  ["Who can see our documents?", "Only the account that uploaded them. Isolation is enforced at the database level, and originals are held in a private storage bucket."],
  ["How is usage measured?", "Each plan includes a monthly allowance of AI actions and a document limit. Consumption is shown on the dashboard and the billing page."],
  ["How does billing work?", "Plans are billed monthly in USD through Selar. A paid plan switches on when Selar confirms the payment to JurisPilot."],
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

      <section className="max-w-6xl mx-auto px-5 pt-24">
        <h2 className="text-4xl md:text-5xl max-w-3xl">From document to decision in four steps.</h2>
        <div className="mt-10 grid md:grid-cols-4 gap-6">
          {steps.map(([n, t, d]) => (
            <div key={n} className="border-t-2 border-brand pt-4"><p className="serif text-3xl text-accent">{n}</p><h3 className="text-xl mt-2">{t}</h3><p className="mt-2 text-sm text-ink2">{d}</p></div>
          ))}
        </div>
      </section>

      <section className="bg-paper2 border-y border-line mt-24">
        <div className="max-w-6xl mx-auto px-5 py-16">
          <h2 className="text-4xl md:text-5xl max-w-3xl">Four modules, one connected workspace.</h2>
          <div className="mt-10 grid md:grid-cols-2 gap-5">
            {modules.map(([t, d]) => (<div key={t} className="card p-7"><h3 className="text-2xl">{t}</h3><p className="mt-2 text-ink2">{d}</p></div>))}
          </div>
          <Link href="/product" className="underline mt-8 inline-block">Explore the platform</Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 pt-24">
        <h2 className="text-4xl md:text-5xl max-w-3xl">Deployed where document volume meets risk.</h2>
        <div className="mt-10 grid sm:grid-cols-2 md:grid-cols-3 gap-5">
          {useCases.map(([t, d]) => (<div key={t} className="border border-line rounded-lg p-6"><h3 className="text-xl">{t}</h3><p className="mt-2 text-sm text-ink2">{d}</p></div>))}
        </div>
        <Link href="/solutions" className="underline mt-8 inline-block">See solutions by team</Link>
      </section>

      <section className="max-w-6xl mx-auto px-5 pt-24">
        <div className="bg-brand text-white rounded-lg p-10 md:p-14">
          <h2 className="text-3xl md:text-4xl max-w-2xl">Control, sourcing and privacy are part of the architecture.</h2>
          <div className="mt-10 grid sm:grid-cols-2 gap-8">
            {trust.map(([t, d]) => (<div key={t}><h3 className="text-xl">{t}</h3><p className="mt-2 text-sm text-white/70">{d}</p></div>))}
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-5 pt-24">
        <h2 className="text-4xl md:text-5xl">Questions from legal and operations leaders.</h2>
        <div className="mt-8 divide-y divide-line border-y border-line">
          {faq.map(([q, a]) => (
            <details key={q} className="py-5 group"><summary className="cursor-pointer text-lg serif list-none flex justify-between gap-4">{q}<span aria-hidden="true" className="text-accent group-open:rotate-45 transition-transform">+</span></summary><p className="mt-3 text-ink2">{a}</p></details>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 pt-24">
        <div className="bg-paper2 border border-line rounded-lg p-10 md:p-14">
          <h2 className="text-3xl md:text-4xl max-w-xl">Put the next agreement in the queue through JurisPilot.</h2>
          <p className="mt-3 text-ink2 max-w-xl">Upload it, select a workflow, and review ranked findings with sources.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/signup" className="btn btn-primary">Create account</Link>
            <Link href="/login" className="btn btn-ghost">Log in</Link>
          </div>
        </div>
      </section>
    </Shell>
  );
}
