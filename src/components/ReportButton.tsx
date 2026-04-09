"use client";

import { useState } from "react";
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

  const handleOpen = async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setNotLoggedIn(true);
      setOpen(true);
      return;
    }
    if (user.id === authorId) return; // 自分のコンテンツは通報不可
    setNotLoggedIn(false);
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSubmitting(false);
      return;
    }

    await supabase.from("reports").insert({
      target_type: targetType,
      target_id: targetId,
      reason,
      reporter_id: user.id,
      reporter_email: user.email ?? "",
    });

    setSubmitting(false);
    setSubmitted(true);
    setTimeout(() => {
      setOpen(false);
      setSubmitted(false);
    }, 1500);
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="text-xs text-gray-300 hover:text-red-400 transition-colors"
      >
        通報
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-80 max-w-[90vw]">
            <h3 className="font-bold text-gray-700 mb-4">通報する</h3>

            {submitted ? (
              <p className="text-sm text-green-600 text-center py-4">
                通報しました。ご協力ありがとうございます。
              </p>
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
                    className="flex-1 py-2 rounded-full bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    {submitting ? "送信中..." : "通報する"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
