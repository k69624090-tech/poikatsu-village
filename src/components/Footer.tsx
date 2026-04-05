import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-village-pink-200 py-8 px-4 mt-auto">
      <div className="max-w-5xl mx-auto text-center">
        <div className="flex justify-center gap-6 text-sm text-gray-500 mb-4">
          <Link href="/board" className="hover:text-village-pink-500 transition-colors">
            掲示板
          </Link>
          <Link href="/reviews" className="hover:text-village-pink-500 transition-colors">
            レビュー
          </Link>
          <Link href="/guide" className="hover:text-village-pink-500 transition-colors">
            初心者ガイド
          </Link>
        </div>
        <p className="text-xs text-gray-400">
          &copy; 2026 ポイ活の村 All rights reserved.
        </p>
      </div>
    </footer>
  );
}
