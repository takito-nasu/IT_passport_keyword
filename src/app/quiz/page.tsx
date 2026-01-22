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
                {keywords.length > 0 ? (
                    <QuizCoordinator allKeywords={keywords} />
                ) : (
                    <div className="text-center p-8 bg-white rounded-2xl shadow-md border border-red-100">
                        <h2 className="text-2xl font-bold text-red-600 mb-4">データが見つかりません</h2>
                        <p className="text-gray-600 mb-6">
                            問題データの取得に失敗したか、データが登録されていません。<br />
                            Supabaseの接続設定やデータを確認してください。
                        </p>
                        <div className="text-sm text-gray-400 bg-gray-50 p-4 rounded-lg text-left overflow-auto max-h-40">
                            Setting Check:<br />
                            - NEXT_PUBLIC_SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing'}<br />
                            - NEXT_PUBLIC_SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing'}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
