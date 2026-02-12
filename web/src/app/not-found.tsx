import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-800 dark:text-gray-200">
            <h2 className="text-4xl font-black mb-4">404 - Página No Encontrada</h2>
            <p className="mb-8 text-lg">Lo sentimos, no pudimos encontrar la página que buscas.</p>
            <Link
                href="/dashboard"
                className="px-6 py-3 bg-orange-600 text-white font-bold rounded-xl shadow-lg hover:bg-orange-700 transition"
            >
                Volver al Dashboard
            </Link>
        </div>
    );
}
