import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import { DIFFICULTY_COLORS, DANGER_LEVEL_COLORS, type Review } from "@/lib/types";
import StarRating from "@/components/StarRating";
import ReviewActions from "@/components/ReviewActions";

export default async function ReviewDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: review } = await supabase
    .from("reviews")
    .select("*")
    .eq("id", id)
    .single();

  if (!review) {
    notFound();
  }

  const r = review as Review;

  return (
    <>
      <Header />
      <main className="flex-1 bg-village-pink-50 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/reviews"
            className="text-sm text-village-pink-500 hover:underline mb-4 inline-block"
          >
            ← レビュー一覧に戻る
          </Link>

          <article className="bg-white rounded-2xl shadow-md p-8">
            {/* バッジ行 */}
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${DIFFICULTY_COLORS[r.difficulty]}`}>
                難易度: {r.difficulty}
              </span>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${DANGER_LEVEL_COLORS[r.danger_level]}`}>
                危険度: {r.danger_level}
              </span>
            </div>

            {/* 案件名 */}
            <h1 className="text-2xl font-bold text-gray-700 mb-1">
              {r.case_name}
            </h1>

            {/* 報酬 + 星評価 */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-village-pink-100">
              <span className="text-village-pink-600 font-medium">{r.reward}</span>
              <StarRating rating={r.rating} />
              <span className="text-sm text-gray-400">({r.rating}/5)</span>
            </div>

            {/* 投稿者・日付 */}
            <div className="flex items-center gap-3 text-sm text-gray-400 mb-6">
              <span>{r.author_email || "匿名ユーザー"}</span>
              <span>
                {new Date(r.created_at).toLocaleDateString("ja-JP", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            {/* コメント */}
            <div className="text-gray-600 leading-relaxed whitespace-pre-wrap">
              {r.comment}
            </div>

            <ReviewActions reviewId={r.id} authorId={r.author_id} />
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
