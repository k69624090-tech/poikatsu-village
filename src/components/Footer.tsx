import Link from "next/link";

const links = [
  { href: "/board", label: "掲示板" },
  { href: "/reviews", label: "レビュー" },
  { href: "/guide", label: "初心者ガイド" },
  { href: "/mypage", label: "マイページ" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-white border-t border-village-pink-100 py-10 px-4 mt-auto">
      {/* 装飾（クリック無効） */}
      <div className="absolute bottom-0 left-0 w-64 h-32 bg-village-pink-50 rounded-full blur-3xl opacity-60 -translate-x-1/2 translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 h-32 bg-violet-50 rounded-full blur-3xl opacity-60 translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="relative max-w-5xl mx-auto text-center">
        {/* ロゴ */}
        <div className="text-2xl font-bold gradient-text mb-4">
          🏘️ ポイ活の村
        </div>

        {/* ナビゲーション */}
        <div className="flex justify-center gap-6 text-sm text-gray-400 mb-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-village-pink-500 transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* コピーライト */}
        <p className="text-xs text-gray-300">
          &copy; 2026 ポイ活の村 All rights reserved.
        </p>
      </div>
    </footer>
  );
}
