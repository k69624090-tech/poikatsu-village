"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIES } from "@/lib/types";
import type { User } from "@supabase/supabase-js";

export default function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    (async () => {
      // ログインチェック
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);

      // 投稿データを取得
      const { data: post } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

      if (!post) {
        router.push("/board");
        return;
      }

      // 自分の投稿でなければ詳細ページへリダイレクト
      if (post.author_id !== user.id) {
        router.push(`/board/${id}`);
        return;
      }

      // フォームに既存データをセット
      setTitle(post.title);
      setCategory(post.category);
      setContent(post.content);
      setLoading(false);
    })();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError("");
    setSubmitting(true);

    const supabase = createClient();
    const { error } = await supabase
      .from("posts")
      .update({ title, content, category })
      .eq("id", id);

    if (error) {
      setError("更新に失敗しました。もう一度お試しください。");
      setSubmitting(false);
      return;
    }

    router.push(`/board/${id}`);
    router.refresh();
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="flex-1 bg-village-pink-50 flex items-center justify-center">
          <p className="text-gray-400">読み込み中...</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-village-pink-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <Link
            href={`/board/${id}`}
            className="text-sm text-village-pink-500 hover:underline mb-4 inline-block"
          >
            ← 投稿に戻る
          </Link>

          <div className="bg-white rounded-2xl shadow-md p-8">
            <h1 className="text-2xl font-bold text-village-pink-600 mb-6">
              投稿を編集
            </h1>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* カテゴリ */}
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-600 mb-1"
                >
                  カテゴリ
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-village-pink-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-village-pink-400"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* タイトル */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-600 mb-1"
                >
                  タイトル
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full border border-village-pink-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-village-pink-400"
                  placeholder="投稿のタイトルを入力"
                />
              </div>

              {/* 本文 */}
              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-600 mb-1"
                >
                  本文
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  rows={8}
                  className="w-full border border-village-pink-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-village-pink-400 resize-y"
                  placeholder="投稿の内容を入力"
                />
              </div>

              {error && (
                <p className="text-sm text-red-500 bg-red-50 rounded-lg p-3">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-village-pink-500 text-white py-3 rounded-full font-medium hover:bg-village-pink-600 transition-colors disabled:opacity-50"
              >
                {submitting ? "更新中..." : "更新する"}
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
