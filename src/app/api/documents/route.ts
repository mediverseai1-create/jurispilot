import { NextResponse } from "next/server";
import { getContext } from "@/lib/session";
import { extractText } from "unpdf";

const MAX_BYTES = 8 * 1024 * 1024;

export async function POST(req: Request) {
  const ctx = await getContext();
  if (!ctx) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  const { supabase, user, plan } = ctx;

  const { count } = await supabase.from("documents").select("id", { count: "exact", head: true });
  if ((count ?? 0) >= plan.documents)
    return NextResponse.json({ error: `Your ${plan.name} plan holds ${plan.documents} documents. Delete some or upgrade.` }, { status: 402 });

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  const pasted = String(form?.get("text") ?? "").trim();
  const matterId = String(form?.get("matterId") ?? "") || null;
  let title = String(form?.get("title") ?? "").trim();
  let content = "";
  let filePath: string | null = null;

  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_BYTES) return NextResponse.json({ error: "File is larger than 8 MB." }, { status: 413 });
    const name = file.name.toLowerCase();
    const buf = new Uint8Array(await file.arrayBuffer());
    if (name.endsWith(".pdf")) {
      try {
        const { text } = await extractText(buf, { mergePages: true });
        content = text;
      } catch { return NextResponse.json({ error: "Could not read this PDF." }, { status: 422 }); }
    } else if (name.endsWith(".txt") || name.endsWith(".md")) {
      content = new TextDecoder().decode(buf);
    } else {
      return NextResponse.json({ error: "Supported files: PDF, TXT, MD. For Word files, paste the text." }, { status: 415 });
    }
    if (!title) title = file.name.replace(/\.[^.]+$/, "");
    const safe = file.name.replace(/[^\w.\-]+/g, "_");
    filePath = `${user.id}/${Date.now()}-${safe}`;
    const up = await supabase.storage.from("vault").upload(filePath, buf, { contentType: file.type || "application/octet-stream" });
    if (up.error) filePath = null; // text is still saved; original just isn't stored
  } else if (pasted) {
    content = pasted;
  }

  content = content.replace(/\u0000/g, "").trim();
  if (content.length < 20)
    return NextResponse.json({ error: "No readable text found. Scanned PDFs need OCR first." }, { status: 422 });
  if (!title) title = "Untitled document";

  const { data, error } = await supabase.from("documents").insert({
    user_id: user.id, matter_id: matterId, title: title.slice(0, 200), content, char_count: content.length, file_path: filePath,
  }).select("id").single();
  if (error) return NextResponse.json({ error: "Could not save document." }, { status: 500 });
  await supabase.from("usage_events").insert({ user_id: user.id, kind: "upload" });
  return NextResponse.json({ id: data.id });
}
