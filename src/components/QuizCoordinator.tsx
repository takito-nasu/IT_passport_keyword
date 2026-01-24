"use client";

import { useState, useMemo } from "react";
import { Keyword } from "@/types/keyword";
import WordShuffleQuiz from "./WordShuffleQuiz";
import Link from "next/link";

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
            <div className="h-dvh flex flex-col">
                <button
                    onClick={() => setIsQuizStarted(false)}
                    className="absolute top-4 left-4 z-50 text-sm text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white bg-white/50 dark:bg-black/50 p-2 rounded-full"
                >
                    Close
                </button>
                <WordShuffleQuiz
                    allKeywords={filteredKeywords}
                    mode={mode}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-white dark:bg-slate-900 shadow-sm p-4 sticky top-0 z-10 border-b border-gray-100 dark:border-slate-800">
                <div className="max-w-4xl mx-auto w-full flex justify-between items-center">
                    <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
                        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <span className="text-2xl">🧩</span>
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                                略語マスター
                            </span>
                        </Link>
                    </h1>
                </div>
            </header>

            <div className="flex-1 w-full max-w-2xl mx-auto p-4 md:p-8 flex flex-col justify-center animate-fade-in-up">
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
        </div>
    );
}
