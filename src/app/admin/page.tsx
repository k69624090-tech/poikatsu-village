import { redirect } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import {
  type Report,
  type Post,
  type Review,
  CATEGORY_COLORS,
  DIFFICULTY_COLORS,
  DANGER_LEVEL_COLORS,
} from "@/lib/types";
import { dismissReport, deleteContent, deleteContentDirect } from "./actions";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; status?: string }>;
}) {
  const { tab = "reports", status = "pending" } = await searchParams;

  // 管理者チェック
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    redirect("/");
  }

  const service = createServiceClient();
  let reports: Report[] = [];
  let posts: Post[] = [];
  let reviews: Review[] = [];

  if (tab === "reports") {
    const { data } = await service
      .from("reports")
      .select("*")
      .eq("status", status)
      .order("created_at", { ascending: false });
    reports = (data ?? []) as Report[];
  } else if (tab === "posts") {
    const { data } = await service
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });
    posts = (data ?? []) as Post[];
  } else if (tab === "reviews") {
    const { data } = await service
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });
    reviews = (data ?? []) as Review[];
  }

  const tabs = [
    { key: "reports", label: "🚨 通報一覧" },
    { key: "posts", label: "💬 全投稿" },
    { key: "reviews", label: "⭐ 全レビュー" },
  ];

  const statusFilters = [
    { key: "pending", label: "未対応" },
    { key: "resolved", label: "解決済み" },
    { key: "dismissed", label: "却下" },
  ];

  const targetTypeLabels: Record<string, string> = {
    post: "投稿",
    review: "レビュー",
    comment: "コメント",
    review_comment: "レビューコメント",
  };

  return (
    <>
      <Header />
      <main className="flex-1 bg-village-pink-50 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-700 mb-6">
            🛡️ 管理者ダッシュボード
          </h1>

          {/* タブ */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {tabs.map((t) => (
              <Link
                key={t.key}
                href={`/admin?tab=${t.key}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  tab === t.key
                    ? "bg-village-pink-500 text-white"
                    : "bg-white text-gray-600 border border-village-pink-200 hover:bg-village-pink-50"
                }`}
              >
                {t.label}
              </Link>
            ))}
          </div>

          {/* 通報一覧タブ */}
          {tab === "reports" && (
            <div>
              <div className="flex gap-2 mb-4 flex-wrap">
                {statusFilters.map((s) => (
                  <Link
                    key={s.key}
                    href={`/admin?tab=reports&status=${s.key}`}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      status === s.key
                        ? "bg-village-pink-500 text-white"
                        : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {s.label}
                  </Link>
                ))}
              </div>

              {reports.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center">
                  <div className="text-3xl mb-2">📭</div>
                  <p className="text-sm text-gray-400">通報はありません</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {reports.map((report) => (
                    <div
                      key={report.id}
                      className="bg-white rounded-xl shadow-sm border border-village-pink-100 p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                              {targetTypeLabels[report.target_type]}
                            </span>
                            <span className="text-xs text-gray-400 font-mono">
                              {report.target_id.slice(0, 8)}...
                            </span>
                          </div>
                          <p className="text-sm font-medium text-gray-700">
                            {report.reason}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            通報者: {report.reporter_email} ·{" "}
                            {new Date(report.created_at).toLocaleDateString(
                              "ja-JP"
                            )}
                          </p>
                        </div>
                        {status === "pending" && (
                          <div className="flex gap-2 shrink-0">
                            <form action={deleteContent}>
                              <input
                                type="hidden"
                                name="reportId"
                                value={report.id}
                              />
                              <input
                                type="hidden"
                                name="targetType"
                                value={report.target_type}
                              />
                              <input
                                type="hidden"
                                name="targetId"
                                value={report.target_id}
                              />
                              <button
                                type="submit"
                                className="text-xs px-3 py-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                              >
                                削除
                              </button>
                            </form>
                            <form action={dismissReport}>
                              <input
                                type="hidden"
                                name="reportId"
                                value={report.id}
                              />
                              <button
                                type="submit"
                                className="text-xs px-3 py-1.5 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors"
                              >
                                却下
                              </button>
                            </form>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 全投稿タブ */}
          {tab === "posts" && (
            <div className="space-y-3">
              {posts.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center">
                  <div className="text-3xl mb-2">📭</div>
                  <p className="text-sm text-gray-400">投稿はありません</p>
                </div>
              ) : (
                posts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white rounded-xl shadow-sm border border-village-pink-100 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[post.category]}`}
                          >
                            {post.category}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(post.created_at).toLocaleDateString(
                              "ja-JP"
                            )}
                          </span>
                        </div>
                        <Link
                          href={`/board/${post.id}`}
                          className="text-sm font-medium text-gray-700 hover:underline"
                        >
                          {post.title}
                        </Link>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {post.author_email}
                        </p>
                      </div>
                      <form action={deleteContentDirect}>
                        <input type="hidden" name="targetType" value="post" />
                        <input type="hidden" name="targetId" value={post.id} />
                        <button
                          type="submit"
                          className="text-xs px-3 py-1.5 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors shrink-0"
                        >
                          削除
                        </button>
                      </form>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 全レビュータブ */}
          {tab === "reviews" && (
            <div className="space-y-3">
              {reviews.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center">
                  <div className="text-3xl mb-2">📭</div>
                  <p className="text-sm text-gray-400">レビューはありません</p>
                </div>
              ) : (
                reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-white rounded-xl shadow-sm border border-village-pink-100 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
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
                            {new Date(review.created_at).toLocaleDateString(
                              "ja-JP"
                            )}
                          </span>
                        </div>
                        <Link
                          href={`/reviews/${review.id}`}
                          className="text-sm font-medium text-gray-700 hover:underline"
                        >
                          {review.case_name}
                        </Link>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {review.author_email} · {review.reward}
                        </p>
                      </div>
                      <form action={deleteContentDirect}>
                        <input
                          type="hidden"
                          name="targetType"
                          value="review"
                        />
                        <input
                          type="hidden"
                          name="targetId"
                          value={review.id}
                        />
                        <button
                          type="submit"
                          className="text-xs px-3 py-1.5 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors shrink-0"
                        >
                          削除
                        </button>
                      </form>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
