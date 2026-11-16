import Link from "next/link";
import { Shell } from "@/components/site";
import { PLANS } from "@/lib/plans";

export default function Pricing() {
  return (
    <Shell>
      <section className="max-w-6xl mx-auto px-5 pt-20">
        <h1 className="text-5xl">Pricing priced against the hours it removes.</h1>
        <p className="mt-4 text-ink2 max-w-xl">Published rates in USD, billed monthly through Selar.</p>
        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {Object.values(PLANS).map((p) => (
            <div key={p.id} className={`card p-7 flex flex-col ${p.id === "pro" ? "border-brand border-2" : ""}`}>
              <h2 className="text-3xl">{p.name}</h2>
              <p className="text-ink2 text-sm mt-1">{p.blurb}</p>
              <p className="mt-5"><span className="serif text-5xl">${p.price}</span><span className="text-ink2"> / month</span></p>
              <ul className="mt-6 space-y-2 text-sm flex-1 list-disc ml-4">{p.features.map((f) => <li key={f}>{f}</li>)}</ul>
              <Link href={p.id === "free" ? "/signup" : `/signup?plan=${p.id}`} className={`btn mt-7 ${p.id === "pro" ? "btn-primary" : "btn-ghost"}`}>Sign up</Link>
            </div>
          ))}
        </div>
        <p className="mt-8 text-sm text-ink2 max-w-2xl">Paid plans are activated when Selar confirms the payment. Use the same email at checkout as on your JurisPilot account.</p>
      </section>
    </Shell>
  );
}
