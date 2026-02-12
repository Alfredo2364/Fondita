'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { auth } from '@/lib/firebase/firebase';
import {
    HomeIcon,
    BookOpenIcon,
    ClipboardDocumentListIcon,
    CurrencyDollarIcon,
    Cog6ToothIcon,
    UserCircleIcon,
    ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Menu', href: '/dashboard/menu', icon: BookOpenIcon },
    { name: 'Cocina (Pedidos)', href: '/dashboard/orders', icon: ClipboardDocumentListIcon },
    { name: 'Punto de Venta (POS)', href: '/dashboard/pos', icon: CurrencyDollarIcon },
    { name: 'Configuración', href: '/dashboard/settings', icon: Cog6ToothIcon },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { user } = useAuthStore();

    return (
        <div className="flex h-full w-64 flex-col bg-white shadow-lg dark:bg-zinc-800">
            <div className="flex h-16 items-center justify-center border-b dark:border-zinc-700">
                <h1 className="text-xl font-bold text-[var(--primary)]">Fondita Admin</h1>
            </div>
            <div className="flex-1 overflow-y-auto py-4">
                <nav className="space-y-1 px-2">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${isActive
                                    ? 'bg-[var(--primary)] text-white'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-zinc-700 dark:hover:text-white'
                                    }`}
                            >
                                {/* Placeholder Icons */}
                                <span className="mr-3 h-6 w-6 text-center">{item.icon === 'home' ? '🏠' : item.icon === 'menu' ? '🍔' : item.icon === 'clipboard' ? '📋' : '⚙️'}</span>
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>
            <div className="border-t p-4 dark:border-zinc-700">
                <div className="flex items-center">
                    <div className="ml-3">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                            {user?.email}
                        </p>
                        <button
                            onClick={() => auth.signOut()}
                            className="text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
