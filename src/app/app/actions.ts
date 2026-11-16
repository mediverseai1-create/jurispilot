"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabase/server";

export async function signOut() {
  const sb = await supabaseServer();
  await sb.auth.signOut();
  redirect("/");
}

export async function createMatter(formData: FormData) {
  const p = z.object({ name: z.string().trim().min(1).max(200), client: z.string().trim().max(200).optional() })
    .safeParse({ name: formData.get("name"), client: formData.get("client") || undefined });
  if (!p.success) return;
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/login");
  await sb.from("matters").insert({ user_id: user.id, name: p.data.name, client: p.data.client ?? null });
  revalidatePath("/app/matters");
}

export async function deleteMatter(formData: FormData) {
  const id = z.string().uuid().safeParse(formData.get("id"));
  if (!id.success) return;
  const sb = await supabaseServer();
  await sb.from("matters").delete().eq("id", id.data);
  revalidatePath("/app/matters");
}

export async function deleteDocument(formData: FormData) {
  const id = z.string().uuid().safeParse(formData.get("id"));
  if (!id.success) return;
  const sb = await supabaseServer();
  const { data } = await sb.from("documents").select("file_path").eq("id", id.data).single();
  if (data?.file_path) await sb.storage.from("vault").remove([data.file_path]);
  await sb.from("documents").delete().eq("id", id.data);
  revalidatePath("/app/vault");
}

export async function updateProfile(formData: FormData) {
  const p = z.object({ full_name: z.string().trim().max(120), firm: z.string().trim().max(160) })
    .safeParse({ full_name: formData.get("full_name") ?? "", firm: formData.get("firm") ?? "" });
  if (!p.success) return;
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/login");
  await sb.from("profiles").update(p.data).eq("id", user.id);
  revalidatePath("/app/settings");
}
