import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import { DIFFICULTIES, DANGER_LEVELS, DIFFICULTY_COLORS, DANGER_LEVEL_COLORS, type Review } from "@/lib/types";
import StarRating from "@/components/StarRating";

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ difficulty?: string; danger_level?: string }>;
}) {
  const { difficulty, danger_level } = await searchParams;

  const supabase = await createClient();
  let query = supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });

  if (difficulty && (DIFFICULTIES as readonly string[]).includes(difficulty)) {
    query = query.eq("difficulty", difficulty);
  }
  if (danger_level && (DANGER_LEVELS as readonly string[]).includes(danger_level)) {
    query = query.eq("danger_level", danger_level);
  }

  const { data: reviews } = await query;

  return (
    <>
      <Header />
      <main className="flex-1 bg-village-pink-50 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* ページタイトル */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-700">⭐ 案件レビュー</h1>
            <Link
              href="/reviews/new"
              className="bg-village-pink-500 text-white px-6 py-2 rounded-full font-medium hover:bg-village-pink-600 transition-colors shadow-md text-sm"
            >
              ✏️ レビューを書く
            </Link>
          </div>

          {/* 難易度フィルター */}
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-500 mb-2">難易度</p>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/reviews${danger_level ? `?danger_level=${danger_level}` : ""}`}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  !difficulty
                    ? "bg-village-pink-500 text-white"
                    : "bg-white text-gray-600 border border-village-pink-200 hover:bg-village-pink-50"
                }`}
              >
                すべて
              </Link>
              {DIFFICULTIES.map((d) => (
                <Link
                  key={d}
                  href={`/reviews?difficulty=${d}${danger_level ? `&danger_level=${danger_level}` : ""}`}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    difficulty === d
                      ? "bg-village-pink-500 text-white"
                      : "bg-white text-gray-600 border border-village-pink-200 hover:bg-village-pink-50"
                  }`}
                >
                  {d}
                </Link>
              ))}
            </div>
          </div>

          {/* 危険度フィルター */}
          <div className="mb-6">
            <p className="text-xs font-medium text-gray-500 mb-2">危険度</p>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/reviews${difficulty ? `?difficulty=${difficulty}` : ""}`}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  !danger_level
                    ? "bg-village-pink-500 text-white"
                    : "bg-white text-gray-600 border border-village-pink-200 hover:bg-village-pink-50"
                }`}
              >
                すべて
              </Link>
              {DANGER_LEVELS.map((d) => (
                <Link
                  key={d}
                  href={`/reviews?danger_level=${d}${difficulty ? `&difficulty=${difficulty}` : ""}`}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    danger_level === d
                      ? "bg-village-pink-500 text-white"
                      : "bg-white text-gray-600 border border-village-pink-200 hover:bg-village-pink-50"
                  }`}
                >
                  {d}
                </Link>
              ))}
            </div>
          </div>

          {/* レビュー一覧 */}
          {reviews && reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review: Review) => (
                <Link
                  key={review.id}
                  href={`/reviews/${review.id}`}
                  className="block bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-5 border border-village-pink-100"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h2 className="text-lg font-bold text-gray-700">
                      {review.case_name}
                    </h2>
                    <span className="text-sm font-medium text-village-pink-600 whitespace-nowrap">
                      {review.reward}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <StarRating rating={review.rating} />
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${DIFFICULTY_COLORS[review.difficulty]}`}
                    >
                      難易度: {review.difficulty}
                    </span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${DANGER_LEVEL_COLORS[review.danger_level]}`}
                    >
                      危険度: {review.danger_level}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                    {review.comment}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>{review.author_email || "匿名ユーザー"}</span>
                    <span>{new Date(review.created_at).toLocaleDateString("ja-JP")}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-4xl mb-4">📭</div>
              <p className="text-gray-500 mb-2">
                {difficulty || danger_level
                  ? "条件に一致するレビューがありません"
                  : "まだレビューがありません"}
              </p>
              <p className="text-sm text-gray-400">
                {difficulty || danger_level
                  ? "フィルターを変更してみましょう"
                  : "最初のレビューを書いてみましょう！"}
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
