'use client';

import { useState, useEffect } from 'react';
import { addTip, getTips, TipRecord } from '@/lib/firebase/tips';
import { getUsers } from '@/lib/firebase/users';
import { User } from '@/types';
import { CurrencyDollarIcon, UserGroupIcon, BanknotesIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

export const dynamic = 'force-dynamic';

export default function TipsPage() {
    const [tips, setTips] = useState<TipRecord[]>([]);
    const [employees, setEmployees] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [amount, setAmount] = useState('');
    const [employeeId, setEmployeeId] = useState('');
    const [method, setMethod] = useState<'cash' | 'card' | 'transfer'>('cash');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const [tipsData, usersData] = await Promise.all([
            getTips(),
            getUsers()
        ]);
        setTips(tipsData);
        setEmployees(usersData);
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const empName = employees.find(e => e.uid === employeeId)?.name || 'General (Pozo)';
            await addTip(employeeId || 'pool', empName, parseFloat(amount), method, notes);
            alert('Propina registrada correctamente');
            setAmount('');
            setNotes('');
            loadData(); // Refresh
        } catch (error) {
            console.error(error);
            alert('Error al registrar propina');
        }
    };

    const totalTips = tips.reduce((acc, t) => acc + t.amount, 0);

    return (
        <div className="p-8 bg-gray-50 dark:bg-zinc-950 min-h-screen font-sans relative overflow-hidden">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[10%] right-[40%] w-[400px] h-[400px] bg-yellow-500/10 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-[20%] left-[10%] w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[120px] animate-pulse delay-500" />
            </div>

            <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative z-10 mb-8 perspective-1000"
            >
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-amber-600 dark:from-yellow-400 dark:to-amber-500 drop-shadow-sm">
                    GESTIÓN DE PROPINAS
                </h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium mt-1 text-lg">
                    Registro y distribución de ingresos extra
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
                {/* Form Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-zinc-800 lg:col-span-1"
                >
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <BanknotesIcon className="w-8 h-8 text-green-500" />
                        Registrar Propina
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="text-sm font-bold text-gray-500">Monto ($)</label>
                            <input
                                type="number"
                                className="w-full mt-1 px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-800 border-none focus:ring-2 focus:ring-yellow-500 dark:text-white text-2xl font-mono font-bold"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                placeholder="0.00"
                                required
                            />
                        </div>

                        <div>
                            <label className="text-sm font-bold text-gray-500">Beneficiario</label>
                            <select
                                className="w-full mt-1 px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-800 border-none focus:ring-2 focus:ring-yellow-500 dark:text-white"
                                value={employeeId}
                                onChange={e => setEmployeeId(e.target.value)}
                            >
                                <option value="">Pozo General (Todos)</option>
                                {employees.map(emp => (
                                    <option key={emp.uid} value={emp.uid}>{emp.name || emp.email}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-bold text-gray-500">Método de Pago</label>
                            <div className="grid grid-cols-3 gap-2 mt-1">
                                {['cash', 'card', 'transfer'].map((m) => (
                                    <button
                                        key={m}
                                        type="button"
                                        onClick={() => setMethod(m as any)}
                                        className={`py-2 rounded-lg text-sm font-bold uppercase transition-all ${method === m
                                            ? 'bg-yellow-500 text-white shadow-lg'
                                            : 'bg-gray-100 text-gray-400 dark:bg-zinc-800'
                                            }`}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-bold text-gray-500">Nota (Opcional)</label>
                            <input
                                className="w-full mt-1 px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-800 border-none focus:ring-2 focus:ring-yellow-500 dark:text-white"
                                value={notes}
                                onChange={e => setNotes(e.target.value)}
                                placeholder="Ej: Mesa 4, excelente servicio"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 text-white font-black text-lg hover:shadow-lg hover:shadow-yellow-500/30 transition-all active:scale-95"
                        >
                            Guardar Propina
                        </button>
                    </form>
                </motion.div>

                {/* Stats & List Section */}
                <div className="lg:col-span-2 space-y-6">
                    {/* KPI Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-20">
                            <CurrencyDollarIcon className="w-32 h-32" />
                        </div>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-2">Total Acumulado</p>
                        <h3 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
                            ${totalTips.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </h3>
                    </motion.div>

                    {/* List */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-gray-100 dark:border-zinc-800 overflow-hidden"
                    >
                        <div className="px-8 py-6 border-b border-gray-100 dark:border-zinc-800">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <UserGroupIcon className="w-6 h-6 text-yellow-500" />
                                Historial Reciente
                            </h3>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-100 dark:divide-zinc-800">
                                <thead className="bg-gray-50 dark:bg-zinc-800/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Fecha</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Empleado</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Nota</th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Monto</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-100 dark:divide-zinc-800">
                                    {loading ? (
                                        <tr><td colSpan={4} className="py-10 text-center text-gray-400">Cargando...</td></tr>
                                    ) : tips.length === 0 ? (
                                        <tr><td colSpan={4} className="py-10 text-center text-gray-400">No hay propinas registradas.</td></tr>
                                    ) : (
                                        tips.map((tip) => (
                                            <tr key={tip.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {tip.date.toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 rounded-lg text-xs font-bold ${tip.employeeId === 'pool'
                                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                                        : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                                                        }`}>
                                                        {tip.employeeName}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs block">
                                                    {tip.notes || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-gray-900 dark:text-white">
                                                    ${tip.amount.toFixed(2)}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
