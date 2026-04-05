// 掲示板の投稿の型定義
export type Post = {
  id: string;
  title: string;
  content: string;
  category: "成果報告" | "質問相談" | "攻略情報" | "注意案件" | "雑談";
  author_id: string;
  author_email: string;
  created_at: string;
};

// コメントの型定義
export type Comment = {
  id: string;
  post_id: string;
  content: string;
  author_id: string;
  author_email: string;
  created_at: string;
};

// カテゴリ一覧（フィルターやフォームで使いまわす）
export const CATEGORIES = [
  "成果報告",
  "質問相談",
  "攻略情報",
  "注意案件",
  "雑談",
] as const;

// カテゴリごとのバッジ色（Tailwindクラス）
export const CATEGORY_COLORS: Record<Post["category"], string> = {
  成果報告: "bg-yellow-100 text-yellow-700",
  質問相談: "bg-blue-100 text-blue-700",
  攻略情報: "bg-green-100 text-green-700",
  注意案件: "bg-red-100 text-red-700",
  雑談: "bg-purple-100 text-purple-700",
};
