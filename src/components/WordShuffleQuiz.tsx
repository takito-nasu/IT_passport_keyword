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
            <div className="bg-white rounded-3xl shadow-xl p-8 text-center animate-fade-in-up border border-gray-100">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">結果発表！</h2>
                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
                    {score} <span className="text-2xl text-gray-400">/ {questions.length}</span>
                </div>
                <p className="text-gray-600 mb-8 font-medium">
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
                        className="px-8 py-3 bg-gray-100 text-gray-600 rounded-full font-bold hover:bg-gray-200 transition-colors"
                    >
                        終了する
                    </Link>
                </div>
            </div>
        );
    }

    const currentQ = questions[currentIndex];

    return (
        <div className="w-full max-w-3xl mx-auto font-sans">
            {/* Header / Progress */}
            <div className="mb-8 p-4 bg-white/50 backdrop-blur-sm rounded-2xl flex items-center justify-between border border-gray-200 shadow-sm">
                <span className="font-bold text-gray-700">Question {currentIndex + 1} <span className="text-gray-400 font-normal">/ {questions.length}</span></span>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-blue-600">Score</span>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold">{score}</span>
                </div>
            </div>

            {/* Question Area */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8 border border-gray-100">
                <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-10 text-white text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                    <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-semibold mb-4 backdrop-blur-md">
                        {currentQ.category}
                    </span>
                    <h2 className="notranslate text-6xl font-black tracking-tighter mb-4 filter drop-shadow-md" translate="no">
                        {currentQ.abbreviation}
                    </h2>

                </div>

                {/* Game Area */}
                <div className="p-8 bg-gray-50/50 min-h-[300px] flex flex-col justify-between">

                    {/* Construct Area (Selected Words) */}
                    <div className="mb-8">
                        <p className="text-sm text-gray-500 font-bold mb-3 uppercase tracking-wider">Your Answer</p>
                        <div className={`min-h-[80px] p-4 bg-white rounded-2xl border-2 ${feedback === 'correct' ? 'border-green-400 bg-green-50' : feedback === 'incorrect' ? 'border-red-300 bg-red-50' : 'border-blue-200 border-dashed'} flex flex-wrap gap-2 items-center transition-all duration-300`}>
                            {selectedWords.length === 0 && !feedback && (
                                <span className="text-gray-400 w-full text-center italic">単語を選んで並べてください</span>
                            )}
                            {selectedWords.map((w) => (
                                <button
                                    key={w.id}
                                    onClick={() => handleSelectedWordClick(w)}
                                    disabled={!!feedback}
                                    className="notranslate px-4 py-2 bg-white text-blue-800 font-bold rounded-xl shadow-sm border border-gray-200 hover:border-red-300 hover:text-red-500 hover:shadow-md transition-all active:scale-95 animate-fade-in"
                                    translate="no"
                                >
                                    {w.text}
                                </button>
                            ))}
                        </div>
                        {feedback === 'incorrect' && (
                            <p className="text-red-500 text-sm mt-2 font-bold px-2 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                違うようです...もう一度考えてみましょう（略語の文字と一致しますか？）
                            </p>
                        )}
                    </div>

                    {/* Word Pool */}
                    <div className="mb-8">
                        <p className="text-sm text-gray-500 font-bold mb-3 uppercase tracking-wider">Word Bank</p>
                        <div className="flex flex-wrap gap-3 justify-center">
                            {poolWords.map((w) => (
                                <button
                                    key={w.id}
                                    onClick={() => handlePoolWordClick(w)}
                                    disabled={!!feedback}
                                    className="notranslate px-5 py-3 bg-white text-gray-700 font-bold rounded-xl shadow-sm border border-gray-200 hover:-translate-y-1 hover:shadow-md hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 active:scale-95"
                                    translate="no"
                                >
                                    {w.text}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div>
                        {!feedback ? (
                            <button
                                onClick={handleSubmit}
                                disabled={selectedWords.length === 0}
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 disabled:opacity-50 disabled:shadow-none hover:shadow-xl hover:scale-[1.01] transition-all"
                            >
                                回答する
                            </button>
                        ) : (
                            <div className="animate-fade-in-up">
                                {feedback === 'correct' ? (
                                    <div className="bg-green-100 text-green-800 p-4 rounded-xl mb-4 text-center font-bold border border-green-200">
                                        👏 正解！ <span className="notranslate" translate="no">{currentQ.full_english_name}</span>
                                    </div>
                                ) : (
                                    <div className="bg-red-100 text-red-800 p-4 rounded-xl mb-4 text-center font-bold border border-red-200 block">
                                        ❌ 正解は... <span className="notranslate text-lg" translate="no">{currentQ.full_english_name}</span>
                                    </div>
                                )}
                                <button
                                    onClick={handleNext}
                                    className={`w-full py-4 text-white rounded-xl font-bold shadow-lg transition-all ${feedback === 'correct' ? 'bg-green-500 hover:bg-green-600 shadow-green-200' : 'bg-gray-800 hover:bg-gray-900'}`}
                                >
                                    {currentIndex + 1 < questions.length ? "次の問題へ" : "結果を見る"}
                                </button>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
