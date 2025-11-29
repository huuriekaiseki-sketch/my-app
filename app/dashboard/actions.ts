// @ts-nocheck
"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";


export async function addMessage(formData: FormData) {
  const supabase = await createClient();

  const text = (formData.get("text") ?? "").toString().trim();
  if (!text) return;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  await supabase.from("messages").insert({
    text,
    user_id: user.id,
  });

  // 投稿後に一覧を更新
  revalidatePath("/dashboard");
}
