import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import { CATEGORY_COLORS, type Post, type Comment } from "@/lib/types";
import CommentForm from "@/components/CommentForm";
import PostActions from "@/components/PostActions";

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

  // コメント一覧を取得
  const { data: comments } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", id)
    .order("created_at", { ascending: true });

  const typedComments = (comments ?? []) as Comment[];

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
              className={`text-xs px-2.5 py-1 rounded-full font-medium ${
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

            {/* 編集・削除ボタン（自分の投稿のみ表示） */}
            <PostActions postId={typedPost.id} authorId={typedPost.author_id} />
          </article>

          {/* コメントセクション */}
          <section className="mt-6">
            <h2 className="text-lg font-bold text-gray-700 mb-4">
              コメント ({typedComments.length})
            </h2>

            {/* コメント一覧 */}
            {typedComments.length > 0 ? (
              <div className="space-y-3 mb-6">
                {typedComments.map((comment) => (
                  <div
                    key={comment.id}
                    className="bg-white rounded-xl shadow-sm p-4 border border-village-pink-100"
                  >
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                      <span>{comment.author_email || "匿名ユーザー"}</span>
                      <span>
                        {new Date(comment.created_at).toLocaleDateString(
                          "ja-JP",
                          {
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 mb-6">
                まだコメントはありません
              </p>
            )}

            {/* コメント投稿フォーム */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <CommentForm postId={id} />
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
