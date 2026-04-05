"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

export default function CommentForm({ postId }: { postId: string }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !content.trim()) return;

    setSubmitting(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.from("comments").insert({
      post_id: postId,
      content: content.trim(),
      author_id: user.id,
      author_email: user.email ?? "",
    });

    if (error) {
      setError("コメントの投稿に失敗しました。");
      setSubmitting(false);
      return;
    }

    setContent("");
    setSubmitting(false);
    router.refresh();
  };

  // ログインしていない場合
  if (!user) {
    return (
      <p className="text-sm text-gray-400 text-center py-4">
        コメントするには<a href="/login" className="text-village-pink-500 hover:underline">ログイン</a>してください
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        rows={3}
        className="w-full border border-village-pink-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-village-pink-400 resize-y"
        placeholder="コメントを入力..."
      />
      {error && (
        <p className="text-sm text-village-pink-600">{error}</p>
      )}
      <button
        type="submit"
        disabled={submitting || !content.trim()}
        className="bg-village-pink-500 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-village-pink-600 transition-colors disabled:opacity-50"
      >
        {submitting ? "送信中..." : "コメントする"}
      </button>
    </form>
  );
}
