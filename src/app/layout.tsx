import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ポイ活の村 | 初心者でも安心のポイ活コミュニティ",
  description:
    "ポイ活初心者でも安心して交流・情報交換できるコミュニティサイト。掲示板での質問、案件レビュー、攻略情報が見つかります。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${geistSans.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
