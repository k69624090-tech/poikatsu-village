"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/client";
import { DIFFICULTIES, DANGER_LEVELS } from "@/lib/types";
import type { User } from "@supabase/supabase-js";

export default function NewReviewPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [caseName, setCaseName] = useState("");
  const [reward, setReward] = useState("");
  const [difficulty, setDifficulty] = useState<string>(DIFFICULTIES[0]);
  const [dangerLevel, setDangerLevel] = useState<string>(DANGER_LEVELS[0]);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
    const { error } = await supabase.from("reviews").insert({
      case_name: caseName,
      reward,
      difficulty,
      danger_level: dangerLevel,
      rating,
      comment,
      author_id: user.id,
      author_email: user.email ?? "",
    });

    if (error) {
      setError("投稿に失敗しました。もう一度お試しください。");
      setSubmitting(false);
      return;
    }

    router.push("/reviews");
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
            href="/reviews"
            className="text-sm text-village-pink-500 hover:underline mb-4 inline-block"
          >
            ← レビュー一覧に戻る
          </Link>

          <div className="bg-white rounded-2xl shadow-md p-8">
            <h1 className="text-2xl font-bold text-village-pink-600 mb-6">
              ⭐ レビューを書く
            </h1>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* 案件名 */}
              <div>
                <label htmlFor="caseName" className="block text-sm font-medium text-gray-600 mb-1">
                  案件名
                </label>
                <input
                  id="caseName"
                  type="text"
                  value={caseName}
                  onChange={(e) => setCaseName(e.target.value)}
                  required
                  className="w-full border border-village-pink-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-village-pink-400"
                  placeholder="例: ○○カードの発行"
                />
              </div>

              {/* 報酬 */}
              <div>
                <label htmlFor="reward" className="block text-sm font-medium text-gray-600 mb-1">
                  報酬
                </label>
                <input
                  id="reward"
                  type="text"
                  value={reward}
                  onChange={(e) => setReward(e.target.value)}
                  required
                  className="w-full border border-village-pink-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-village-pink-400"
                  placeholder="例: 5,000円 / 10,000ポイント"
                />
              </div>

              {/* 難易度 + 危険度 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="difficulty" className="block text-sm font-medium text-gray-600 mb-1">
                    難易度
                  </label>
                  <select
                    id="difficulty"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full border border-village-pink-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-village-pink-400"
                  >
                    {DIFFICULTIES.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="dangerLevel" className="block text-sm font-medium text-gray-600 mb-1">
                    危険度
                  </label>
                  <select
                    id="dangerLevel"
                    value={dangerLevel}
                    onChange={(e) => setDangerLevel(e.target.value)}
                    className="w-full border border-village-pink-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-village-pink-400"
                  >
                    {DANGER_LEVELS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 評価 */}
              <div>
                <label htmlFor="rating" className="block text-sm font-medium text-gray-600 mb-1">
                  評価
                </label>
                <select
                  id="rating"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full border border-village-pink-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-village-pink-400"
                >
                  <option value={5}>★★★★★ (5)</option>
                  <option value={4}>★★★★☆ (4)</option>
                  <option value={3}>★★★☆☆ (3)</option>
                  <option value={2}>★★☆☆☆ (2)</option>
                  <option value={1}>★☆☆☆☆ (1)</option>
                </select>
              </div>

              {/* コメント */}
              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-600 mb-1">
                  コメント
                </label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                  rows={6}
                  className="w-full border border-village-pink-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-village-pink-400 resize-y"
                  placeholder="案件の詳細、注意点、おすすめポイントなど"
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
                {submitting ? "投稿中..." : "レビューを投稿する"}
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
