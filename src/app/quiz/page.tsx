import { supabase } from '@/lib/supabase';
import { Keyword } from '@/types/keyword';
import Link from 'next/link';
import QuizCoordinator from '@/components/QuizCoordinator';

export const revalidate = 0; // Disable cache for dynamic data

async function getKeywords(): Promise<Keyword[]> {
    const { data, error } = await supabase
        .from('it_abbreviations')
        .select('*');

    if (error) {
        console.error("Error fetching keywords:", error);
        return [];
    }

    return data as Keyword[];
}

export default async function QuizPage() {
    const keywords = await getKeywords();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-[family-name:var(--font-geist-sans)]">
            <header className="bg-white shadow-sm p-4 sticky top-0 z-10 border-b border-gray-100">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
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

            <main className="flex-1 w-full mx-auto p-4 md:p-8 flex flex-col justify-center">
                <QuizCoordinator allKeywords={keywords} />
            </main>
        </div>
    );
}
