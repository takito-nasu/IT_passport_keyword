import { promises as fs } from 'fs';
import path from 'path';
import QuizGame from '@/components/QuizGame';
import { Keyword } from '@/types/keyword';

async function getKeywords(): Promise<Keyword[]> {
    const jsonDirectory = path.join(process.cwd(), 'src', 'data');
    const fileContents = await fs.readFile(path.join(jsonDirectory, 'keywords.json'), 'utf8');
    return JSON.parse(fileContents);
}

export default async function QuizPage() {
    const keywords = await getKeywords();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-[family-name:var(--font-geist-sans)]">
            <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                        略語マスター
                    </h1>
                </div>
            </header>

            <main className="flex-1 max-w-2xl w-full mx-auto p-4 md:p-8 flex flex-col justify-center">
                <QuizGame allKeywords={keywords} />
            </main>
        </div>
    );
}
