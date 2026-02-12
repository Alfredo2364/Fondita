'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
    const router = useRouter();
    const { user, role, setUser } = useAuthStore();

    const handleLogout = async () => {
        await auth.signOut();
        setUser(null, null);
        router.push('/login');
    };

    const filteredNavigation = navigation.filter(item => {
        if (role === 'admin') return true;
        if (role === 'staff') {
            return ['Dashboard', 'Cocina (Pedidos)', 'Punto de Venta (POS)'].includes(item.name);
        }
        return false;
    });

    return (
        <div className="flex h-full w-64 flex-col border-r bg-white dark:bg-zinc-900 dark:border-zinc-800">
            <div className="flex h-16 items-center justify-center border-b px-4 dark:border-zinc-800">
                <h1 className="text-xl font-bold text-[var(--primary)] text-center">
                    Fondita {role === 'admin' ? '(Jefe)' : role === 'staff' ? '(Personal)' : ''}
                </h1>
            </div>

            <nav className="flex-1 space-y-1 px-2 py-4">
                {filteredNavigation.map((item) => {
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
                            <item.icon
                                className={`mr-3 h-6 w-6 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-400'
                                    }`}
                                aria-hidden="true"
                            />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="border-t p-4 dark:border-zinc-700">
                <div className="flex items-center">
                    <UserCircleIcon className="h-9 w-9 text-gray-400" aria-hidden="true" />
                    <div className="ml-3">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                            {user?.email}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                            {role}
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="mt-4 flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-gray-200 dark:hover:bg-zinc-700"
                >
                    <ArrowLeftOnRectangleIcon className="mr-2 h-4 w-4" />
                    Cerrar Sesión
                </button>
            </div>
        </div>
    );
}
