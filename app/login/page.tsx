"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/supabase-client";
import { useAuthUser } from "@/lib/supabase/useAuthUser";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();       // ← ここで supabase を作る
  const auth = useAuthUser();            // 認証状態（loading / guest / authed）

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ① 認証状態チェック中
  if (auth.status === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center">
        認証状態を確認中です…
      </main>
    );
  }

  // ② すでにログイン済みなら /todo-v2 へリダイレクト
  if (auth.status === "authed") {
    router.replace("/todo-v2");
    return (
      <main className="min-h-screen flex items-center justify-center">
        すでにログイン済みのため、ToDo 画面へ移動中…
      </main>
    );
  }

  // ③ ゲストだけが見るログインフォーム
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(`ログイン失敗：${error.message}`);
      setLoading(false);
      return;
    }

    setMessage("ログイン成功！");
    setLoading(false);
    router.replace("/todo-v2");
  };

  return (
    <main className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="メール"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border px-3 py-2 rounded w-64"
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border px-3 py-2 rounded w-64"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "ログイン中…" : "ログイン"}
        </button>
        {message && <p className="text-sm mt-2">{message}</p>}
      </form>
    </main>
  );
}
