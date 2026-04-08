"use client";

import { useState } from "react";
import Link from "next/link";

const navItems = [
  { href: "/board", label: "💬 掲示板" },
  { href: "/reviews", label: "⭐ レビュー" },
  { href: "/guide", label: "🌱 初心者ガイド" },
  { href: "/mypage", label: "👤 マイページ" },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden relative">
      {/* ハンバーガーボタン */}
      <button
        onClick={() => setOpen(!open)}
        className="text-gray-600 hover:text-village-pink-500 transition-colors p-1"
        aria-label="メニューを開く"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {open ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* ドロップダウンメニュー */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-village-pink-100 py-2 z-50">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-village-pink-50 hover:text-village-pink-500 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
