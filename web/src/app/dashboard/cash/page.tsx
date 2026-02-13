'use client';

import { useState, useEffect } from 'react';
import { getOpenCashRegister, openCashRegister, addCashWithdrawal, getWithdrawals, CashRegister, CashWithdrawal } from '@/lib/firebase/cash-register';
import { useAuthStore } from '@/store/useAuthStore';
import { BanknotesIcon, PlusIcon, MinusIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

const RESTAURANT_ID = 'default_restaurant';

export const dynamic = 'force-dynamic';

export default function CashRegisterPage() {
    const { user } = useAuthStore();
    const [cashRegister, setCashRegister] = useState<CashRegister | null>(null);
    const [withdrawals, setWithdrawals] = useState<CashWithdrawal[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'open' | 'withdraw'>('open');

    // Form state
    const [initialFund, setInitialFund] = useState('');
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [withdrawReason, setWithdrawReason] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const register = await getOpenCashRegister(RESTAURANT_ID);
        setCashRegister(register);
        if (register?.id) {
            const withdrawalData = await getWithdrawals(register.id);
            setWithdrawals(withdrawalData);
        }
        setLoading(false);
    };

    const handleOpenRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setSubmitting(true);
        try {
            await openCashRegister({
                restaurantId: RESTAURANT_ID,
                openedBy: user.uid,
                openedByName: user.displayName || user.email || 'Usuario',
                initialFund: parseFloat(initialFund)
            });
            alert('✅ Caja abierta con fondo inicial de $' + initialFund);
            setIsModalOpen(false);
            setInitialFund('');
            loadData();
        } catch (error: any) {
            console.error(error);
            alert('❌ ' + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleWithdrawal = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !cashRegister) return;
        setSubmitting(true);
        try {
            await addCashWithdrawal({
                restaurantId: RESTAURANT_ID,
                registerId: cashRegister.id!,
                amount: parseFloat(withdrawAmount),
                reason: withdrawReason,
                withdrawnBy: user.uid,
                withdrawnByName: user.displayName || user.email || 'Usuario'
            });
            alert('✅ Retiro de $' + withdrawAmount + ' registrado');
            setIsModalOpen(false);
            setWithdrawAmount('');
            setWithdrawReason('');
            loadData();
        } catch (error: any) {
            console.error(error);
            alert('❌ ' + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const totalWithdrawals = withdrawals.reduce((sum, w) => sum + w.amount, 0);
    const currentCash = cashRegister ? cashRegister.initialFund - totalWithdrawals : 0;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-xl">Cargando...</div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white">Gestión de Caja</h1>
                    <p className="text-gray-500 mt-2">Fondo inicial, retiros parciales y arqueo</p>
                </div>
                {!cashRegister ? (
                    <button
                        onClick={() => { setModalType('open'); setIsModalOpen(true); }}
                        className="px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                        <PlusIcon className="h-5 w-5" />
                        Abrir Caja
                    </button>
                ) : (
                    <button
                        onClick={() => { setModalType('withdraw'); setIsModalOpen(true); }}
                        className="px-6 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-colors flex items-center gap-2"
                    >
                        <MinusIcon className="h-5 w-5" />
                        Retiro Parcial
                    </button>
                )}
            </div>

            {!cashRegister ? (
                <div className="bg-white dark:bg-zinc-900 rounded-2xl p-12 text-center">
                    <BanknotesIcon className="h-24 w-24 mx-auto text-gray-300 dark:text-zinc-700 mb-4" />
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">No hay caja abierta</h2>
                    <p className="text-gray-500 mb-6">Abre la caja con un fondo inicial para comenzar</p>
                </div>
            ) : (
                <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <motion.div
                            className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white"
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <CheckCircleIcon className="h-8 w-8" />
                                <h3 className="text-lg font-bold">Fondo Inicial</h3>
                            </div>
                            <p className="text-3xl font-black">${cashRegister.initialFund.toFixed(2)}</p>
                            <p className="text-sm opacity-90 mt-1">Morralla de apertura</p>
                        </motion.div>

                        <motion.div
                            className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white"
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <MinusIcon className="h-8 w-8" />
                                <h3 className="text-lg font-bold">Retiros</h3>
                            </div>
                            <p className="text-3xl font-black">${totalWithdrawals.toFixed(2)}</p>
                            <p className="text-sm opacity-90 mt-1">{withdrawals.length} retiros parciales</p>
                        </motion.div>

                        <motion.div
                            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white"
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <BanknotesIcon className="h-8 w-8" />
                                <h3 className="text-lg font-bold">En Caja</h3>
                            </div>
                            <p className="text-3xl font-black">${currentCash.toFixed(2)}</p>
                            <p className="text-sm opacity-90 mt-1">Efectivo actual</p>
                        </motion.div>
                    </div>

                    {/* Cash Register Info */}
                    <motion.div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-lg mb-6">
                        <h2 className="text-2xl font-black mb-4 text-gray-900 dark:text-white">Información de Caja</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Abierta por</p>
                                <p className="font-bold text-gray-900 dark:text-white">{cashRegister.openedByName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Fecha de apertura</p>
                                <p className="font-bold text-gray-900 dark:text-white">
                                    {cashRegister.openedAt instanceof Date
                                        ? cashRegister.openedAt.toLocaleString('es-MX')
                                        : new Date((cashRegister.openedAt as any).seconds * 1000).toLocaleString('es-MX')}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Withdrawals List */}
                    <motion.div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-lg">
                        <h2 className="text-2xl font-black mb-4 text-gray-900 dark:text-white">Retiros Parciales</h2>
                        <div className="space-y-3">
                            {withdrawals.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">No hay retiros registrados</p>
                            ) : (
                                withdrawals.map((withdrawal) => (
                                    <motion.div
                                        key={withdrawal.id}
                                        className="flex justify-between items-center p-4 bg-gray-50 dark:bg-zinc-800 rounded-xl"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900 dark:text-white">{withdrawal.reason}</h3>
                                            <p className="text-xs text-gray-400 mt-1">
                                                Por: {withdrawal.withdrawnByName} • {withdrawal.createdAt instanceof Date
                                                    ? withdrawal.createdAt.toLocaleString('es-MX')
                                                    : new Date((withdrawal.createdAt as any).seconds * 1000).toLocaleString('es-MX')}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-black text-orange-600">-${withdrawal.amount.toFixed(2)}</p>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div>
                </>
            )}

            {/* Modal */}
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
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-zinc-900 rounded-3xl p-8 w-full max-w-md relative z-10 shadow-2xl"
                        >
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">
                                {modalType === 'open' ? 'Abrir Caja' : 'Retiro Parcial'}
                            </h2>
                            <form onSubmit={modalType === 'open' ? handleOpenRegister : handleWithdrawal} className="space-y-4">
                                {modalType === 'open' ? (
                                    <div>
                                        <label className="text-sm font-bold text-gray-500">Fondo Inicial (Morralla)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="w-full mt-1 px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-800 border-none focus:ring-2 focus:ring-green-500 dark:text-white text-2xl font-bold"
                                            value={initialFund}
                                            onChange={e => setInitialFund(e.target.value)}
                                            required
                                            placeholder="0.00"
                                            autoFocus
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <div>
                                            <label className="text-sm font-bold text-gray-500">Monto a Retirar</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                className="w-full mt-1 px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-800 border-none focus:ring-2 focus:ring-orange-500 dark:text-white text-2xl font-bold"
                                                value={withdrawAmount}
                                                onChange={e => setWithdrawAmount(e.target.value)}
                                                required
                                                placeholder="0.00"
                                                autoFocus
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-bold text-gray-500">Motivo</label>
                                            <textarea
                                                className="w-full mt-1 px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-800 border-none focus:ring-2 focus:ring-orange-500 dark:text-white"
                                                value={withdrawReason}
                                                onChange={e => setWithdrawReason(e.target.value)}
                                                required
                                                rows={3}
                                                placeholder="Ej: Retiro de seguridad por exceso de efectivo"
                                            />
                                        </div>
                                    </>
                                )}

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className={`w-full py-4 rounded-xl text-white font-black text-lg transition-colors disabled:opacity-50 ${modalType === 'open' ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-600 hover:bg-orange-700'
                                        }`}
                                >
                                    {submitting ? 'Procesando...' : (modalType === 'open' ? 'Abrir Caja' : 'Registrar Retiro')}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
