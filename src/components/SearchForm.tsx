"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchForm({
  defaultValue,
  baseUrl,
  keepParams,
}: {
  defaultValue: string;
  baseUrl: string;
  keepParams: Record<string, string>;
}) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = new URLSearchParams(keepParams);
    if (value.trim()) {
      p.set("search", value.trim());
    }
    p.delete("page"); // 検索時はページを1にリセット
    const qs = p.toString();
    router.push(`${baseUrl}${qs ? `?${qs}` : ""}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="キーワードで検索..."
        className="flex-1 border border-village-pink-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-village-pink-400 text-sm bg-white"
      />
      <button
        type="submit"
        className="bg-village-pink-500 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-village-pink-600 transition-colors"
      >
        検索
      </button>
    </form>
  );
}
