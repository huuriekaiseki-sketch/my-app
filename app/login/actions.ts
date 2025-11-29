// @ts-nocheck
"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  // 〜以下そのまま〜
}

  // ★ async createClient なので必ず await
  const supabase = await createClient();

  const email = (formData.get("email") ?? "").toString();
  const password = (formData.get("password") ?? "").toString();

  if (!email || !password) {
    // 必要ならバリデーションメッセージ返してもOK
    return { error: "メールとパスワードを入力してください" };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // ここでエラーを返せば画面側で表示もできる
    return { error: error.message };
  }

  // ログイン成功 → ダッシュボードへ
  redirect("/dashboard");
}
