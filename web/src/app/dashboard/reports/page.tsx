'use client';

import { useState, useEffect } from 'react';
import { getSales } from '@/lib/firebase/sales';
import { Sale } from '@/types';
import { CurrencyDollarIcon, PresentationChartLineIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

const RESTAURANT_ID = 'default_restaurant';

export default function ReportsPage() {
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);

    // Stats
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [ticketAverage, setTicketAverage] = useState(0);

    useEffect(() => {
        loadSales();
    }, []);

    const loadSales = async () => {
        setLoading(true);
        try {
            const data = await getSales(RESTAURANT_ID);
            setSales(data);
            calculateStats(data);
        } catch (error) {
            console.error('Error loading sales:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (data: Sale[]) => {
        const total = data.reduce((acc, sale) => acc + sale.total, 0);
        const count = data.length;
        setTotalRevenue(total);
        setTotalOrders(count);
        setTicketAverage(count > 0 ? total / count : 0);
    };

    return (
        <div className="p-8 bg-gray-50 dark:bg-zinc-950 min-h-screen font-sans overflow-hidden relative">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[10%] right-[20%] w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[10%] left-[10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] animate-pulse delay-700" />
            </div>

            <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative z-10 mb-8 perspective-1000"
            >
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-500 drop-shadow-sm">
                    REPORTE FINANCIERO 3D
                </h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium mt-1 text-lg">
                    Visión clara y estilizada de tu negocio
                </p>
            </motion.div>

            {/* 3D KPI Cards */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 perspective-1000">
                <StatCard
                    title="Ventas Totales"
                    value={`$${totalRevenue.toFixed(2)}`}
                    icon={CurrencyDollarIcon}
                    color="text-green-600 dark:text-green-400"
                    bgColor="bg-green-50 dark:bg-green-900/20"
                    borderColor="border-green-100 dark:border-green-800/50"
                    shadowColor="shadow-green-500/20"
                    index={0}
                />
                <StatCard
                    title="Pedidos Totales"
                    value={totalOrders.toString()}
                    icon={ShoppingBagIcon}
                    color="text-blue-600 dark:text-blue-400"
                    bgColor="bg-blue-50 dark:bg-blue-900/20"
                    borderColor="border-blue-100 dark:border-blue-800/50"
                    shadowColor="shadow-blue-500/20"
                    index={1}
                />
                <StatCard
                    title="Ticket Promedio"
                    value={`$${ticketAverage.toFixed(2)}`}
                    icon={PresentationChartLineIcon}
                    color="text-purple-600 dark:text-purple-400"
                    bgColor="bg-purple-50 dark:bg-purple-900/20"
                    borderColor="border-purple-100 dark:border-purple-800/50"
                    shadowColor="shadow-purple-500/20"
                    index={2}
                />
            </div>

            {/* Recent Sales List */}
            <motion.div
                initial={{ opacity: 0, y: 50, rotateX: 5 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="relative z-10 bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-gray-100 dark:border-zinc-800 overflow-hidden transform-style-3d group hover:shadow-2xl transition-shadow duration-500"
            >
                <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-transparent pointer-events-none" />

                <div className="px-8 py-6 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center relative z-10">
                    <h3 className="text-xl font-extrabold text-gray-800 dark:text-gray-200 tracking-tight">
                        📊 Últimas Ventas en Tiempo Real
                    </h3>
                    <div className="flex gap-2">
                        <span className="flex h-3 w-3 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                    </div>
                </div>

                <div className="overflow-x-auto relative z-10">
                    <table className="min-w-full divide-y divide-gray-100 dark:divide-zinc-800">
                        <thead className="bg-gray-50/50 dark:bg-zinc-800/50">
                            <tr>
                                <th className="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">ID</th>
                                <th className="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Fecha</th>
                                <th className="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Método</th>
                                <th className="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Items</th>
                                <th className="px-8 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Total</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white/50 divide-y divide-gray-100 dark:bg-zinc-900/50 dark:divide-zinc-800 backdrop-blur-sm">
                            <AnimatePresence>
                                {loading ? (
                                    <tr><td colSpan={5} className="text-center py-10 font-bold text-gray-400 animate-pulse">Analizando datos...</td></tr>
                                ) : sales.length === 0 ? (
                                    <tr><td colSpan={5} className="text-center py-10 font-bold text-gray-400">Sin ventas registradas hoy.</td></tr>
                                ) : (
                                    sales.map((sale, i) => (
                                        <motion.tr
                                            key={sale.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 + (i * 0.05) }}
                                            whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.05)", scale: 1.01, zIndex: 10 }}
                                            className="transition-colors cursor-default"
                                        >
                                            <td className="px-8 py-5 whitespace-nowrap text-sm font-mono text-gray-400 dark:text-gray-500">
                                                #{sale.id.substring(0, 6)}
                                            </td>
                                            <td className="px-8 py-5 whitespace-nowrap text-sm font-medium text-gray-700 dark:text-gray-300">
                                                {sale.timestamp.toLocaleDateString()} <span className="text-gray-400 text-xs ml-1">{sale.timestamp.toLocaleTimeString()}</span>
                                            </td>
                                            <td className="px-8 py-5 whitespace-nowrap">
                                                <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide border ${sale.paymentMethod === 'cash'
                                                    ? 'bg-green-50 text-green-600 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30'
                                                    : 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800/30'
                                                    }`}>
                                                    {sale.paymentMethod}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate font-medium">
                                                {sale.items.map(i => `${i.quantity} ${i.name}`).join(', ')}
                                            </td>
                                            <td className="px-8 py-5 whitespace-nowrap text-right">
                                                <span className="text-lg font-black text-gray-900 dark:text-green-400 tracking-tight">
                                                    ${sale.total.toFixed(2)}
                                                </span>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color, bgColor, borderColor, shadowColor, index }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20, rotateX: 10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5, type: "spring" }}
            whileHover={{ y: -10, rotateX: 5, scale: 1.03 }}
            className={`group relative bg-white dark:bg-zinc-900 rounded-[2rem] p-6 border ${borderColor} shadow-xl ${shadowColor} transform-style-3d overflow-hidden`}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between">
                <div className={`p-4 rounded-2xl ${bgColor} ${color} shadow-inner`}>
                    <Icon className="h-8 w-8" />
                </div>
                <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full ${bgColor} blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-500`} />
            </div>

            <div className="mt-6 relative z-10">
                <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{title}</p>
                <div className="flex items-baseline gap-1">
                    <p className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">{value}</p>
                </div>
            </div>
        </motion.div>
    );
}
