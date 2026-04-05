"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIES } from "@/lib/types";
import type { User } from "@supabase/supabase-js";

export default function NewPostPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ログインチェック
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);
      setLoading(false);
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError("");
    setSubmitting(true);

    const supabase = createClient();
    const { error } = await supabase.from("posts").insert({
      title,
      content,
      category,
      author_id: user.id,
      author_email: user.email ?? "",
    });

    if (error) {
      setError("投稿に失敗しました。もう一度お試しください。");
      setSubmitting(false);
      return;
    }

    router.push("/board");
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
            href="/board"
            className="text-sm text-village-pink-500 hover:underline mb-4 inline-block"
          >
            ← 掲示板に戻る
          </Link>

          <div className="bg-white rounded-2xl shadow-md p-8">
            <h1 className="text-2xl font-bold text-village-pink-600 mb-6">
              ✏️ 新しい投稿
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
                <p className="text-sm text-village-pink-600 bg-village-pink-50 rounded-lg p-3">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-village-pink-500 text-white py-3 rounded-full font-medium hover:bg-village-pink-600 transition-colors disabled:opacity-50"
              >
                {submitting ? "投稿中..." : "投稿する"}
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
