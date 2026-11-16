import { getContext, monthlyUsage } from "@/lib/session";
import { PLANS } from "@/lib/plans";

export default async function Billing() {
  const { supabase, user, profile, plan } = (await getContext())!;
  const used = await monthlyUsage(supabase, user.id);
  const status = profile?.subscription_status ?? "none";
  return (
    <div className="space-y-8">
      <div><h1 className="text-4xl">Billing</h1><p className="text-ink2">Plans are billed monthly through Selar.</p></div>
      <div className="card p-6">
        <p className="label">Current plan</p>
        <p className="serif text-3xl">{plan.name}</p>
        <p className="text-sm text-ink2 mt-1">Subscription status: <strong>{status === "none" ? "free plan" : status}</strong>
          {profile?.plan_activated_at && <> · activated {new Date(profile.plan_activated_at).toLocaleDateString()}</>}</p>
        <p className="text-sm mt-3">{used} of {plan.aiActions} AI actions used this month.</p>
      </div>
      <div className="card p-5 bg-paper2 text-sm text-ink2">
        Check out with the same email as this account (<strong className="text-ink">{user.email}</strong>). Your plan switches on when Selar confirms payment to JurisPilot. Returning from the payment page does not activate it, so allow a few minutes and refresh.
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        {[PLANS.pro, PLANS.firm].map((p) => (
          <div key={p.id} className="card p-6 flex flex-col">
            <h2 className="text-2xl">{p.name}</h2>
            <p className="serif text-4xl mt-2">${p.price}<span className="text-base text-ink2"> / month</span></p>
            <ul className="mt-4 space-y-1 text-sm flex-1 list-disc ml-4">{p.features.map((f) => <li key={f}>{f}</li>)}</ul>
            {plan.id === p.id ? <p className="mt-5 text-sm text-brand font-medium">Your current plan</p> :
              <a href={p.checkoutUrl} target="_blank" rel="noopener noreferrer" className="underline mt-5 font-medium text-brand">Checkout: {p.name}</a>}
          </div>
        ))}
      </div>
      <p className="text-xs text-ink2">Plan changes take effect once Selar confirms the payment.</p>
    </div>
  );
}
