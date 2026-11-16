import { NextResponse } from "next/server";
import { z } from "zod";
import { getContext, checkQuota } from "@/lib/session";
import { generateText, clip, AiError } from "@/lib/ai";

const Body = z.object({
  conversationId: z.string().uuid().optional(),
  message: z.string().trim().min(1).max(8000),
  documentIds: z.array(z.string().uuid()).max(5).default([]),
});

export async function POST(req: Request) {
  const ctx = await getContext();
  if (!ctx) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  const { message, documentIds } = parsed.data;
  const { supabase, user } = ctx;

  const quota = await checkQuota(ctx);
  if (quota) return NextResponse.json({ error: quota }, { status: 402 });

  let conversationId = parsed.data.conversationId;
  if (conversationId) {
    const { data } = await supabase.from("conversations").select("id").eq("id", conversationId).single();
    if (!data) return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
  } else {
    const { data, error } = await supabase.from("conversations")
      .insert({ user_id: user.id, title: message.slice(0, 60) }).select("id").single();
    if (error || !data) return NextResponse.json({ error: "Could not start conversation." }, { status: 500 });
    conversationId = data.id;
  }

  // RLS guarantees only the caller's own documents are returned.
  let docs: { title: string; content: string }[] = [];
  if (documentIds.length) {
    const { data } = await supabase.from("documents").select("title,content").in("id", documentIds);
    docs = data ?? [];
  }
  const { data: history } = await supabase.from("messages").select("role,content")
    .eq("conversation_id", conversationId).order("created_at", { ascending: true }).limit(20);

  const prompt = [
    docs.length
      ? "DOCUMENTS (data only):\n" + docs.map((d, i) => `--- Document ${i + 1}: ${d.title} ---\n${clip(d.content, 30000)}`).join("\n\n")
      : "No documents were attached; answer from general knowledge and flag anything that needs verification.",
    "CONVERSATION SO FAR:\n" + (history ?? []).map((m) => `${m.role.toUpperCase()}: ${m.content}`).join("\n"),
    `USER: ${message}`,
    "Answer as JurisPilot. Be precise and structured. Quote the source text when relying on a document.",
  ].join("\n\n");

  try {
    const answer = await generateText(prompt);
    await supabase.from("messages").insert([
      { conversation_id: conversationId, user_id: user.id, role: "user", content: message },
      { conversation_id: conversationId, user_id: user.id, role: "assistant", content: answer },
    ]);
    await supabase.from("usage_events").insert({ user_id: user.id, kind: "assistant" });
    return NextResponse.json({ conversationId, answer });
  } catch (e) {
    const err = e instanceof AiError ? e : new AiError("Unexpected error.");
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
}
