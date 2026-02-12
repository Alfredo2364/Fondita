'use client';

import { useState, useEffect } from 'react';
import { getExpenses, addExpense, deleteExpense, Expense } from '@/lib/firebase/expenses';
import { useAuthStore } from '@/store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import { BanknotesIcon, TrashIcon, PlusIcon, CalendarIcon } from '@heroicons/react/24/outline';

const RESTAURANT_ID = 'default_restaurant';

export default function ExpensesPage() {
    const { user } = useAuthStore();
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await getExpenses(RESTAURANT_ID);
            setExpenses(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addExpense(
                parseFloat(amount),
                description,
                user?.uid || 'unknown',
                user?.displayName || user?.email || 'Staff'
            );
            setIsModalOpen(false);
            setAmount('');
            setDescription('');
            loadData();
        } catch (error) {
            console.error(error);
            alert('Error al registrar gasto');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Eliminar este registro de gasto?')) return;
        try {
            await deleteExpense(id);
            loadData();
        } catch (error) {
            console.error(error);
            alert('Error al eliminar');
        }
    };

    const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);

    return (
        <div className="p-8 bg-gray-50 dark:bg-zinc-950 min-h-screen font-sans overflow-hidden relative">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] bg-red-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[10%] -left-[10%] w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[100px] animate-pulse delay-700" />
            </div>

            <div className="relative z-10 flex justify-between items-center mb-10 perspective-1000">
                <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, type: "spring" }}
                >
                    <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-500 drop-shadow-sm">
                        GASTOS Y COMPRAS
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mt-1 text-lg">
                        Control de caja china e insumos
                    </p>
                </motion.div>

                <motion.button
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.05, translateY: -5, boxShadow: "0 20px 40px -10px rgba(220, 38, 38, 0.5)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsModalOpen(true)}
                    className="bg-gradient-to-br from-red-500 to-orange-600 text-white px-8 py-4 rounded-2xl shadow-xl flex items-center gap-3 font-bold text-lg border-t border-white/20 relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                    <PlusIcon className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
                    <span>Registrar Gasto</span>
                </motion.button>
            </div>

            {/* KPI Card */}
            <div className="relative z-10 mb-8">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-zinc-800 flex items-center justify-between max-w-md bg-gradient-to-r from-white to-red-50 dark:from-zinc-900 dark:to-red-900/10"
                >
                    <div>
                        <p className="text-gray-500 dark:text-gray-400 font-bold uppercase text-xs tracking-wider">Total Gastado (Histórico)</p>
                        <h2 className="text-4xl font-black text-red-600 dark:text-red-500 mt-1">
                            ${totalExpenses.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </h2>
                    </div>
                    <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-2xl">
                        <BanknotesIcon className="h-8 w-8 text-red-600 dark:text-red-400" />
                    </div>
                </motion.div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-500"></div>
                </div>
            ) : (
                <div className="relative z-10 grid gap-4">
                    <AnimatePresence>
                        {expenses.map((expense, i) => (
                            <motion.div
                                key={expense.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-white dark:bg-zinc-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-zinc-800 flex items-center justify-between hover:shadow-md transition-shadow group"
                            >
                                <div className="flex items-center gap-6">
                                    <div className="h-12 w-12 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400 font-bold text-lg">
                                        -{i + 1}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900 dark:text-white capitalize">{expense.description}</h3>
                                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <CalendarIcon className="h-4 w-4" />
                                                {expense.timestamp?.toDate ? expense.timestamp.toDate().toLocaleDateString() : 'Hoy'}
                                            </span>
                                            <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-zinc-800 text-xs font-bold">
                                                Por: {expense.userName}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <span className="text-2xl font-black text-red-600 dark:text-red-500">
                                        -${expense.amount.toFixed(2)}
                                    </span>
                                    <button
                                        onClick={() => handleDelete(expense.id!)}
                                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <TrashIcon className="h-6 w-6" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Add Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setIsModalOpen(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 50 }}
                            className="bg-white dark:bg-zinc-900 rounded-3xl p-8 w-full max-w-md relative z-10 shadow-2xl border border-white/10"
                        >
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Registrar Nuevo Gasto</h2>
                            <form onSubmit={handleAdd} className="space-y-6">
                                <div>
                                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider pl-1">Monto ($)</label>
                                    <input
                                        type="number"
                                        className="w-full mt-2 px-4 py-4 rounded-xl bg-gray-50 dark:bg-zinc-800 border-none focus:ring-4 focus:ring-red-500/20 dark:text-white font-bold text-2xl"
                                        value={amount}
                                        onChange={e => setAmount(e.target.value)}
                                        placeholder="0.00"
                                        required
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider pl-1">Descripción</label>
                                    <textarea
                                        className="w-full mt-2 px-4 py-4 rounded-xl bg-gray-50 dark:bg-zinc-800 border-none focus:ring-4 focus:ring-red-500/20 dark:text-white resize-none font-medium text-lg h-32"
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                        placeholder="Ej. Compra de verdura en el mercado..."
                                        required
                                    />
                                </div>
                                <div className="flex gap-4 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 py-4 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-500 font-bold hover:bg-gray-200"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-4 rounded-xl bg-red-600 text-white font-black text-lg hover:bg-red-700 shadow-lg shadow-red-500/30"
                                    >
                                        Guardar
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
