import { getContext } from "@/lib/session";
import Chat from "./chat";

export default async function AssistantPage({ searchParams }: { searchParams: Promise<{ c?: string }> }) {
  const { c } = await searchParams;
  const { supabase } = (await getContext())!;
  const { data: docs } = await supabase.from("documents").select("id,title").order("created_at", { ascending: false });
  let initial: { role: "user" | "assistant"; content: string }[] = [];
  let conversationId: string | undefined;
  if (c && /^[0-9a-f-]{36}$/.test(c)) {
    const { data } = await supabase.from("messages").select("role,content").eq("conversation_id", c).order("created_at");
    if (data?.length) { initial = data as typeof initial; conversationId = c; }
  }
  return (
    <div>
      <h1 className="text-4xl mb-1">Assistant</h1>
      <p className="text-ink2 mb-6">Ask questions about the documents you select. Answers are drafts for professional review.</p>
      <Chat docs={docs ?? []} initial={initial} conversationId={conversationId} />
    </div>
  );
}
