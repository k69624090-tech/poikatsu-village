import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import { CATEGORIES, CATEGORY_COLORS, type Post } from "@/lib/types";

export default async function BoardPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  // サーバー側でSupabaseから投稿を取得
  const supabase = await createClient();
  let query = supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  // カテゴリフィルター
  if (category && CATEGORIES.includes(category as Post["category"])) {
    query = query.eq("category", category);
  }

  const { data: posts } = await query;

  return (
    <>
      <Header />
      <main className="flex-1 bg-village-pink-50 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* ページタイトル */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-700">💬 掲示板</h1>
            <Link
              href="/board/new"
              className="bg-village-pink-500 text-white px-6 py-2 rounded-full font-medium hover:bg-village-pink-600 transition-colors shadow-md text-sm"
            >
              ✏️ 新しく投稿する
            </Link>
          </div>

          {/* カテゴリフィルター */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Link
              href="/board"
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                !category
                  ? "bg-village-pink-500 text-white"
                  : "bg-white text-gray-600 border border-village-pink-200 hover:bg-village-pink-50"
              }`}
            >
              すべて
            </Link>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href={`/board?category=${cat}`}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  category === cat
                    ? "bg-village-pink-500 text-white"
                    : "bg-white text-gray-600 border border-village-pink-200 hover:bg-village-pink-50"
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>

          {/* 投稿一覧 */}
          {posts && posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post: Post) => (
                <Link
                  key={post.id}
                  href={`/board/${post.id}`}
                  className="block bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-5 border border-village-pink-100"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                        CATEGORY_COLORS[post.category]
                      }`}
                    >
                      {post.category}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(post.created_at).toLocaleDateString("ja-JP")}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-gray-700 mb-1">
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {post.content}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {post.author_email || "匿名ユーザー"}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-4xl mb-4">📭</div>
              <p className="text-gray-500 mb-2">
                {category
                  ? `「${category}」の投稿はまだありません`
                  : "まだ投稿がありません"}
              </p>
              <p className="text-sm text-gray-400">
                最初の投稿をしてみましょう！
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
