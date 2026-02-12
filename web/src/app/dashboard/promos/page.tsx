'use client';

import { useState, useEffect } from 'react';
import { getCoupons, addCoupon, deleteCoupon, Coupon } from '@/lib/firebase/promos';
import { TrashIcon, PlusIcon, TagIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

export const dynamic = 'force-dynamic';

export default function PromosPage() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form
    const [code, setCode] = useState('');
    const [description, setDescription] = useState('');
    const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
    const [value, setValue] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await getCoupons();
            setCoupons(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addCoupon(code, description, discountType, parseFloat(value));
            setIsModalOpen(false);
            setCode('');
            setDescription('');
            setValue('');
            loadData();
        } catch (error) {
            console.error(error);
            alert('Error al crear cupón');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Eliminar cupón?')) return;
        try {
            await deleteCoupon(id);
            loadData();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="p-8 bg-gray-50 dark:bg-zinc-950 min-h-screen font-sans overflow-hidden relative">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-[100px] animate-pulse delay-700" />
            </div>

            <div className="relative z-10 flex justify-between items-center mb-10">
                <motion.div
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                >
                    <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-500 drop-shadow-sm">
                        PROMOCIONES
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mt-1 text-lg">
                        Gestiona descuentos y lealtad
                    </p>
                </motion.div>

                <motion.button
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsModalOpen(true)}
                    className="bg-purple-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-purple-700 flex items-center gap-2 font-bold"
                >
                    <PlusIcon className="h-6 w-6" />
                    Nuevo Cupón
                </motion.button>
            </div>

            {/* List */}
            <div className="relative z-10 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    <p className="text-gray-400 col-span-full text-center">Cargando promociones...</p>
                ) : coupons.length === 0 ? (
                    <p className="text-gray-400 col-span-full text-center">No hay cupones activos.</p>
                ) : (
                    <AnimatePresence>
                        {coupons.map((coupon, i) => (
                            <motion.div
                                key={coupon.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-purple-100 dark:border-zinc-800 relative overflow-hidden group"
                            >
                                <div className="absolute -right-4 -top-4 bg-purple-100 dark:bg-purple-900/30 w-24 h-24 rounded-full flex items-center justify-center opacity-50 group-hover:scale-110 transition-transform">
                                    <TagIcon className="h-10 w-10 text-purple-300" />
                                </div>

                                <h3 className="text-2xl font-black text-gray-800 dark:text-white tracking-wider">{coupon.code}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{coupon.description}</p>

                                <div className="flex items-center gap-2 mb-4">
                                    <span className="px-3 py-1 bg-purple-50 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-lg font-bold text-lg">
                                        {coupon.discountType === 'percentage' ? `${coupon.value}% OFF` : `$${coupon.value} MXN`}
                                    </span>
                                </div>

                                <button
                                    onClick={() => handleDelete(coupon.id!)}
                                    className="absolute bottom-4 right-4 text-gray-300 hover:text-red-500 transition-colors"
                                >
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>

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
                            className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-2xl relative z-10 max-w-sm w-full"
                        >
                            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Crear Cupón</h2>
                            <form onSubmit={handleAdd} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">CÓDIGO</label>
                                    <input
                                        type="text"
                                        value={code} onChange={e => setCode(e.target.value)}
                                        className="w-full p-3 bg-gray-50 dark:bg-zinc-800 rounded-xl font-mono uppercase border-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="EJ. VERANO20"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">DESCRIPCIÓN</label>
                                    <input
                                        type="text"
                                        value={description} onChange={e => setDescription(e.target.value)}
                                        className="w-full p-3 bg-gray-50 dark:bg-zinc-800 rounded-xl border-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="Descuento de temporada..."
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">TIPO</label>
                                        <select
                                            value={discountType} onChange={e => setDiscountType(e.target.value as any)}
                                            className="w-full p-3 bg-gray-50 dark:bg-zinc-800 rounded-xl border-none focus:ring-2 focus:ring-purple-500"
                                        >
                                            <option value="percentage">Porcentaje (%)</option>
                                            <option value="fixed">Monto Fijo ($)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">VALOR</label>
                                        <input
                                            type="number"
                                            value={value} onChange={e => setValue(e.target.value)}
                                            className="w-full p-3 bg-gray-50 dark:bg-zinc-800 rounded-xl border-none focus:ring-2 focus:ring-purple-500"
                                            placeholder="10"
                                            required
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="w-full py-3 bg-purple-600 text-white font-bold rounded-xl mt-4 hover:bg-purple-700">
                                    Guardar
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
