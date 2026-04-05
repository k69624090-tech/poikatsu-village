import Link from "next/link";

const features = [
  {
    emoji: "💬",
    title: "掲示板",
    description:
      "ポイ活の疑問や体験をみんなと共有！初心者質問も大歓迎です。",
    href: "/board",
    color: "bg-village-pink-100",
  },
  {
    emoji: "⭐",
    title: "案件レビュー",
    description:
      "実際に試した人のリアルな口コミで、安心して案件を選べます。",
    href: "/reviews",
    color: "bg-orange-50",
  },
  {
    emoji: "📖",
    title: "初心者ガイド",
    description:
      "ポイ活って何？から始められる、やさしい入門ガイドです。",
    href: "/guide",
    color: "bg-purple-50",
  },
];

export default function FeatureCards() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-10">
          ポイ活の村でできること
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className={`${feature.color} rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-village-pink-100`}
            >
              <div className="text-4xl mb-3">{feature.emoji}</div>
              <h3 className="text-lg font-bold text-gray-700 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {feature.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
