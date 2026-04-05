import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function GuidePage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-village-pink-50 py-8 px-4">
        <div className="max-w-3xl mx-auto space-y-6">

          {/* ページタイトル */}
          <div className="text-center py-6">
            <h1 className="text-3xl font-bold text-village-pink-600 mb-2">
              🌱 初心者ガイド
            </h1>
            <p className="text-gray-500 text-sm">
              ポイ活を安全に・楽しく始めるためのガイドです
            </p>
          </div>

          {/* 1. ポイ活とは */}
          <section className="bg-white rounded-2xl shadow-sm p-6 border border-village-pink-100">
            <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
              <span className="text-village-pink-500">①</span> ポイ活とは？
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              ポイ活（ポイント活動）とは、クレジットカードの発行・アプリのインストール・サービスの登録などをきっかけに
              ポイントや現金を受け取る活動です。うまく活用すれば、日々の生活費の節約や副収入につながります。
            </p>
            <div className="bg-village-pink-50 rounded-xl p-4">
              <p className="text-sm font-medium text-gray-600 mb-2">こんな人に向いています</p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>・ 無理なく少しずつ節約したい方</li>
                <li>・ スマホやパソコンを日常的に使う方</li>
                <li>・ コツコツ積み重ねるのが好きな方</li>
              </ul>
            </div>
          </section>

          {/* 2. 始める前の注意点 */}
          <section className="bg-white rounded-2xl shadow-sm p-6 border border-village-pink-100">
            <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
              <span className="text-village-pink-500">②</span> 始める前の注意点
            </h2>
            <ul className="space-y-3">
              {[
                { icon: "⚠️", text: "怪しい案件には手を出さない。公式サービス経由の案件を選ぼう" },
                { icon: "🔒", text: "個人情報の入力が必要な案件は、信頼できるサービスか確認してから" },
                { icon: "💳", text: "案件をこなすために無理に課金・購入しない" },
                { icon: "⏳", text: "すぐ大きく稼げると思いすぎない。地道に積み重ねるものです" },
              ].map((item) => (
                <li key={item.text} className="flex items-start gap-3 text-sm text-gray-600">
                  <span className="text-lg leading-none">{item.icon}</span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 3. 初心者におすすめの進め方 */}
          <section className="bg-white rounded-2xl shadow-sm p-6 border border-village-pink-100">
            <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
              <span className="text-village-pink-500">③</span> おすすめの進め方
            </h2>
            <ol className="space-y-3">
              {[
                "まずは少額・低リスクの案件から試してみる",
                "レビューを読んで、実際の体験談を参考にする",
                "わからないことは掲示板で気軽に質問する",
                "焦らず、コツコツ継続することが大事",
              ].map((text, i) => (
                <li key={text} className="flex items-start gap-3 text-sm text-gray-600">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-village-pink-100 text-village-pink-600 text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{text}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* 4. このサイトの使い方 */}
          <section className="bg-white rounded-2xl shadow-sm p-6 border border-village-pink-100">
            <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
              <span className="text-village-pink-500">④</span> このサイトの使い方
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { icon: "💬", title: "掲示板", desc: "質問・相談・情報共有ができます" },
                { icon: "⭐", title: "レビュー", desc: "案件の体験談・評価を確認できます" },
                { icon: "🔍", title: "検索・フィルター", desc: "難易度・危険度・キーワードで絞れます" },
                { icon: "👤", title: "マイページ", desc: "自分の投稿やレビューをまとめて確認できます" },
              ].map((item) => (
                <div key={item.title} className="bg-village-pink-50 rounded-xl p-4">
                  <p className="font-medium text-gray-700 text-sm mb-1">
                    {item.icon} {item.title}
                  </p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 5. 危険案件を見分けるポイント */}
          <section className="bg-white rounded-2xl shadow-sm p-6 border border-red-100">
            <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
              <span className="text-red-400">⑤</span> 危険案件を見分けるポイント
            </h2>
            <ul className="space-y-2">
              {[
                "条件が複雑すぎてわかりにくい",
                "広告感・勧誘感が強すぎる",
                "口コミ・レビューが極端に少ない",
                "報酬が高すぎて不自然に感じる",
              ].map((text) => (
                <li key={text} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-red-400">🚩</span>
                  {text}
                </li>
              ))}
            </ul>
            <p className="text-xs text-gray-400 mt-4">
              少しでも不安を感じたら、無理に進めず掲示板で相談しましょう。
            </p>
          </section>

          {/* 6. 最後の案内 */}
          <section className="bg-village-pink-500 rounded-2xl p-6 text-white text-center">
            <p className="font-bold text-lg mb-2">まずは気軽に始めてみましょう！</p>
            <p className="text-sm text-village-pink-100 mb-5">
              不安なことは掲示板でいつでも相談できます。安全そうな案件から少しずつ試してみてください。
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/reviews"
                className="bg-white text-village-pink-600 px-6 py-2 rounded-full text-sm font-medium hover:bg-village-pink-50 transition-colors"
              >
                ⭐ レビューを見る
              </Link>
              <Link
                href="/board"
                className="bg-village-pink-400 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-village-pink-300 transition-colors"
              >
                💬 掲示板で相談する
              </Link>
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}
