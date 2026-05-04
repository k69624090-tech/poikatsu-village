import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-24 px-4 md:py-32">
      {/* 背景グラデーション */}
      <div className="absolute inset-0 bg-gradient-to-br from-village-pink-50 via-white to-purple-50" />

      {/* 装飾ブロブ */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-village-pink-200/40 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-16 w-[28rem] h-[28rem] bg-village-purple/20 rounded-full blur-3xl" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-64 h-64 bg-village-pink-300/20 rounded-full blur-2xl" />

      {/* フローティング装飾 */}
      <div className="absolute top-16 left-[8%] text-3xl animate-float opacity-60 select-none">
        ✨
      </div>
      <div
        className="absolute top-20 right-[10%] text-2xl animate-float-slow opacity-50 select-none"
        style={{ animationDelay: "1.5s" }}
      >
        💰
      </div>
      <div
        className="absolute bottom-20 left-[12%] text-2xl animate-float opacity-50 select-none"
        style={{ animationDelay: "3s" }}
      >
        🎁
      </div>
      <div
        className="absolute bottom-16 right-[8%] text-3xl animate-float-slow opacity-40 select-none"
        style={{ animationDelay: "0.8s" }}
      >
        ⭐
      </div>

      {/* メインコンテンツ */}
      <div className="relative max-w-3xl mx-auto text-center">
        {/* バッジ */}
        <div
          className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-village-pink-200 px-4 py-1.5 rounded-full text-xs font-medium text-village-pink-600 mb-6 shadow-sm animate-fade-in-up"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-village-pink-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-village-pink-500" />
          </span>
          ポイ活情報をみんなでシェア
        </div>

        {/* タイトル */}
        <h1
          className="text-5xl md:text-7xl font-bold mb-5 animate-fade-in-up leading-tight"
          style={{ animationDelay: "0.1s" }}
        >
          <span className="gradient-text-animated">ポイ活の村</span>
        </h1>

        {/* サブタイトル */}
        <p
          className="text-lg md:text-xl text-gray-500 mb-2 font-medium animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          初心者でも安心のポイ活コミュニティ
        </p>
        <p
          className="text-sm text-gray-400 mb-10 animate-fade-in-up"
          style={{ animationDelay: "0.3s" }}
        >
          みんなで情報交換しながら、楽しくポイ活しよう！
        </p>

        {/* CTAボタン */}
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up"
          style={{ animationDelay: "0.4s" }}
        >
          <Link
            href="/board"
            className="btn-primary inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-medium text-sm"
          >
            💬 掲示板を見る
          </Link>
          <Link
            href="/reviews"
            className="inline-flex items-center justify-center gap-2 bg-white text-village-pink-500 border-2 border-village-pink-200 px-8 py-3.5 rounded-full font-medium text-sm hover:border-village-pink-400 hover:bg-village-pink-50 transition-all duration-200 shadow-sm"
          >
            ⭐ レビューを見る
          </Link>
        </div>

        {/* 統計バッジ（装飾） */}
        <div
          className="mt-12 flex flex-wrap justify-center gap-6 animate-fade-in-up"
          style={{ animationDelay: "0.55s" }}
        >
          {[
            { icon: "💬", label: "掲示板で質問" },
            { icon: "⭐", label: "案件をレビュー" },
            { icon: "📖", label: "ガイドで学ぶ" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 text-xs text-gray-400 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-100 shadow-sm"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
