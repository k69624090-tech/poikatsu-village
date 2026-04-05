import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-b from-village-pink-100 to-village-pink-50 py-16 px-4">
      <div className="max-w-3xl mx-auto text-center">
        {/* メインタイトル */}
        <h1 className="text-4xl md:text-5xl font-bold text-village-pink-600 mb-4">
          🏘️ ポイ活の村
        </h1>

        {/* キャッチコピー */}
        <p className="text-lg md:text-xl text-gray-600 mb-2">
          初心者でも安心のポイ活コミュニティ
        </p>
        <p className="text-sm text-gray-500 mb-8">
          みんなで情報交換しながら、楽しくポイ活しよう！
        </p>

        {/* CTAボタン */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/board"
            className="inline-block bg-village-pink-500 text-white px-8 py-3 rounded-full font-medium hover:bg-village-pink-600 transition-colors shadow-md"
          >
            💬 掲示板を見る
          </Link>
          <Link
            href="/reviews"
            className="inline-block bg-white text-village-pink-500 border-2 border-village-pink-300 px-8 py-3 rounded-full font-medium hover:bg-village-pink-50 transition-colors shadow-md"
          >
            ⭐ レビューを見る
          </Link>
        </div>
      </div>
    </section>
  );
}
