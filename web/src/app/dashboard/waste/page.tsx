'use client';

import { useState, useEffect } from 'react';
import { addWaste, getWaste, getWasteSummary, WasteRecord } from '@/lib/firebase/waste';
import { getDishes } from '@/lib/firebase/firestore';
import { Dish } from '@/types';
import { useAuthStore } from '@/store/useAuthStore';
import { PlusIcon, ExclamationTriangleIcon, TrashIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

const RESTAURANT_ID = 'default_restaurant';

export const dynamic = 'force-dynamic';

export default function WastePage() {
    const { user } = useAuthStore();
    const [waste, setWaste] = useState<WasteRecord[]>([]);
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [summary, setSummary] = useState({ operational: 0, error: 0, total: 0 });

    // Form state
    const [type, setType] = useState<'operational' | 'error'>('operational');
    const [selectedDish, setSelectedDish] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [reason, setReason] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const [wasteData, dishesData, summaryData] = await Promise.all([
            getWaste(RESTAURANT_ID),
            getDishes(RESTAURANT_ID),
            getWasteSummary(RESTAURANT_ID)
        ]);
        setWaste(wasteData);
        setDishes(dishesData);
        setSummary(summaryData);
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !selectedDish) return;

        setSubmitting(true);
        try {
            const dish = dishes.find(d => d.id === selectedDish);
            if (!dish) throw new Error('Platillo no encontrado');

            await addWaste({
                restaurantId: RESTAURANT_ID,
                type,
                dishId: dish.id,
                dishName: dish.name,
                quantity,
                unitCost: dish.price,
                totalCost: dish.price * quantity,
                reason,
                registeredBy: user.uid,
                registeredByName: user.displayName || user.email || 'Usuario'
            });

            alert('✅ Merma registrada');
            setIsModalOpen(false);
            setSelectedDish('');
            setQuantity(1);
            setReason('');
            loadData();
        } catch (error: any) {
            console.error(error);
            alert('❌ ' + error.message);
        } finally {
            setSubmitting(false);
        }
    };

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
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white">Control de Merma</h1>
                    <p className="text-gray-500 mt-2">Registro de pérdidas operativas y por error</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                    <PlusIcon className="h-5 w-5" />
                    Registrar Merma
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <motion.div
                    className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white"
                    whileHover={{ scale: 1.02 }}
                >
                    <div className="flex items-center gap-3 mb-2">
                        <ExclamationTriangleIcon className="h-8 w-8" />
                        <h3 className="text-lg font-bold">Merma Operativa</h3>
                    </div>
                    <p className="text-3xl font-black">${summary.operational.toFixed(2)}</p>
                    <p className="text-sm opacity-90 mt-1">Comida no vendida</p>
                </motion.div>

                <motion.div
                    className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white"
                    whileHover={{ scale: 1.02 }}
                >
                    <div className="flex items-center gap-3 mb-2">
                        <TrashIcon className="h-8 w-8" />
                        <h3 className="text-lg font-bold">Merma por Error</h3>
                    </div>
                    <p className="text-3xl font-black">${summary.error.toFixed(2)}</p>
                    <p className="text-sm opacity-90 mt-1">Cancelaciones y errores</p>
                </motion.div>

                <motion.div
                    className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 text-white"
                    whileHover={{ scale: 1.02 }}
                >
                    <div className="flex items-center gap-3 mb-2">
                        <ExclamationTriangleIcon className="h-8 w-8" />
                        <h3 className="text-lg font-bold">Total Merma</h3>
                    </div>
                    <p className="text-3xl font-black">${summary.total.toFixed(2)}</p>
                    <p className="text-sm opacity-90 mt-1">Pérdida total</p>
                </motion.div>
            </div>

            {/* Waste List */}
            <motion.div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-lg">
                <h2 className="text-2xl font-black mb-4 text-gray-900 dark:text-white">Historial de Merma</h2>
                <div className="space-y-3">
                    {waste.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No hay registros de merma</p>
                    ) : (
                        waste.map((record) => (
                            <motion.div
                                key={record.id}
                                className="flex justify-between items-center p-4 bg-gray-50 dark:bg-zinc-800 rounded-xl"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${record.type === 'operational'
                                            ? 'bg-orange-100 text-orange-700'
                                            : 'bg-red-100 text-red-700'
                                            }`}>
                                            {record.type === 'operational' ? 'Operativa' : 'Error'}
                                        </span>
                                        <h3 className="font-bold text-gray-900 dark:text-white">{record.dishName}</h3>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">{record.reason}</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Por: {record.registeredByName} • {record.createdAt instanceof Date ? record.createdAt.toLocaleString('es-MX') : new Date((record.createdAt as any).seconds * 1000).toLocaleString('es-MX')}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Cantidad: {record.quantity}</p>
                                    <p className="text-lg font-black text-red-600">${record.totalCost.toFixed(2)}</p>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </motion.div>

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
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Registrar Merma</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="text-sm font-bold text-gray-500">Tipo de Merma</label>
                                    <div className="grid grid-cols-2 gap-3 mt-1">
                                        <button
                                            type="button"
                                            onClick={() => setType('operational')}
                                            className={`py-3 rounded-xl font-bold transition-all ${type === 'operational'
                                                ? 'bg-orange-600 text-white'
                                                : 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300'
                                                }`}
                                        >
                                            Operativa
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setType('error')}
                                            className={`py-3 rounded-xl font-bold transition-all ${type === 'error'
                                                ? 'bg-red-600 text-white'
                                                : 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300'
                                                }`}
                                        >
                                            Por Error
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-bold text-gray-500">Platillo</label>
                                    <select
                                        className="w-full mt-1 px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-800 border-none focus:ring-2 focus:ring-red-500 dark:text-white"
                                        value={selectedDish}
                                        onChange={e => setSelectedDish(e.target.value)}
                                        required
                                    >
                                        <option value="">Seleccionar platillo</option>
                                        {dishes.map(dish => (
                                            <option key={dish.id} value={dish.id}>
                                                {dish.name} - ${dish.price}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-sm font-bold text-gray-500">Cantidad</label>
                                    <input
                                        type="number"
                                        min="1"
                                        className="w-full mt-1 px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-800 border-none focus:ring-2 focus:ring-red-500 dark:text-white"
                                        value={quantity}
                                        onChange={e => setQuantity(parseInt(e.target.value))}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-bold text-gray-500">Motivo</label>
                                    <textarea
                                        className="w-full mt-1 px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-800 border-none focus:ring-2 focus:ring-red-500 dark:text-white"
                                        value={reason}
                                        onChange={e => setReason(e.target.value)}
                                        required
                                        rows={3}
                                        placeholder={type === 'operational' ? 'Ej: Sobró al final del día' : 'Ej: Pedido cancelado después de preparar'}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-4 rounded-xl bg-red-600 text-white font-black text-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                                >
                                    {submitting ? 'Registrando...' : 'Registrar Merma'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
