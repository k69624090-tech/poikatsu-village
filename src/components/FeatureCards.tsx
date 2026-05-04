import Link from "next/link";

const features = [
  {
    emoji: "💬",
    title: "掲示板",
    description:
      "ポイ活の疑問や体験をみんなと共有！初心者質問も大歓迎です。",
    href: "/board",
    gradient: "from-rose-400 to-pink-500",
    bg: "from-rose-50 to-pink-50",
    border: "border-rose-100",
    badge: "bg-rose-100 text-rose-600",
  },
  {
    emoji: "⭐",
    title: "案件レビュー",
    description:
      "実際に試した人のリアルな口コミで、安心して案件を選べます。",
    href: "/reviews",
    gradient: "from-amber-400 to-orange-500",
    bg: "from-amber-50 to-orange-50",
    border: "border-amber-100",
    badge: "bg-amber-100 text-amber-600",
  },
  {
    emoji: "📖",
    title: "初心者ガイド",
    description:
      "ポイ活って何？から始められる、やさしい入門ガイドです。",
    href: "/guide",
    gradient: "from-violet-400 to-purple-500",
    bg: "from-violet-50 to-purple-50",
    border: "border-violet-100",
    badge: "bg-violet-100 text-violet-600",
  },
];

export default function FeatureCards() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* セクションヘッダー */}
        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-village-pink-500 tracking-widest uppercase mb-2">
            Features
          </p>
          <h2 className="text-3xl font-bold text-gray-800">
            ポイ活の村でできること
          </h2>
          <div className="mt-3 mx-auto w-12 h-1 rounded-full bg-gradient-to-r from-village-pink-400 to-village-purple" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <Link
              key={feature.title}
              href={feature.href}
              className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${feature.bg} border ${feature.border} p-7 card-hover`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* グラデーション装飾 */}
              <div
                className={`absolute -top-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br ${feature.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}
              />

              {/* アイコン */}
              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl ${feature.badge} text-2xl mb-4 shadow-sm`}
              >
                {feature.emoji}
              </div>

              <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {feature.description}
              </p>

              {/* 矢印 */}
              <div className="mt-5 flex items-center gap-1 text-xs font-semibold text-gray-400 group-hover:text-village-pink-500 transition-colors duration-200">
                <span>詳しく見る</span>
                <svg
                  className="w-3.5 h-3.5 translate-x-0 group-hover:translate-x-1 transition-transform duration-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
