import { getContext, monthlyUsage } from "@/lib/session";
import { PLANS } from "@/lib/plans";

export default async function Billing() {
  const { supabase, user, profile, plan } = (await getContext())!;
  const used = await monthlyUsage(supabase, user.id);
  const status = profile?.subscription_status ?? "none";
  return (
    <div className="space-y-8">
      <div><h1 className="text-4xl">Billing</h1><p className="text-ink2">Plans are billed through Selar.</p></div>
      <div className="card p-6">
        <p className="label">Current plan</p>
        <p className="serif text-3xl">{plan.name}</p>
        <p className="text-sm text-ink2 mt-1">Subscription status: <strong>{status === "none" ? "free plan" : status}</strong>
          {profile?.plan_activated_at && <> · activated {new Date(profile.plan_activated_at).toLocaleDateString()}</>}</p>
        <p className="text-sm mt-3">{used} of {plan.aiActions} AI actions used this month.</p>
      </div>
      <div className="card p-5 bg-paper2 text-sm text-ink2">
        <strong className="text-ink">Important:</strong> check out with <strong className="text-ink">{user.email}</strong>. Your plan is switched on when Selar confirms the payment to us. Coming back from the payment page does not activate it, so allow a few minutes. If it has not changed after that, contact support with your receipt.
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        {([PLANS.pro, PLANS.firm]).map((p) => {
          const current = plan.id === p.id;
          return (
            <div key={p.id} className="card p-6 flex flex-col">
              <h2 className="text-2xl">{p.name}</h2>
              <p className="serif text-4xl mt-2">${p.price}<span className="text-base text-ink2"> / month</span></p>
              <ul className="mt-4 space-y-1 text-sm flex-1">{p.features.map((f) => <li key={f}>✓ {f}</li>)}</ul>
              {current ? <p className="mt-5 text-sm text-brand font-medium">Your current plan</p> :
                <a href={p.checkoutUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-5">
                  {plan.price > p.price ? "Switch to" : "Upgrade to"} {p.name}</a>}
            </div>);
        })}
      </div>
      <p className="text-xs text-ink2">To downgrade or cancel, contact support. Downgrades take effect when your paid period ends.</p>
    </div>
  );
}
