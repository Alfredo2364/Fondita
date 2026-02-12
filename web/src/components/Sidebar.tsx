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
    ChartBarIcon,
    ArchiveBoxIcon,
    Cog6ToothIcon,
    Bars3Icon,
    XMarkIcon,
    ArrowLeftOnRectangleIcon,
    UserCircleIcon,
    BanknotesIcon,
    MapIcon,
    ClockIcon,
    SparklesIcon,
    TagIcon // Added TagIcon
} from '@heroicons/react/24/outline';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Menu', href: '/dashboard/menu', icon: BookOpenIcon },
    { name: 'Mesas', href: '/dashboard/tables', icon: MapIcon }, // New Item
    { name: 'Cocina (Pedidos)', href: '/dashboard/orders', icon: ClipboardDocumentListIcon },
    { name: 'Punto de Venta (POS)', href: '/dashboard/pos', icon: CurrencyDollarIcon },
    { name: 'Reportes (Jefe)', href: '/dashboard/reports', icon: ChartBarIcon },
    { name: 'Gastos', href: '/dashboard/expenses', icon: BanknotesIcon, roles: ['admin'] }, // Added roles
    { name: 'Promociones', href: '/dashboard/promos', icon: TagIcon, roles: ['admin'] }, // Added Promociones
    { name: 'Inventario (Stock)', href: '/dashboard/inventory', icon: ArchiveBoxIcon },
    { name: 'Asistencia', href: '/dashboard/attendance', icon: ClockIcon },
    { name: 'Propinas', href: '/dashboard/tips', icon: SparklesIcon }, // New Item
    { name: 'Empleados', href: '/dashboard/employees', icon: UserCircleIcon },
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
            return ['Dashboard', 'Cocina (Pedidos)', 'Punto de Venta (POS)', 'Asistencia', 'Propinas'].includes(item.name);
        }
        return false;
    });

    return (
        <div className="flex h-full w-64 flex-col border-r bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 shadow-2xl relative z-20">
            <div className="flex h-20 items-center justify-center border-b border-gray-100 dark:border-zinc-800 bg-gradient-to-br from-orange-500 to-red-600">
                <h1 className="text-2xl font-extrabold text-white tracking-widest uppercase" style={{ textShadow: "0px 2px 4px rgba(0,0,0,0.3)" }}>
                    Fondita 3D
                </h1>
            </div>

            <nav className="flex-1 space-y-2 px-3 py-6 overflow-y-auto custom-scrollbar">
                {filteredNavigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.name} href={item.href}>
                            <div
                                className={`group relative flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${isActive
                                    ? 'bg-white text-orange-600 shadow-lg translate-x-2'
                                    : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600 dark:text-gray-400 dark:hover:bg-zinc-800 dark:hover:text-white'
                                    }`}
                                style={{
                                    transform: isActive ? "perspective(500px) rotateY(10deg) scale(1.05)" : "none",
                                    transformOrigin: "left center"
                                }}
                            >
                                {/* Active Indicator (3D Bar) */}
                                {isActive && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-md bg-orange-600 h-full shadow-[0_0_10px_rgba(234,88,12,0.6)]" />
                                )}

                                <item.icon
                                    className={`mr-4 h-6 w-6 flex-shrink-0 transition-transform duration-300 ${isActive ? 'scale-110 drop-shadow-md' : 'group-hover:scale-110'}`}
                                    aria-hidden="true"
                                />
                                <span className={`tracking-wide ${isActive ? 'font-bold' : ''}`}>{item.name}</span>

                                {/* Hover Glow */}
                                <div className="absolute inset-0 rounded-xl bg-orange-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 bg-gray-50 dark:bg-zinc-950/50 border-t border-gray-200 dark:border-zinc-800">
                <div className="flex items-center mb-4 px-2">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-orange-400 to-red-500 flex items-center justify-center shadow-lg text-white font-bold text-lg">
                        {user?.email?.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-3 overflow-hidden">
                        <p className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate">
                            {user?.email}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize bg-gray-200 dark:bg-zinc-800 px-2 py-0.5 rounded-full inline-block mt-0.5">
                            {role}
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center rounded-xl bg-white border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-700 shadow-sm hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all active:scale-95 dark:bg-zinc-800 dark:border-zinc-700 dark:text-gray-300 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                >
                    <ArrowLeftOnRectangleIcon className="mr-2 h-5 w-5" />
                    Cerrar Sesión
                </button>
            </div>
        </div>
    );
}
