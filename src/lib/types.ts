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

// レビューの型定義
export type Review = {
  id: string;
  case_name: string;
  reward: string;
  difficulty: "簡単" | "普通" | "難しい";
  danger_level: "低" | "中" | "高";
  rating: number;
  comment: string;
  author_id: string;
  author_email: string;
  created_at: string;
};

// 難易度一覧
export const DIFFICULTIES = ["簡単", "普通", "難しい"] as const;

// 危険度一覧
export const DANGER_LEVELS = ["低", "中", "高"] as const;

// 難易度バッジ色
export const DIFFICULTY_COLORS: Record<Review["difficulty"], string> = {
  簡単: "bg-green-100 text-green-700",
  普通: "bg-yellow-100 text-yellow-700",
  難しい: "bg-red-100 text-red-700",
};

// 危険度バッジ色
export const DANGER_LEVEL_COLORS: Record<Review["danger_level"], string> = {
  低: "bg-blue-100 text-blue-700",
  中: "bg-orange-100 text-orange-700",
  高: "bg-red-100 text-red-700",
};
