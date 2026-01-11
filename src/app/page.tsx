import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex flex-col items-center justify-center p-8 font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-4xl w-full text-center space-y-12">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 animate-fade-in-up">
            ITパスポート<br className="md:hidden" />略語マスター
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-100">
            試験によく出る「アルファベット3文字」の用語を<br />
            クイズ形式で楽しく攻略しよう！
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-3xl mx-auto animate-fade-in-up delay-200">
          <FeatureCard
            emoji="🚀"
            title="サクサク学習"
            description="スキマ時間にスマホで手軽に学べる4択クイズ形式"
          />
          <FeatureCard
            emoji="📊"
            title="苦手を克服"
            description="間違えた問題だけを復習できる機能を搭載予定"
          />
          <FeatureCard
            emoji="🎯"
            title="スコア管理"
            description="自分の成長を可視化してモチベーションアップ"
          />
        </div>

        <div className="pt-8 animate-fade-in-up delay-300">
          <Link
            href="/quiz"
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-blue-600 rounded-full hover:bg-blue-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg hover:shadow-xl"
          >
            <span className="mr-2">今すぐ始める</span>
            <svg
              className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
            <div className="absolute inset-0 rounded-full ring-4 ring-white/30 group-hover:ring-8 group-hover:ring-white/10 transition-all duration-500" />
          </Link>
        </div>
      </main>

      <footer className="mt-24 text-gray-500 text-sm">
        © 2024 IT Passport Study App. Powered by Next.js & Tailwind CSS.
      </footer>
    </div>
  );
}

function FeatureCard({
  emoji,
  title,
  description,
}: {
  emoji: string;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 hover:shadow-md transition-shadow">
      <div className="text-4xl mb-4">{emoji}</div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
