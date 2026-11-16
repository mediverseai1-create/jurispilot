"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";
import { Logo } from "@/components/site";

type Mode = "login" | "signup" | "forgot" | "reset";
const copy: Record<Mode, { title: string; cta: string }> = {
  login: { title: "Sign in", cta: "Sign in" },
  signup: { title: "Create your account", cta: "Create account" },
  forgot: { title: "Reset your password", cta: "Send reset link" },
  reset: { title: "Choose a new password", cta: "Update password" },
};

export default function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const sp = useSearchParams();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(
    sp.get("error") === "not_configured" ? { ok: false, text: "Supabase is not configured on this deployment." } : null,
  );

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email") ?? "").trim();
    const password = String(f.get("password") ?? "");
    if (mode !== "reset" && !/^\S+@\S+\.\S+$/.test(email)) return setMsg({ ok: false, text: "Enter a valid email address." });
    if (mode !== "forgot" && password.length < 8) return setMsg({ ok: false, text: "Password must be at least 8 characters." });
    setBusy(true);
    const sb = supabaseBrowser();
    const origin = window.location.origin;
    try {
      if (mode === "login") {
        const { error } = await sb.auth.signInWithPassword({ email, password });
        if (error) throw error;
        const next = sp.get("next");
        router.replace(next && next.startsWith("/app") ? next : "/app");
        router.refresh();
      } else if (mode === "signup") {
        const { data, error } = await sb.auth.signUp({
          email, password,
          options: { data: { full_name: String(f.get("name") ?? "") }, emailRedirectTo: `${origin}/auth/callback` },
        });
        if (error) throw error;
        if (data.session) { router.replace("/app"); router.refresh(); }
        else setMsg({ ok: true, text: "Check your email to confirm your account, then sign in." });
      } else if (mode === "forgot") {
        const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: `${origin}/auth/callback?next=/reset-password` });
        if (error) throw error;
        setMsg({ ok: true, text: "If that email has an account, a reset link is on its way." });
      } else {
        const { error } = await sb.auth.updateUser({ password });
        if (error) throw error;
        router.replace("/app");
      }
    } catch (err) {
      setMsg({ ok: false, text: err instanceof Error ? err.message : "Something went wrong." });
    } finally { setBusy(false); }
  }

  return (
    <div className="min-h-screen grid place-items-center px-5 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center"><Logo /></div>
        <form onSubmit={submit} className="card p-7 space-y-4" noValidate>
          <h1 className="text-3xl">{copy[mode].title}</h1>
          {mode === "signup" && <div><label className="label" htmlFor="name">Full name</label><input id="name" name="name" className="input" autoComplete="name" /></div>}
          {mode !== "reset" && <div><label className="label" htmlFor="email">Email</label><input id="email" name="email" type="email" className="input" autoComplete="email" required /></div>}
          {mode !== "forgot" && <div><label className="label" htmlFor="password">{mode === "reset" ? "New password" : "Password"}</label><input id="password" name="password" type="password" className="input" autoComplete={mode === "login" ? "current-password" : "new-password"} required /></div>}
          {msg && <p role="alert" className={`text-sm ${msg.ok ? "text-brand" : "text-danger"}`}>{msg.text}</p>}
          <button className="btn btn-primary w-full" disabled={busy}>{busy ? "Please wait…" : copy[mode].cta}</button>
          <div className="text-sm text-ink2 flex justify-between">
            {mode === "login" && <><Link href="/signup" className="underline">Create account</Link><Link href="/forgot-password" className="underline">Forgot password?</Link></>}
            {mode === "signup" && <Link href="/login" className="underline">Already have an account?</Link>}
            {mode === "forgot" && <Link href="/login" className="underline">Back to sign in</Link>}
          </div>
        </form>
      </div>
    </div>
  );
}
