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
            <div className="bg-white rounded-3xl shadow-xl p-8 text-center animate-fade-in-up">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">結果発表！</h2>
                <div className="text-6xl font-black text-blue-600 mb-4">
                    {score} <span className="text-2xl text-gray-400">/ {questions.length}</span>
                </div>
                <p className="text-gray-600 mb-8">
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
                        className="px-6 py-3 bg-gray-100 text-gray-600 rounded-full font-bold hover:bg-gray-200 transition-colors"
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
        <div className="w-full max-w-2xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-6 flex items-center justify-between text-sm font-medium text-gray-500">
                <span>Question {currentIndex + 1} / {questions.length}</span>
                <span>Score: {score}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
                <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                ></div>
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white text-center">
                    <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-semibold mb-3 backdrop-blur-sm">
                        {currentQ.category}
                    </span>
                    <h2 className="text-5xl font-black tracking-tight mb-2">
                        {currentQ.abbreviation}
                    </h2>
                    <p className="opacity-90">この略語の意味は？</p>
                </div>

                <div className="p-6 grid gap-4">
                    {choices.map((choice, idx) => {
                        let buttonStyle = "bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700";

                        if (showExplanation) {
                            if (choice === currentQ.meaning_jp) {
                                buttonStyle = "bg-green-100 border-green-300 text-green-800 font-bold ring-2 ring-green-400"; // Correct answer
                            } else if (choice === selectedChoice) {
                                buttonStyle = "bg-red-100 border-red-300 text-red-800 ring-2 ring-red-300"; // Wrong selection
                            } else {
                                buttonStyle = "bg-gray-50 text-gray-400 opacity-50"; // Others
                            }
                        }

                        return (
                            <button
                                key={idx}
                                onClick={() => handleAnswer(choice)}
                                disabled={showExplanation}
                                className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${buttonStyle}`}
                            >
                                {choice}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Explanation / Next Button */}
            {showExplanation && (
                <div className="mt-6 p-6 bg-blue-50 rounded-2xl border border-blue-100 animate-fade-in-up">
                    <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-full ${isCorrect ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                            {isCorrect ? (
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            )}
                        </div>
                        <h3 className={`text-lg font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                            {isCorrect ? "正解！" : "残念..."}
                        </h3>
                    </div>

                    <p className="text-gray-700 leading-relaxed mb-6">
                        <span className="font-bold text-gray-900">{currentQ.meaning_jp}</span>
                        <br />
                        {currentQ.full_english_name}
                    </p>

                    <button
                        onClick={handleNext}
                        className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 hover:shadow-lg transition-all transform hover:-translate-y-1"
                    >
                        {currentIndex + 1 < questions.length ? "次の問題へ" : "結果を見る"}
                    </button>
                </div>
            )}
        </div>
    );
}
