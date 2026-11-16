import { Shell } from "@/components/site";

export default function About() {
  return (
    <Shell>
      <section className="max-w-3xl mx-auto px-5 pt-20">
        <h1 className="text-5xl">About JurisPilot</h1>
        <div className="mt-8 space-y-5 text-lg text-ink2">
          <p>JurisPilot exists to take the first pass of reading off lawyers&apos; desks, so more of their time goes to advice and judgment.</p>
          <p>We build for accountability: findings quote the source, limitations are stated, and everything is a draft until a professional has checked it.</p>
          <p>JurisPilot is an independent product and is not legal advice, a law firm, or affiliated with any other legal technology provider.</p>
        </div>
      </section>
    </Shell>
  );
}
