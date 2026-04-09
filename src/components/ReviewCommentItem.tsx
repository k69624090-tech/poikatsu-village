"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { ReviewComment } from "@/lib/types";
import ReportButton from "@/components/ReportButton";

export default function ReviewCommentItem({ comment }: { comment: ReviewComment }) {
  const router = useRouter();
  const [isOwner, setIsOwner] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user && user.id === comment.author_id) {
        setIsOwner(true);
      }
    });
  }, [comment.author_id]);

  const handleDelete = async () => {
    if (!confirm("このコメントを削除しますか？")) return;

    setDeleting(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase
      .from("review_comments")
      .delete()
      .eq("id", comment.id);

    if (error) {
      setError("削除に失敗しました。");
      setDeleting(false);
      return;
    }

    router.refresh();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-village-pink-100">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3 text-sm text-gray-400">
          <span>{comment.author_email || "匿名ユーザー"}</span>
          <span>
            {new Date(comment.created_at).toLocaleDateString("ja-JP", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isOwner && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="text-xs text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
            >
              {deleting ? "削除中..." : "削除"}
            </button>
          )}
          <ReportButton
            targetType="review_comment"
            targetId={comment.id}
            authorId={comment.author_id}
          />
        </div>
      </div>
      <p className="text-gray-600 whitespace-pre-wrap">{comment.content}</p>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}
