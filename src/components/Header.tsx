import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-village-pink-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* サイト名（ロゴ） */}
        <Link href="/" className="text-xl font-bold text-village-pink-500">
          🏘️ ポイ活の村
        </Link>

        {/* ナビゲーション */}
        <nav className="flex gap-4 text-sm font-medium">
          <Link
            href="/board"
            className="text-gray-600 hover:text-village-pink-500 transition-colors"
          >
            掲示板
          </Link>
          <Link
            href="/reviews"
            className="text-gray-600 hover:text-village-pink-500 transition-colors"
          >
            レビュー
          </Link>
          <Link
            href="/mypage"
            className="text-gray-600 hover:text-village-pink-500 transition-colors"
          >
            マイページ
          </Link>
        </nav>
      </div>
    </header>
  );
}
