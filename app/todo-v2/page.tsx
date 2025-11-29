"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/supabase-client";
import { useAuthUser } from "@/lib/supabase/useAuthUser";

type Todo = {
  id: string;
  title: string;
  tag: string | null;
  completed: boolean;
  created_at: string;
};

type StatusFilter = "all" | "active" | "completed";

export default function TodoV2Page() {
  const router = useRouter();
  const auth = useAuthUser();

  // ここで一旦 userId（ログインしてなければ null）
  const userId = auth.userId ?? null;

  // 2️⃣ ToDo 関連の state（フックはぜんぶここに並べる）
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadingTodos, setLoadingTodos] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newTag, setNewTag] = useState("");

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [tagFilter, setTagFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const [error, setError] = useState<string | null>(null);

  /** ---- ToDo を取得 ---- */
  const fetchTodos = async () => {
    if (!userId) return; // userId が無ければ何もしない

    setLoadingTodos(true);
    setError(null);

    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setError("ToDoの取得に失敗しました。");
    } else {
      setTodos((data ?? []) as Todo[]);
    }

    setLoadingTodos(false);
  };

  useEffect(() => {
    // userId が取れたタイミングで ToDo を読む
    if (userId) {
      fetchTodos();
    }
  }, [userId]);

  // ③ ToDo追加
  const handleAddTodo = async () => {
    if (!userId) return;
    if (!newTitle.trim()) return;

    setError(null);

    const { error } = await supabase.from("todos").insert({
      user_id: userId,
      title: newTitle.trim(),
      tag: newTag.trim() || null,
      completed: false,
    });

    if (error) {
      console.error(error);
      setError("ToDoの追加に失敗しました。");
      return;
    }

    setNewTitle("");
    setNewTag("");
    await fetchTodos();
  };

  // ④ 完了トグル
  const handleToggleTodo = async (todo: Todo) => {
    if (!userId) return;

    setError(null);
    const { error } = await supabase
      .from("todos")
      .update({ completed: !todo.completed })
      .eq("id", todo.id);

    if (error) {
      console.error(error);
      setError("更新に失敗しました。");
      return;
    }

    await fetchTodos();
  };

  // ⑤ 削除（楽観的UI）
  const handleDeleteTodo = async (id: string) => {
    if (!userId) return;
    if (!confirm("本当に削除しますか？")) return;

    setError(null);

    // 先に画面から消す
    setTodos((prev) => prev.filter((t) => t.id !== id));

    const { error } = await supabase.from("todos").delete().eq("id", id);

    if (error) {
      console.error(error);
      setError("削除に失敗しました。");
      // 失敗したら DB の状態を取り直す
      await fetchTodos();
    }
  };

  // ⑥ タグ一覧（フィルタ用）
  const allTags = useMemo(() => {
    const set = new Set<string>();
    todos.forEach((t) => {
      if (t.tag) set.add(t.tag);
    });
    return Array.from(set);
  }, [todos]);

  // ⑦ 表示用のフィルタ済み ToDo
  const filteredTodos = useMemo(() => {
    return todos.filter((t) => {
      if (statusFilter === "active" && t.completed) return false;
      if (statusFilter === "completed" && !t.completed) return false;
      if (tagFilter !== "all" && t.tag !== tagFilter) return false;
      if (
        search.trim() &&
        !t.title.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [todos, statusFilter, tagFilter, search]);

  // 8️⃣ ここから「状況に応じた return」（フックの後に書く）

  if (auth.status === "guest" || !userId) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-2">
          <p>このページを表示するにはログインが必要です。</p>
          <p>
            <Link href="/login" className="text-blue-600 underline">
              /login
            </Link>{" "}
            からログインしてください。
          </p>
        </div>
      </main>
    );
  }


  // ⑨ メイン画面
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        {/* ヘッダー */}
        <header className="flex flex-col gap-2 rounded-2xl bg-white px-6 py-5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                ToDo App v2
              </h1>
              <p className="text-xs text-slate-500">
                機能充実型：タグ・フィルタ付きの ToDo 管理
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Today
              </p>
              <p className="text-xs font-medium text-slate-600">
                {new Date().toLocaleDateString("ja-JP", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  weekday: "short",
                })}
              </p>
            </div>
          </div>

          {/* サマリー */}
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              全 {todos.length} 件
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              未完了 {todos.filter((t) => !t.completed).length}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1">
              <span className="h-2 w-2 rounded-full bg-slate-400" />
              完了 {todos.filter((t) => t.completed).length}
            </span>
          </div>
        </header>

        {/* エラー表示 */}
        {error && (
          <div className="mx-auto w-full max-w-3xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700 shadow-sm">
            {error}
          </div>
        )}

        {/* 追加フォーム */}
        <section className="mx-auto w-full max-w-3xl rounded-2xl bg-white px-6 py-5 shadow-sm border border-slate-100 space-y-3">
          <h2 className="text-sm font-semibold text-slate-800">
            新しい ToDo を追加
          </h2>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-0 focus:border-slate-400 focus:bg-white"
              placeholder="やること（例：SupabaseでCRUD実装）"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <input
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-0 focus:border-slate-400 focus:bg-white sm:w-40"
              placeholder="タグ（任意：仕事・学習など）"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
            />
            <button
              onClick={handleAddTodo}
              className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800 active:translate-y-[1px]"
            >
              追加
            </button>
          </div>
        </section>

        {/* フィルタ */}
        <section className="mx-auto w-full max-w-3xl rounded-2xl bg-white px-6 py-4 shadow-sm border border-slate-100 space-y-3">
          <h2 className="text-sm font-semibold text-slate-800">フィルタ</h2>

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            {/* 状態・タグ */}
            <div className="flex flex-wrap gap-3 text-xs">
              <div className="flex items-center gap-1">
                <span className="text-slate-500">状態:</span>
                {[
                  { key: "all", label: "すべて" },
                  { key: "active", label: "未完了" },
                  { key: "completed", label: "完了" },
                ].map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setStatusFilter(f.key as StatusFilter)}
                    className={`inline-flex items-center rounded-full border px-3 py-1 ${
                      statusFilter === f.key
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1">
                <span className="text-slate-500">タグ:</span>
                <button
                  onClick={() => setTagFilter("all")}
                  className={`inline-flex items-center rounded-full border px-3 py-1 ${
                    tagFilter === "all"
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300"
                  }`}
                >
                  すべて
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setTagFilter(tag)}
                    className={`inline-flex items-center rounded-full border px-3 py-1 ${
                      tagFilter === tag
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* 検索 */}
            <div className="w-full md:w-64">
              <input
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none ring-0 focus:border-slate-400 focus:bg-white"
                placeholder="タイトルで検索"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* リスト */}
        <section className="mx-auto w-full max-w-3xl rounded-2xl bg-white px-6 py-5 shadow-sm border border-slate-100 space-y-3 mb-10">
          <h2 className="text-sm font-semibold text-slate-800">ToDo 一覧</h2>

          {loadingTodos ? (
            <p className="text-xs text-slate-500">読み込み中...</p>
          ) : filteredTodos.length === 0 ? (
            <p className="text-xs text-slate-500">
              条件に一致する ToDo がありません。
            </p>
          ) : (
            <ul className="space-y-2">
              {filteredTodos.map((todo) => (
                <li
                  key={todo.id}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => handleToggleTodo(todo)}
                      className="mt-1 h-4 w-4 rounded border-slate-400 text-slate-900"
                    />
                    <div>
                      <p
                        className={`text-sm ${
                          todo.completed
                            ? "line-through text-slate-400"
                            : "text-slate-900"
                        }`}
                      >
                        {todo.title}
                      </p>
                      <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-slate-500">
                        {todo.tag && (
                          <span className="inline-flex items-center rounded-full bg-slate-200 px-2 py-0.5 text-[11px]">
                            #{todo.tag}
                          </span>
                        )}
                        <span>
                          {new Date(todo.created_at).toLocaleString("ja-JP")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="text-[11px] text-red-500 hover:text-red-600 hover:underline"
                  >
                    削除
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
