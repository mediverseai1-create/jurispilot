import { supabaseServer } from "@/lib/supabase/server";
import { effectivePlan } from "@/lib/plans";

export async function getContext() {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  const plan = effectivePlan(profile);
  return { supabase, user, profile, plan };
}

export async function monthlyUsage(supabase: Awaited<ReturnType<typeof supabaseServer>>, userId: string) {
  const start = new Date(); start.setUTCDate(1); start.setUTCHours(0, 0, 0, 0);
  const { count } = await supabase.from("usage_events").select("id", { count: "exact", head: true })
    .eq("user_id", userId).in("kind", ["assistant", "workflow"]).gte("created_at", start.toISOString());
  return count ?? 0;
}

/** Returns an error string if the user is out of AI actions. */
export async function checkQuota(ctx: NonNullable<Awaited<ReturnType<typeof getContext>>>) {
  const used = await monthlyUsage(ctx.supabase, ctx.user.id);
  if (used >= ctx.plan.aiActions)
    return `You have used all ${ctx.plan.aiActions} AI actions on the ${ctx.plan.name} plan this month. Upgrade on the Billing page to continue.`;
  return null;
}
