"use client";

import { useState, useEffect } from "react";
import { Keyword } from "@/types/keyword";
import Link from "next/link";

type WordShuffleQuizProps = {
    allKeywords: Keyword[];
    mode?: 'random10' | 'all';
};

export default function WordShuffleQuiz({ allKeywords, mode = 'random10' }: WordShuffleQuizProps) {
    const [questions, setQuestions] = useState<Keyword[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    // UI State for the current drag-and-drop / click interaction
    const [poolWords, setPoolWords] = useState<{ id: string, text: string }[]>([]);
    const [selectedWords, setSelectedWords] = useState<{ id: string, text: string }[]>([]);
    const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);

    // Initialize game
    useEffect(() => {
        if (!allKeywords || allKeywords.length === 0) return;

        // Shuffle source keywords
        const shuffled = [...allKeywords].sort(() => 0.5 - Math.random());

        if (mode === 'all') {
            // Use all keywords
            setQuestions(shuffled);
        } else {
            // Pick 10 questions
            setQuestions(shuffled.slice(0, 10));
        }
    }, [allKeywords, mode]);

    // Setup current question
    useEffect(() => {
        if (questions.length === 0 || isFinished) return;

        const currentQ = questions[currentIndex];

        // 1. Get correct words (filter out nulls)
        const correctWords = [
            currentQ.word1,
            currentQ.word2,
            currentQ.word3,
            currentQ.word4,
            currentQ.word5
        ].filter((w): w is string => w !== null && w !== "");

        // 2. Get distractor words from other questions (random 3-5 words)
        const otherKeywords = allKeywords.filter(k => k.id !== currentQ.id);
        const distractors: string[] = [];
        // Flatten all words from other keywords
        const allOtherWords = otherKeywords.flatMap(k => [k.word1, k.word2, k.word3, k.word4, k.word5]).filter((w): w is string => w !== null && w !== "");
        // Shuffle and pick
        const shuffledDistractors = allOtherWords.sort(() => 0.5 - Math.random()).slice(0, 4);

        // 3. Combine and shuffle everything for the pool
        const combined = [...correctWords, ...shuffledDistractors]
            .sort(() => 0.5 - Math.random())
            .map((word, idx) => ({
                id: `${word}-${idx}-${Math.random()}`, // Unique ID for React keys
                text: word
            }));

        setPoolWords(combined);
        setSelectedWords([]);
        setFeedback(null);

    }, [currentIndex, questions, allKeywords, isFinished]);

    const handlePoolWordClick = (wordObj: { id: string, text: string }) => {
        if (feedback) return; // Locked during feedback
        // Move from pool to selected
        setPoolWords(prev => prev.filter(w => w.id !== wordObj.id));
        setSelectedWords(prev => [...prev, wordObj]);
    };

    const handleSelectedWordClick = (wordObj: { id: string, text: string }) => {
        if (feedback) return;
        // Return from selected to pool
        setSelectedWords(prev => prev.filter(w => w.id !== wordObj.id));
        setPoolWords(prev => [...prev, wordObj]);
    };

    const handleSubmit = () => {
        const currentQ = questions[currentIndex];
        const correctWords = [
            currentQ.word1,
            currentQ.word2,
            currentQ.word3,
            currentQ.word4,
            currentQ.word5
        ].filter((w): w is string => w !== null && w !== "");

        // Check if length matches and every word matches in order
        const userSentence = selectedWords.map(w => w.text);

        const isCorrect =
            userSentence.length === correctWords.length &&
            userSentence.every((val, index) => val === correctWords[index]);

        if (isCorrect) {
            setFeedback("correct");
            setScore(prev => prev + 1);
        } else {
            setFeedback("incorrect");
        }
    };

    const handleNext = () => {
        if (currentIndex + 1 < questions.length) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setIsFinished(true);
        }
    };

    if (questions.length === 0) {
        return <div className="p-12 text-center text-xl text-gray-500 animate-pulse">Loading Quiz Data...</div>;
    }

    if (isFinished) {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 text-center animate-fade-in-up border border-gray-100 dark:border-slate-700">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">結果発表！</h2>
                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
                    {score} <span className="text-2xl text-gray-400 dark:text-gray-500">/ {questions.length}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-8 font-medium">
                    {score === questions.length
                        ? "完璧です！正式名称マスターですね！🏆"
                        : "お疲れ様でした！復習して目指せ満点！💪"}
                </p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => window.location.reload()}
                        className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all"
                    >
                        もう一度
                    </button>
                    <Link
                        href="/"
                        className="px-8 py-3 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-full font-bold hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                    >
                        終了する
                    </Link>
                </div>
            </div>
        );
    }

    const currentQ = questions[currentIndex];

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
                <div className="h-6"></div> {/* Spacer for consistent layout */}
            </div>

            {/* Game Area (Scrollable if needed, but flex-1 to fill) */}
            <div className="flex-1 px-4 flex flex-col overflow-y-auto pb-32">
                {/* Construct Area (Selected Words) */}
                <div className="mb-4 flex-none min-h-[140px] flex flex-col justify-center">
                    <p className="text-xs text-gray-400 font-bold mb-2 uppercase tracking-wider text-center">Your Answer</p>
                    <div className={`min-h-[100px] p-4 bg-white dark:bg-slate-800 rounded-2xl border-2 ${feedback === 'correct' ? 'border-green-400 bg-green-50 dark:bg-green-900/20' : feedback === 'incorrect' ? 'border-red-300 bg-red-50 dark:bg-red-900/20' : 'border-blue-200 dark:border-blue-900 border-dashed'} flex flex-wrap gap-2 items-center justify-center transition-all duration-300`}>
                        {selectedWords.length === 0 && !feedback && (
                            <span className="text-gray-400 dark:text-gray-600 text-sm italic">単語をタップして選択</span>
                        )}
                        {selectedWords.map((w) => (
                            <button
                                key={w.id}
                                onClick={() => handleSelectedWordClick(w)}
                                disabled={!!feedback}
                                className="notranslate px-3 py-2 bg-blue-50 dark:bg-slate-700 text-blue-800 dark:text-blue-200 font-bold rounded-lg shadow-sm border border-blue-100 dark:border-slate-600 active:scale-95 animate-fade-in text-sm"
                                translate="no"
                            >
                                {w.text}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Word Pool */}
                <div className="flex-1">
                    <p className="text-xs text-gray-400 font-bold mb-2 uppercase tracking-wider text-center">Word Bank</p>
                    <div className="flex flex-wrap gap-2 justify-center content-start">
                        {poolWords.map((w) => (
                            <button
                                key={w.id}
                                onClick={() => handlePoolWordClick(w)}
                                disabled={!!feedback}
                                className="notranslate px-4 py-3 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 font-bold rounded-xl shadow-sm border border-gray-200 dark:border-slate-600 active:scale-95 transition-all duration-200 text-sm"
                                translate="no"
                            >
                                {w.text}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer Action Button (Answer) - Only show when not in feedback mode */}
            {!feedback && (
                <div className="absolute bottom-6 left-0 w-full px-6">
                    <button
                        onClick={handleSubmit}
                        disabled={selectedWords.length === 0}
                        className="w-full py-4 bg-blue-600 text-white rounded-full font-bold shadow-lg shadow-blue-200/50 disabled:opacity-50 disabled:shadow-none active:scale-95 transition-all text-lg"
                    >
                        回答する
                    </button>
                </div>
            )}

            {/* Explanation Bottom Sheet */}
            <div
                className={`absolute bottom-0 left-0 w-full bg-slate-800 text-white p-6 rounded-t-3xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.3)] transition-transform duration-300 ease-out z-20 ${feedback ? 'translate-y-0' : 'translate-y-full'}`}
            >
                <div className="flex items-center justify-between">
                    <div className="flex-1 pr-4">
                        <div className="flex items-center gap-2 mb-1">
                            {feedback === 'correct' ? (
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
                        <p className="text-xs text-slate-400 font-mono tracking-wide">{currentQ.full_english_name}</p>
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
