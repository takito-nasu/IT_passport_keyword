"use client";

import { useState, useMemo } from "react";
import { Keyword } from "@/types/keyword";
import WordShuffleQuiz from "./WordShuffleQuiz";

type QuizCoordinatorProps = {
    allKeywords: Keyword[];
};

export default function QuizCoordinator({ allKeywords }: QuizCoordinatorProps) {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [mode, setMode] = useState<'random10' | 'all'>('random10');
    const [isQuizStarted, setIsQuizStarted] = useState(false);

    // Extract unique categories
    const categories = useMemo(() => {
        const cats = Array.from(new Set(allKeywords.map(k => k.category))).filter(Boolean).sort();
        return cats;
    }, [allKeywords]);

    const handleStartRandom = () => {
        setSelectedCategory(null);
        setMode('random10');
        setIsQuizStarted(true);
    };

    const handleStartCategory = (category: string) => {
        setSelectedCategory(category);
        setMode('all');
        setIsQuizStarted(true);
    };

    if (isQuizStarted) {
        // Filter keywords based on selection
        const filteredKeywords = selectedCategory
            ? allKeywords.filter(k => k.category === selectedCategory)
            : allKeywords;

        return (
            <div>
                <button
                    onClick={() => setIsQuizStarted(false)}
                    className="mb-4 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 font-bold"
                >
                    ← カテゴリ選択に戻る
                </button>
                <WordShuffleQuiz
                    key={`${selectedCategory}-${mode}-${Date.now()}`} // Force reset on restart
                    allKeywords={filteredKeywords}
                    mode={mode}
                />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto w-full animate-fade-in-up">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-black text-gray-800 dark:text-white mb-4">学習モードを選択</h2>
                <p className="text-gray-600 dark:text-gray-300">カテゴリを選んで集中特訓するか、ランダムに実力を試そう！</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {/* Random Mode Card */}
                <button
                    onClick={handleStartRandom}
                    className="group relative p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-md border-2 border-transparent hover:border-blue-400 hover:shadow-xl transition-all text-left overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-6xl">
                        🎲
                    </div>
                    <div className="relative z-10">
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold mb-3">
                            おすすめ
                        </span>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">ランダム 10問</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-300">
                            全範囲からランダムに10問出題されます。
                            毎日の運試しや実力確認に最適です。
                        </p>
                    </div>
                </button>

                {/* Category Cards */}
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => handleStartCategory(cat)}
                        className="group relative p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-md border-2 border-transparent hover:border-indigo-400 hover:shadow-xl transition-all text-left overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-6xl">
                            📚
                        </div>
                        <div className="relative z-10">
                            <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold mb-3">
                                カテゴリ別
                            </span>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{cat}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-300">
                                {cat}に関する問題を<span className="text-indigo-600 dark:text-indigo-400 font-bold">全て</span>出題します。
                                苦手分野の克服に！
                            </p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
