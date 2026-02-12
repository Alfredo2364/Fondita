'use client';

import { useState, useEffect } from 'react';
import { getInventory, addInventoryItem, updateStock } from '@/lib/firebase/inventory';
import { InventoryItem } from '@/types';
import { PlusIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

const RESTAURANT_ID = 'default_restaurant';

export default function InventoryPage() {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    // New Item Form State
    const [newName, setNewName] = useState('');
    const [newUnit, setNewUnit] = useState<'kg' | 'lt' | 'unit'>('unit');
    const [newStock, setNewStock] = useState('');
    const [newCost, setNewCost] = useState('');

    useEffect(() => {
        loadInventory();
    }, []);

    const loadInventory = async () => {
        setLoading(true);
        try {
            const data = await getInventory(RESTAURANT_ID);
            setItems(data);
        } catch (error) {
            console.error('Error loading inventory:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName || !newStock) return;

        try {
            await addInventoryItem({
                restaurantId: RESTAURANT_ID,
                name: newName,
                unit: newUnit,
                currentStock: parseFloat(newStock),
                minStock: 5, // Default for now
                cost: parseFloat(newCost) || 0,
            });
            setNewName('');
            setNewStock('');
            setNewCost('');
            loadInventory();
        } catch (error) {
            console.error('Error adding item:', error);
        }
    };

    const handleQuickUpdate = async (id: string, current: number, change: number) => {
        try {
            await updateStock(id, current + change);
            loadInventory();
        } catch (error) {
            console.error('Error updating stock:', error);
        }
    };

    return (
        <div className="p-8 bg-gray-50 dark:bg-zinc-950 min-h-screen font-sans relative overflow-hidden">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[10%] left-[20%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse delay-1000" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 mb-8 perspective-1000"
            >
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-500 drop-shadow-sm">
                    INVENTARIO 3D
                </h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium mt-1 text-lg">
                    Control de stock con estilo
                </p>
            </motion.div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* 3D Floating Form */}
                <motion.div
                    initial={{ opacity: 0, x: -50, rotateY: 10 }}
                    animate={{ opacity: 1, x: 0, rotateY: 0 }}
                    transition={{ type: "spring", duration: 0.8 }}
                    className="lg:col-span-1"
                >
                    <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl p-8 border border-white/20 relative overflow-hidden transform-style-3d group hover:shadow-2xl transition-shadow duration-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                        <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white mb-6 relative z-10 flex items-center gap-2">
                            <span className="text-3xl">📦</span> Nuevo Insumo
                        </h2>

                        <form onSubmit={handleAdd} className="space-y-5 relative z-10">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 pl-1">Nombre del Insumo</label>
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all dark:text-white font-bold"
                                    placeholder="Ej. Tomate"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 pl-1">Unidad</label>
                                    <select
                                        value={newUnit}
                                        onChange={(e) => setNewUnit(e.target.value as any)}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all dark:text-white font-bold cursor-pointer appearance-none"
                                    >
                                        <option value="unit">Pieza (u)</option>
                                        <option value="kg">Kilogramo (kg)</option>
                                        <option value="lt">Litro (lt)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 pl-1">Costo ($)</label>
                                    <input
                                        type="number"
                                        value={newCost}
                                        onChange={(e) => setNewCost(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all dark:text-white font-bold"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 pl-1">Stock Inicial</label>
                                <input
                                    type="number"
                                    value={newStock}
                                    onChange={(e) => setNewStock(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all dark:text-white font-bold text-lg"
                                    placeholder="0"
                                    required
                                />
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02, translateY: -2 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl shadow-lg shadow-blue-500/30 font-black tracking-wide flex justify-center items-center gap-2 mt-4"
                            >
                                <PlusIcon className="h-6 w-6" /> AGREGAR AL INVENTARIO
                            </motion.button>
                        </form>
                    </div>
                </motion.div>

                {/* 3D List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl rounded-3xl shadow-sm border border-white/20 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50/80 dark:bg-zinc-900/80 border-b border-gray-100 dark:border-zinc-800">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Insumo</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Disponibilidad</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Costo</th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Ajuste Rápido</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                                    <AnimatePresence>
                                        {loading ? (
                                            <tr><td colSpan={4} className="text-center py-10 font-bold text-gray-400 animate-pulse">Cargando inventario...</td></tr>
                                        ) : items.length === 0 ? (
                                            <tr><td colSpan={4} className="text-center py-10 font-bold text-gray-400">Tu inventario está vacío.</td></tr>
                                        ) : (
                                            items.map((item, i) => (
                                                <motion.tr
                                                    key={item.id}
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.05 }}
                                                    className={`group transition-colors ${item.currentStock < item.minStock ? 'bg-red-50/50 dark:bg-red-900/10' : 'hover:bg-blue-50/30 dark:hover:bg-blue-900/5'}`}
                                                >
                                                    <td className="px-6 py-4">
                                                        <span className="font-bold text-gray-800 dark:text-gray-100 text-base">{item.name}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-2 h-2 rounded-full ${item.currentStock < item.minStock ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                                                            <span className={`text-lg font-black ${item.currentStock < item.minStock ? 'text-red-600' : 'text-gray-800 dark:text-gray-100'}`}>
                                                                {item.currentStock}
                                                            </span>
                                                            <span className="text-xs font-bold text-gray-400 uppercase">{item.unit}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="font-mono text-gray-600 dark:text-gray-400">${item.cost}</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <motion.button
                                                                whileHover={{ scale: 1.2, backgroundColor: "#ef4444", color: "white" }}
                                                                whileTap={{ scale: 0.9 }}
                                                                onClick={() => handleQuickUpdate(item.id, item.currentStock, -1)}
                                                                className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-zinc-800 text-gray-500 transition-colors"
                                                            >
                                                                -
                                                            </motion.button>
                                                            <motion.button
                                                                whileHover={{ scale: 1.2, backgroundColor: "#22c55e", color: "white" }}
                                                                whileTap={{ scale: 0.9 }}
                                                                onClick={() => handleQuickUpdate(item.id, item.currentStock, 1)}
                                                                className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-zinc-800 text-gray-500 transition-colors"
                                                            >
                                                                +
                                                            </motion.button>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            ))
                                        )}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
