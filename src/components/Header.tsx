import Link from "next/link";
import AuthStatus from "./AuthStatus";
import MobileMenu from "./MobileMenu";
import AdminLink from "./AdminLink";

export default function Header() {
  return (
    <header className="glass sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* サイト名 */}
        <Link
          href="/"
          className="text-xl font-bold gradient-text tracking-tight"
        >
          🏘️ ポイ活の村
        </Link>

        {/* ナビゲーション + 認証 */}
        <nav className="flex items-center gap-3">
          {/* デスクトップ用リンク */}
          <div className="hidden sm:flex items-center gap-1 text-sm font-medium">
            {[
              { href: "/board", label: "掲示板" },
              { href: "/reviews", label: "レビュー" },
              { href: "/guide", label: "初心者ガイド" },
              { href: "/mypage", label: "マイページ" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative px-3 py-1.5 text-gray-500 hover:text-village-pink-500 transition-colors duration-200 rounded-lg hover:bg-village-pink-50/60 group"
              >
                {item.label}
                <span className="absolute inset-x-3 bottom-0.5 h-0.5 bg-gradient-to-r from-village-pink-400 to-village-purple scale-x-0 group-hover:scale-x-100 transition-transform duration-200 rounded-full" />
              </Link>
            ))}
          </div>

          {/* 管理者リンク */}
          <AdminLink />
          {/* 認証 */}
          <AuthStatus />
          {/* モバイルメニュー */}
          <MobileMenu />
        </nav>
      </div>
    </header>
  );
}
