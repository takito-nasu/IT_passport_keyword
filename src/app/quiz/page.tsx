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
        <main className="min-h-screen bg-gray-50 dark:bg-slate-900 font-[family-name:var(--font-geist-sans)] transition-colors duration-300">
            {keywords.length > 0 ? (
                <QuizCoordinator allKeywords={keywords} />
            ) : (
                <div className="flex items-center justify-center min-h-screen p-4">
                    <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-red-100 dark:border-red-900/30 max-w-md w-full">
                        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">データが見つかりません</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            問題データの取得に失敗したか、データが登録されていません。<br />
                            Supabaseの接続設定やデータを確認してください。
                        </p>
                        <div className="text-sm text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-slate-900 p-4 rounded-lg text-left overflow-auto max-h-40">
                            Setting Check:<br />
                            - NEXT_PUBLIC_SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing'}<br />
                            - NEXT_PUBLIC_SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing'}
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
