export type PlanId = "free" | "pro" | "firm";

export const PLANS: Record<PlanId, {
  id: PlanId; name: string; price: number; blurb: string;
  aiActions: number; documents: number; features: string[]; checkoutUrl?: string;
}> = {
  free: {
    id: "free", name: "Starter", price: 0, blurb: "Try the workspace on a small caseload.",
    aiActions: 15, documents: 5,
    features: ["15 AI actions per month", "5 documents in the Vault", "Assistant and all workflows", "Community support"],
  },
  pro: {
    id: "pro", name: "Professional", price: 57, blurb: "For solo practitioners and small teams.",
    aiActions: 400, documents: 100,
    features: ["400 AI actions per month", "100 documents in the Vault", "Contract review and clause extraction", "Matter organisation", "Email support"],
    checkoutUrl: process.env.NEXT_PUBLIC_SELAR_PRO_URL || "https://selar.com/57plan?currency=USD",
  },
  firm: {
    id: "firm", name: "Firm", price: 97, blurb: "For firms with a steady flow of matters.",
    aiActions: 2000, documents: 1000,
    features: ["2,000 AI actions per month", "1,000 documents in the Vault", "Everything in Professional", "Priority processing", "Priority support"],
    checkoutUrl: process.env.NEXT_PUBLIC_SELAR_FIRM_URL || "https://selar.com/97plan?currency=USD",
  },
};

export const planOf = (p?: string | null) => PLANS[(p as PlanId) in PLANS ? (p as PlanId) : "free"];

/** A paid plan only counts while the subscription is active. */
export function effectivePlan(profile: { plan: string; subscription_status: string } | null) {
  if (!profile) return PLANS.free;
  return profile.subscription_status === "active" ? planOf(profile.plan) : PLANS.free;
}
