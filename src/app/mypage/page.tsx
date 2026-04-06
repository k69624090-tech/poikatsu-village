import { redirect } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import {
  CATEGORY_COLORS,
  DIFFICULTY_COLORS,
  DANGER_LEVEL_COLORS,
  type Post,
  type Review,
} from "@/lib/types";
import StarRating from "@/components/StarRating";

export default async function MyPage() {
  const supabase = await createClient();

  // ログインチェック（未ログインならログインページへ）
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 自分の投稿を取得（新しい順）
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("author_id", user.id)
    .order("created_at", { ascending: false });

  // 自分のレビューを取得（新しい順）
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*")
    .eq("author_id", user.id)
    .order("created_at", { ascending: false });

  const myPosts = (posts ?? []) as Post[];
  const myReviews = (reviews ?? []) as Review[];

  return (
    <>
      <Header />
      <main className="flex-1 bg-village-pink-50 py-8 px-4">
        <div className="max-w-3xl mx-auto space-y-8">

          {/* ユーザー情報 */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h1 className="text-2xl font-bold text-village-pink-600 mb-4">
              👤 マイページ
            </h1>
            <p className="text-sm text-gray-500">メールアドレス</p>
            <p className="text-gray-700 font-medium">{user.email}</p>
          </div>

          {/* 自分の投稿一覧 */}
          <section>
            <h2 className="text-lg font-bold text-gray-700 mb-3">
              💬 自分の投稿
              <span className="ml-2 text-sm font-normal text-gray-400">
                ({myPosts.length}件)
              </span>
            </h2>

            {myPosts.length > 0 ? (
              <div className="space-y-3">
                {myPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/board/${post.id}`}
                    className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 border border-village-pink-100"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[post.category]}`}
                      >
                        {post.category}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(post.created_at).toLocaleDateString("ja-JP")}
                      </span>
                    </div>
                    <p className="font-medium text-gray-700">{post.title}</p>
                    <p className="text-sm text-gray-500 line-clamp-1 mt-0.5">
                      {post.content}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-6 text-center">
                <div className="text-3xl mb-2">📭</div>
                <p className="text-gray-400 text-sm">まだ投稿がありません</p>
              </div>
            )}
          </section>

          {/* 自分のレビュー一覧 */}
          <section>
            <h2 className="text-lg font-bold text-gray-700 mb-3">
              ⭐ 自分のレビュー
              <span className="ml-2 text-sm font-normal text-gray-400">
                ({myReviews.length}件)
              </span>
            </h2>

            {myReviews.length > 0 ? (
              <div className="space-y-3">
                {myReviews.map((review) => (
                  <Link
                    key={review.id}
                    href={`/reviews/${review.id}`}
                    className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 border border-village-pink-100"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${DIFFICULTY_COLORS[review.difficulty]}`}
                      >
                        {review.difficulty}
                      </span>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${DANGER_LEVEL_COLORS[review.danger_level]}`}
                      >
                        危険度: {review.danger_level}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(review.created_at).toLocaleDateString("ja-JP")}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="font-medium text-gray-700">{review.case_name}</p>
                      <StarRating rating={review.rating} />
                    </div>
                    <p className="text-sm text-village-pink-600 mt-0.5">
                      {review.reward}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-6 text-center">
                <div className="text-3xl mb-2">📭</div>
                <p className="text-gray-400 text-sm">まだレビューがありません</p>
              </div>
            )}
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}
