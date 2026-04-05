import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import { DIFFICULTIES, DANGER_LEVELS, DIFFICULTY_COLORS, DANGER_LEVEL_COLORS, type Review } from "@/lib/types";
import SearchForm from "@/components/SearchForm";
import StarRating from "@/components/StarRating";

const PER_PAGE = 10;

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ difficulty?: string; danger_level?: string; sort?: string; page?: string; search?: string }>;
}) {
  const { difficulty, danger_level, sort, page, search } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);
  const ascending = sort === "oldest";

  const supabase = await createClient();
  let query = supabase
    .from("reviews")
    .select("*", { count: "exact" })
    .order("created_at", { ascending });

  if (difficulty && (DIFFICULTIES as readonly string[]).includes(difficulty)) {
    query = query.eq("difficulty", difficulty);
  }
  if (danger_level && (DANGER_LEVELS as readonly string[]).includes(danger_level)) {
    query = query.eq("danger_level", danger_level);
  }

  // キーワード検索（案件名）
  if (search) {
    query = query.ilike("case_name", `%${search}%`);
  }

  // ページング
  const from = (currentPage - 1) * PER_PAGE;
  query = query.range(from, from + PER_PAGE - 1);

  const { data: reviews, count } = await query;
  const totalPages = Math.ceil((count ?? 0) / PER_PAGE);

  // 現在のフィルターパラメータを保持するヘルパー
  const buildHref = (params: Record<string, string | undefined>) => {
    const current: Record<string, string | undefined> = { difficulty, danger_level, sort, search };
    for (const key of Object.keys(params)) {
      current[key] = params[key];
    }
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(current)) {
      if (k !== "page" && v) p.set(k, v);
    }
    if (params.page) p.set("page", params.page);
    const qs = p.toString();
    return `/reviews${qs ? `?${qs}` : ""}`;
  };

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

          {/* 検索フォーム */}
          <SearchForm
            defaultValue={search ?? ""}
            baseUrl="/reviews"
            keepParams={{
              ...(difficulty ? { difficulty } : {}),
              ...(danger_level ? { danger_level } : {}),
              ...(sort ? { sort } : {}),
            }}
          />

          {/* 難易度フィルター */}
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-500 mb-2">難易度</p>
            <div className="flex flex-wrap gap-2">
              <Link
                href={buildHref({ difficulty: undefined, page: undefined })}
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
                  href={buildHref({ difficulty: d, page: undefined })}
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
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-500 mb-2">危険度</p>
            <div className="flex flex-wrap gap-2">
              <Link
                href={buildHref({ danger_level: undefined, page: undefined })}
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
                  href={buildHref({ danger_level: d, page: undefined })}
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

          {/* ソート */}
          <div className="flex gap-2 mb-6">
            <Link
              href={buildHref({ sort: undefined, page: undefined })}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                !ascending
                  ? "bg-gray-700 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              新しい順
            </Link>
            <Link
              href={buildHref({ sort: "oldest", page: undefined })}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                ascending
                  ? "bg-gray-700 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              古い順
            </Link>
          </div>

          {/* レビュー一覧 */}
          {reviews && reviews.length > 0 ? (
            <>
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

              {/* ページング */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  {currentPage > 1 && (
                    <Link
                      href={buildHref({ page: String(currentPage - 1) })}
                      className="px-4 py-2 rounded-full text-sm font-medium bg-white text-gray-600 border border-village-pink-200 hover:bg-village-pink-50 transition-colors"
                    >
                      ← 前へ
                    </Link>
                  )}
                  <span className="text-sm text-gray-500 px-3">
                    {currentPage} / {totalPages}
                  </span>
                  {currentPage < totalPages && (
                    <Link
                      href={buildHref({ page: String(currentPage + 1) })}
                      className="px-4 py-2 rounded-full text-sm font-medium bg-white text-gray-600 border border-village-pink-200 hover:bg-village-pink-50 transition-colors"
                    >
                      次へ →
                    </Link>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="text-4xl mb-4">📭</div>
              <p className="text-gray-500 mb-2">
                {search
                  ? "該当するレビューが見つかりません"
                  : difficulty || danger_level
                  ? "条件に一致するレビューがありません"
                  : "まだレビューがありません"}
              </p>
              <p className="text-sm text-gray-400">
                {search
                  ? "別のキーワードで試してみましょう"
                  : difficulty || danger_level
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
