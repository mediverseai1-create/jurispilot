/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { supabaseAdmin } from "@/lib/supabase/server";

/**
 * Selar webhook. Activates a plan only when the request carries our shared secret.
 * Plan is derived from the amount actually paid (57 -> pro, 97 -> firm).
 * Selar's payload field names are not verified here; we read common variants defensively
 * and store the raw payload in payment_events so it can be audited.
 */
function safeEq(a: string, b: string) {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export async function POST(req: Request) {
  const secret = process.env.SELAR_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Webhook not configured." }, { status: 503 });
  const url = new URL(req.url);
  const token = url.searchParams.get("token") || req.headers.get("x-webhook-token") || "";
  if (!safeEq(token, secret)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const body = (await req.json().catch(() => null)) as Record<string, any> | null;
  if (!body) return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  const d = (body.data ?? body) as Record<string, any>;
  const email = String(d.email ?? d.customer_email ?? d.customer?.email ?? d.buyer?.email ?? "").toLowerCase().trim();
  const amount = Number(d.amount ?? d.total ?? d.price ?? d.amount_paid ?? 0);
  const externalId = String(d.id ?? d.reference ?? d.order_id ?? d.transaction_id ?? "") || null;
  const event = String(body.event ?? d.status ?? "").toLowerCase();
  if (!email) return NextResponse.json({ error: "No buyer email." }, { status: 400 });

  const plan = Math.round(amount) === 97 ? "firm" : Math.round(amount) === 57 ? "pro" : null;
  const admin = supabaseAdmin();
  const { error: dup } = await admin.from("payment_events").insert({ external_id: externalId, email, plan, amount, raw: body });
  if (dup?.code === "23505") return NextResponse.json({ ok: true, duplicate: true });

  if (/refund|cancel|fail/.test(event)) {
    await admin.from("profiles").update({ subscription_status: "cancelled" }).eq("email", email);
    return NextResponse.json({ ok: true });
  }
  if (!plan) return NextResponse.json({ ok: true, ignored: "amount does not match a plan" });
  const { data } = await admin.from("profiles").update({
    plan, subscription_status: "active", plan_activated_at: new Date().toISOString(),
  }).eq("email", email).select("id");
  return NextResponse.json({ ok: true, matched: data?.length ?? 0 });
}
