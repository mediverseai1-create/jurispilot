import { Shell } from "@/components/site";

export default function About() {
  return (
    <Shell>
      <section className="max-w-3xl mx-auto px-5 pt-20">
        <h1 className="text-5xl">Legal capacity should scale with the business, not with headcount.</h1>
        <div className="mt-8 space-y-5 text-lg text-ink2">
          <p>JurisPilot builds AI infrastructure for legal teams. Our models take on first-pass reading, extraction and drafting so that qualified lawyers spend their hours on advice and judgment.</p>
          <p>We design for accountability. Findings quote the source, limitations are stated with every result, and all output is a draft until a professional approves it.</p>
          <p>JurisPilot is an independent company. It is not a law firm, does not give legal advice, and is not affiliated with any other legal technology provider.</p>
        </div>
        <h2 className="text-3xl mt-14">Principles we build to</h2>
        <ul className="mt-5 space-y-4 text-ink2 list-disc ml-5 text-lg">
          <li>Sourced output: every finding points back to the text it came from.</li>
          <li>Stated limits: the platform says what it could not read or verify.</li>
          <li>Professional control: lawyers approve, edit and decide.</li>
          <li>Clear pricing: published rates, published limits, no hidden tiers.</li>
        </ul>
      </section>
    </Shell>
  );
}
