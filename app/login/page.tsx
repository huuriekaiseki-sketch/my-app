"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/supabase-client";
import { useAuthUser } from "@/lib/supabase/useAuthUser";

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuthUser(); // ← さっき作ったフック

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
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            placeholder="メール"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "ログイン中…" : "ログイン"}
        </button>
        {message && <p>{message}</p>}
      </form>
    </main>
  );
}
