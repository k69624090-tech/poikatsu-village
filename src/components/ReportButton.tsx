"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { REPORT_REASONS } from "@/lib/types";

type Props = {
  targetType: "post" | "review" | "comment" | "review_comment";
  targetId: string;
  authorId: string;
};

export default function ReportButton({ targetType, targetId, authorId }: Props) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<string>(REPORT_REASONS[0]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [notLoggedIn, setNotLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  // 自分のコンテンツかどうか（trueの間はボタン非表示）
  const [isOwner, setIsOwner] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsOwner(user?.id === authorId);
    });
  }, [authorId]);

  // 自分のコンテンツには通報ボタンを表示しない
  if (isOwner) return null;

  const handleOpen = async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setNotLoggedIn(true);
    } else {
      setNotLoggedIn(false);
    }
    setError("");
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSubmitting(false);
      return;
    }

    const { error: insertError } = await supabase.from("reports").insert({
      target_type: targetType,
      target_id: targetId,
      reason,
      reporter_id: user.id,
      reporter_email: user.email ?? "",
    });

    if (insertError) {
      setError("通報に失敗しました。もう一度お試しください。");
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    setSubmitted(true);

    // モーダルを閉じてトーストを表示
    setTimeout(() => {
      setOpen(false);
      setSubmitted(false);
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 3000);
    }, 800);
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="text-xs text-gray-300 hover:text-red-400 transition-colors"
      >
        通報
      </button>

      {/* モーダル */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-80 max-w-[90vw]">
            <h3 className="font-bold text-gray-700 mb-4">通報する</h3>

            {submitted ? (
              <div className="text-center py-4">
                <div className="text-3xl mb-2">✅</div>
                <p className="text-sm text-green-600 font-medium">
                  通報しました
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  ご協力ありがとうございます
                </p>
              </div>
            ) : notLoggedIn ? (
              <>
                <p className="text-sm text-gray-500 mb-4">
                  通報するにはログインが必要です。
                </p>
                <button
                  onClick={() => setOpen(false)}
                  className="w-full py-2 rounded-full border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  閉じる
                </button>
              </>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">
                    通報理由
                  </label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-village-pink-300"
                  >
                    {REPORT_REASONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                {/* エラーメッセージ */}
                {error && (
                  <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="flex-1 py-2 rounded-full border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-2 rounded-full bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
                  >
                    {submitting ? (
                      <>
                        <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        送信中...
                      </>
                    ) : (
                      "通報する"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* トースト通知（画面右下） */}
      {toastVisible && (
        <div className="fixed bottom-6 right-6 z-50 bg-green-600 text-white text-sm font-medium px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-fade-in">
          ✅ 通報しました
        </div>
      )}
    </>
  );
}
