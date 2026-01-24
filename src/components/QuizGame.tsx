"use client";

import { useState, useEffect } from "react";
import { Keyword } from "@/types/keyword";
import Link from "next/link";

type QuizGameProps = {
    allKeywords: Keyword[];
};

export default function QuizGame({ allKeywords }: QuizGameProps) {
    const [questions, setQuestions] = useState<Keyword[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [choices, setChoices] = useState<string[]>([]);

    // Initialize game
    useEffect(() => {
        // Shuffle and pick 10 questions (or less if not enough data)
        const shuffled = [...allKeywords].sort(() => 0.5 - Math.random());
        setQuestions(shuffled.slice(0, 10));
    }, [allKeywords]);

    // Generate choices for current question
    useEffect(() => {
        if (questions.length === 0 || isFinished) return;

        const currentQ = questions[currentIndex];
        const otherKeywords = allKeywords.filter((k) => k.id !== currentQ.id);
        const shuffledOthers = otherKeywords.sort(() => 0.5 - Math.random());
        const distractors = shuffledOthers.slice(0, 3).map((k) => k.meaning_jp);

        // Combine correct answer and distractors, then shuffle
        const allChoices = [currentQ.meaning_jp, ...distractors].sort(
            () => 0.5 - Math.random()
        );
        setChoices(allChoices);
        setSelectedChoice(null);
        setShowExplanation(false);
    }, [currentIndex, questions, allKeywords, isFinished]);

    const handleAnswer = (choice: string) => {
        if (showExplanation) return; // Prevent double clicking

        setSelectedChoice(choice);
        setShowExplanation(true);

        if (choice === questions[currentIndex].meaning_jp) {
            setScore((prev) => prev + 1);
        }
    };

    const handleNext = () => {
        if (currentIndex + 1 < questions.length) {
            setCurrentIndex((prev) => prev + 1);
        } else {
            setIsFinished(true);
        }
    };

    if (questions.length === 0) {
        return <div className="p-8 text-center">Loading...</div>;
    }

    if (isFinished) {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 text-center animate-fade-in-up">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">結果発表！</h2>
                <div className="text-6xl font-black text-blue-600 dark:text-blue-400 mb-4">
                    {score} <span className="text-2xl text-gray-400 dark:text-gray-500">/ {questions.length}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                    {score === questions.length
                        ? "素晴らしい！全問正解です！🎉"
                        : score >= questions.length * 0.7
                            ? "おしい！もう少しで満点です！👍"
                            : "繰り返し練習して覚えましょう！💪"}
                </p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-colors"
                    >
                        もう一度挑戦
                    </button>
                    <Link
                        href="/"
                        className="px-6 py-3 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-full font-bold hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                    >
                        トップへ戻る
                    </Link>
                </div>
            </div>
        );
    }

    const currentQ = questions[currentIndex];
    const isCorrect = selectedChoice === currentQ.meaning_jp;

    return (
        <div className="w-full h-dvh flex flex-col overflow-hidden bg-gray-50 dark:bg-slate-900 relative">
            {/* Header Area */}
            <div className="flex-none p-4">
                {/* Progress Bar */}
                <div className="flex items-center justify-between text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                    <span>Q {currentIndex + 1} / {questions.length}</span>
                    <span>Score: {score}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-1.5">
                    <div
                        className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                    ></div>
                </div>
            </div>

            {/* Question Card */}
            <div className="flex-none px-4 pb-2 text-center">
                <span className="inline-block px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-[10px] font-semibold mb-2">
                    {currentQ.category}
                </span>
                <h2 className="text-3xl font-black tracking-tight text-gray-800 dark:text-white mb-1">
                    {currentQ.abbreviation}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">の意味は？</p>
            </div>

            {/* Choices Area */}
            <div className="flex-1 px-4 pb-20 overflow-y-auto flex flex-col justify-center gap-3">
                {choices.map((choice, idx) => {
                    let buttonStyle = "bg-white hover:bg-gray-50 dark:bg-slate-800 dark:hover:bg-slate-700 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 shadow-sm";

                    if (showExplanation) {
                        if (choice === currentQ.meaning_jp) {
                            buttonStyle = "bg-green-100 border-green-300 text-green-800 font-bold ring-2 ring-green-400 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"; // Correct answer
                        } else if (choice === selectedChoice) {
                            buttonStyle = "bg-red-100 border-red-300 text-red-800 ring-2 ring-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800"; // Wrong selection
                        } else {
                            buttonStyle = "bg-gray-50 text-gray-400 opacity-50 dark:bg-slate-800 dark:text-gray-600"; // Others
                        }
                    }

                    return (
                        <button
                            key={idx}
                            onClick={() => handleAnswer(choice)}
                            disabled={showExplanation}
                            className={`w-full py-4 px-5 text-left rounded-xl border transition-all duration-200 flex items-center justify-between ${buttonStyle}`}
                        >
                            <span className="text-sm font-medium">{choice}</span>
                            {showExplanation && choice === currentQ.meaning_jp && (
                                <svg className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            )}
                            {showExplanation && choice === selectedChoice && choice !== currentQ.meaning_jp && (
                                <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Explanation Bottom Sheet */}
            <div
                className={`absolute bottom-0 left-0 w-full bg-slate-800 text-white p-6 rounded-t-3xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.3)] transition-transform duration-300 ease-out z-20 ${showExplanation ? 'translate-y-0' : 'translate-y-full'}`}
            >
                <div className="flex items-center justify-between">
                    <div className="flex-1 pr-4">
                        <div className="flex items-center gap-2 mb-1">
                            {isCorrect ? (
                                <span className="flex items-center gap-1 text-green-400 font-bold text-lg">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    正解
                                </span>
                            ) : (
                                <span className="flex items-center gap-1 text-red-400 font-bold text-lg">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    不正解
                                </span>
                            )}
                        </div>
                        <h3 className="text-xl font-bold text-white leading-tight mb-1">{currentQ.meaning_jp}</h3>
                        <p className="text-xs text-slate-400 font-mono">{currentQ.full_english_name}</p>
                    </div>

                    <button
                        onClick={handleNext}
                        className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 active:scale-95 transition-all text-white flex-shrink-0"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
