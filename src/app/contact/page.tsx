import { Shell } from "@/components/site";

export default function Contact() {
  return (
    <Shell>
      <section className="max-w-3xl mx-auto px-5 pt-20">
        <h1 className="text-5xl">Contact</h1>
        <p className="mt-6 text-lg text-ink2">For support, billing questions or plan changes, email us from the address on your JurisPilot account.</p>
        <p className="mt-4"><a className="underline" href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@example.com"}`}>{process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@example.com"}</a></p>
        <p className="mt-2 text-sm text-ink2">Set NEXT_PUBLIC_SUPPORT_EMAIL to your real support address.</p>
      </section>
    </Shell>
  );
}
