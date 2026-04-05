"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function PostActions({
  postId,
  authorId,
}: {
  postId: string;
  authorId: string;
}) {
  const router = useRouter();
  const [isOwner, setIsOwner] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user && user.id === authorId) {
        setIsOwner(true);
      }
    });
  }, [authorId]);

  const handleDelete = async () => {
    if (!confirm("この投稿を削除しますか？")) return;

    setDeleting(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", postId);

    if (error) {
      setError("削除に失敗しました。");
      setDeleting(false);
      return;
    }

    router.push("/board");
    router.refresh();
  };

  if (!isOwner) return null;

  return (
    <div className="flex items-center gap-3 mt-6 pt-6 border-t border-village-pink-100">
      <Link
        href={`/board/${postId}/edit`}
        className="bg-village-pink-100 text-village-pink-600 px-5 py-2 rounded-full text-sm font-medium hover:bg-village-pink-200 transition-colors"
      >
        編集する
      </Link>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="bg-red-50 text-red-500 px-5 py-2 rounded-full text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-50"
      >
        {deleting ? "削除中..." : "削除する"}
      </button>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
