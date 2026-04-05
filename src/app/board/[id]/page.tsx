import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import { CATEGORY_COLORS, type Post } from "@/lib/types";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // サーバー側で投稿を取得
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (!post) {
    notFound();
  }

  const typedPost = post as Post;

  return (
    <>
      <Header />
      <main className="flex-1 bg-village-pink-50 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/board"
            className="text-sm text-village-pink-500 hover:underline mb-4 inline-block"
          >
            ← 掲示板に戻る
          </Link>

          <article className="bg-white rounded-2xl shadow-md p-8">
            {/* カテゴリバッジ */}
            <span
              className={`text-xs px-3 py-1 rounded-full font-medium ${
                CATEGORY_COLORS[typedPost.category]
              }`}
            >
              {typedPost.category}
            </span>

            {/* タイトル */}
            <h1 className="text-2xl font-bold text-gray-700 mt-3 mb-2">
              {typedPost.title}
            </h1>

            {/* 投稿者・日付 */}
            <div className="flex items-center gap-3 text-sm text-gray-400 mb-6 pb-6 border-b border-village-pink-100">
              <span>{typedPost.author_email || "匿名ユーザー"}</span>
              <span>
                {new Date(typedPost.created_at).toLocaleDateString("ja-JP", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            {/* 本文 */}
            <div className="text-gray-600 leading-relaxed whitespace-pre-wrap">
              {typedPost.content}
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
