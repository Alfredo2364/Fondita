'use client';

import AuthProvider from '@/components/AuthProvider';
import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-zinc-900">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
                <main className="flex-1 overflow-y-auto p-4 focus:outline-none md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
