'use client';

import { useState, useEffect } from 'react';
import { getDishes, addDish, updateDish, deleteDish } from '@/lib/firebase/menu';
import { getInventory } from '@/lib/firebase/inventory';
import { Dish, InventoryItem } from '@/types';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

const RESTAURANT_ID = 'default_restaurant';

export default function MenuPage() {
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Edit/Add Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDish, setEditingDish] = useState<Partial<Dish> | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [dishesData, inventoryData] = await Promise.all([
                getDishes(RESTAURANT_ID),
                getInventory(RESTAURANT_ID)
            ]);
            setDishes(dishesData);
            setInventory(inventoryData);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!editingDish?.name || !editingDish?.price) return;

        try {
            if (editingDish.id) {
                await updateDish(editingDish.id, editingDish);
            } else {
                await addDish({
                    ...editingDish as any,
                    restaurantId: RESTAURANT_ID,
                    isAvailable: true,
                    recipe: editingDish.recipe || [],
                });
            }
            setIsModalOpen(false);
            setEditingDish(null);
            loadData();
        } catch (e) {
            console.error(e);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Eliminar platillo?')) return;
        await deleteDish(id);
        loadData();
    };

    // Recipe Logic
    const addIngredientToRecipe = () => {
        const newRecipe = [...(editingDish?.recipe || []), { ingredientId: inventory[0]?.id || '', quantity: 1 }];
        setEditingDish({ ...editingDish, recipe: newRecipe });
    };

    const updateRecipeItem = (index: number, field: 'ingredientId' | 'quantity', value: any) => {
        const newRecipe = [...(editingDish?.recipe || [])];
        newRecipe[index] = { ...newRecipe[index], [field]: value };
        setEditingDish({ ...editingDish, recipe: newRecipe });
    };

    const removeRecipeItem = (index: number) => {
        const newRecipe = [...(editingDish?.recipe || [])];
        newRecipe.splice(index, 1);
        setEditingDish({ ...editingDish, recipe: newRecipe });
    };

    // Daily Menu State
    const [isDailyModalOpen, setIsDailyModalOpen] = useState(false);
    const [dailyMenu, setDailyMenu] = useState({
        soup: '',
        main1: '',
        main2: '',
        drink: '',
        price: 85 // Default price
    });

    const handleSaveDailyMenu = async () => {
        setLoading(true);
        try {
            // Helper to update or create a dish
            const upsertDish = async (name: string, type: string) => {
                if (!name) return;
                // Find existing or create new
                // Simplified: Just add new ones for now, or updating would require searching first.
                // For this MVP, we'll just create them as new items or update if we had IDs.
                // To keep it 'Quick', let's assume we just add them to the 'Comida Corrida' category.

                await addDish({
                    name: `${type}: ${name}`,
                    price: dailyMenu.price,
                    description: 'Parte del Menú del Día',
                    categoryId: 'daily_special',
                    isAvailable: true,
                    restaurantId: RESTAURANT_ID,
                    recipe: []
                });
            };

            // Clear old daily specials (Optional, but good for cleanup)
            // const dailyDishes = await getDishes(RESTAURANT_ID, 'daily_special');
            // dailyDishes.forEach(d => deleteDish(d.id!)); 

            await Promise.all([
                upsertDish(dailyMenu.soup, 'Sopa'),
                upsertDish(dailyMenu.main1, 'Guisado'),
                upsertDish(dailyMenu.main2, 'Guisado'),
                upsertDish(dailyMenu.drink, 'Agua')
            ]);

            setIsDailyModalOpen(false);
            loadData();
            alert('Menú del día actualizado!');
        } catch (error) {
            console.error(error);
            alert('Error al actualizar menú del día');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 bg-gray-50 dark:bg-zinc-950 min-h-screen font-sans overflow-hidden relative">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute top-[40%] -right-[10%] w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[100px] animate-pulse delay-700" />
            </div>

            <div className="relative z-10 flex justify-between items-center mb-10 perspective-1000">
                <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, type: "spring" }}
                >
                    <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-500 drop-shadow-sm">
                        MENÚ 3D
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mt-1 text-lg">
                        Gestión inmersiva de platillos
                    </p>
                </motion.div>

                <div className="flex gap-4">
                    <motion.button
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsDailyModalOpen(true)}
                        className="bg-white text-orange-600 px-6 py-4 rounded-2xl shadow-lg border border-orange-100 font-bold flex items-center gap-2"
                    >
                        <span>📅 Menú del Día</span>
                    </motion.button>

                    <motion.button
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        whileHover={{ scale: 1.05, translateY: -5, boxShadow: "0 20px 40px -10px rgba(234, 88, 12, 0.5)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => { setEditingDish({}); setIsModalOpen(true); }}
                        className="bg-gradient-to-br from-orange-500 to-red-600 text-white px-8 py-4 rounded-2xl shadow-xl flex items-center gap-3 font-bold text-lg border-t border-white/20 relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                        <PlusIcon className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
                        <span>Nuevo Platillo</span>
                    </motion.button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
                </div>
            ) : (
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    <AnimatePresence>
                        {dishes.map((dish, i) => (
                            <motion.div
                                key={dish.id}
                                initial={{ opacity: 0, y: 50, rotateX: -10 }}
                                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                                transition={{ delay: i * 0.05, duration: 0.5, type: "spring" }}
                                whileHover={{ y: -10, rotateX: 5, zIndex: 10 }}
                                className="group perspective-1000"
                            >
                                <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-gray-100 dark:border-zinc-800 p-0 flex flex-col h-full transform-style-3d transition-transform duration-300 hover:shadow-2xl overflow-hidden relative">
                                    {/* 3D Floating Image */}
                                    <div className="h-52 w-full bg-gray-100 dark:bg-zinc-800 relative overflow-hidden">
                                        {dish.imageUrl ? (
                                            <motion.img
                                                src={dish.imageUrl}
                                                alt={dish.name}
                                                className="w-full h-full object-cover"
                                                whileHover={{ scale: 1.15 }}
                                                transition={{ duration: 0.5 }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-zinc-800 text-6xl">
                                                <motion.span
                                                    initial={{ scale: 1 }}
                                                    whileHover={{ scale: 1.3, rotate: 10 }}
                                                    className="cursor-default inline-block"
                                                >
                                                    🍔
                                                </motion.span>
                                            </div>
                                        )}
                                        {/* Floating Price Tag */}
                                        <motion.div
                                            className="absolute top-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg border border-white/20 z-20"
                                            initial={{ y: -20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.2 + (i * 0.05) }}
                                        >
                                            <span className="font-black text-gray-900 dark:text-white text-lg">${dish.price}</span>
                                        </motion.div>
                                    </div>

                                    <div className="p-6 flex-1 flex flex-col relative bg-white dark:bg-zinc-900 z-10">
                                        <h3 className="font-extrabold text-2xl text-gray-900 dark:text-white mb-2 leading-tight group-hover:text-orange-600 transition-colors">
                                            {dish.name}
                                        </h3>
                                        <p className="text-gray-500 text-sm mb-6 dark:text-gray-400 line-clamp-3 leading-relaxed">
                                            {dish.description}
                                        </p>

                                        {/* Recipe Status Badge */}
                                        <div className="mb-6">
                                            {dish.recipe && dish.recipe.length > 0 ? (
                                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold border border-green-100 dark:border-green-800/50">
                                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                                    {dish.recipe.length} Insumos vinculados
                                                </div>
                                            ) : (
                                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs font-bold border border-orange-100 dark:border-orange-800/50">
                                                    <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                                                    Receta sin configurar
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-auto grid grid-cols-2 gap-3 pt-6 border-t border-gray-100 dark:border-zinc-800">
                                            <motion.button
                                                whileHover={{ scale: 1.05, backgroundColor: "rgba(59, 130, 246, 0.1)" }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => { setEditingDish(dish); setIsModalOpen(true); }}
                                                className="flex justify-center items-center gap-2 py-2.5 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 font-bold text-sm transition-colors"
                                            >
                                                <PencilIcon className="h-4 w-4" /> Editar
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.05, backgroundColor: "rgba(239, 68, 68, 0.1)" }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleDelete(dish.id)}
                                                className="flex justify-center items-center gap-2 py-2.5 rounded-xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 font-bold text-sm transition-colors"
                                            >
                                                <TrashIcon className="h-4 w-4" /> Eliminar
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Daily Menu Modal */}
            <AnimatePresence>
                {isDailyModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsDailyModalOpen(false)} />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-zinc-900 rounded-3xl p-8 w-full max-w-lg relative z-10"
                        >
                            <h2 className="text-2xl font-black mb-6">Configurar Menú del Día</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="font-bold text-sm text-gray-500">Sopa del Día</label>
                                    <input
                                        className="w-full p-3 rounded-xl bg-gray-50 dark:bg-zinc-800 border-none font-medium mt-1"
                                        placeholder="Ej. Sopa de Letras"
                                        value={dailyMenu.soup}
                                        onChange={e => setDailyMenu({ ...dailyMenu, soup: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="font-bold text-sm text-gray-500">Guisado Opción A</label>
                                    <input
                                        className="w-full p-3 rounded-xl bg-gray-50 dark:bg-zinc-800 border-none font-medium mt-1"
                                        placeholder="Ej. Chicharrón en Salsa Verde"
                                        value={dailyMenu.main1}
                                        onChange={e => setDailyMenu({ ...dailyMenu, main1: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="font-bold text-sm text-gray-500">Guisado Opción B</label>
                                    <input
                                        className="w-full p-3 rounded-xl bg-gray-50 dark:bg-zinc-800 border-none font-medium mt-1"
                                        placeholder="Ej. Milanesa de Pollo"
                                        value={dailyMenu.main2}
                                        onChange={e => setDailyMenu({ ...dailyMenu, main2: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="font-bold text-sm text-gray-500">Agua del Día</label>
                                    <input
                                        className="w-full p-3 rounded-xl bg-gray-50 dark:bg-zinc-800 border-none font-medium mt-1"
                                        placeholder="Ej. Horchata"
                                        value={dailyMenu.drink}
                                        onChange={e => setDailyMenu({ ...dailyMenu, drink: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="font-bold text-sm text-gray-500">Precio General</label>
                                    <input
                                        type="number"
                                        className="w-full p-3 rounded-xl bg-gray-50 dark:bg-zinc-800 border-none font-medium mt-1"
                                        value={dailyMenu.price}
                                        onChange={e => setDailyMenu({ ...dailyMenu, price: parseFloat(e.target.value) })}
                                    />
                                </div>
                                <button
                                    onClick={handleSaveDailyMenu}
                                    className="w-full bg-orange-500 text-white font-black py-4 rounded-xl mt-4 hover:bg-orange-600 transition-colors"
                                >
                                    PUBLICAR MENÚ DEL DÍA
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* 3D Floating Modal (Regular Add/Edit) */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 perspective-2000">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
                            onClick={() => setIsModalOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, rotateX: 20, scale: 0.8, y: 100 }}
                            animate={{ opacity: 1, rotateX: 0, scale: 1, y: 0 }}
                            exit={{ opacity: 0, rotateX: -20, scale: 0.8, y: 100 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative bg-white dark:bg-zinc-900 rounded-[2rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col border border-white/20 transform-style-3d"
                        >
                            {/* Modal Header */}
                            <div className="px-8 py-6 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center bg-gray-50/80 dark:bg-zinc-900/80 backdrop-blur-xl z-20">
                                <div>
                                    <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                                        {editingDish?.id ? 'Editar Platillo' : 'Nuevo Platillo'}
                                    </h2>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Configura los detalles y la receta maestra</p>
                                </div>
                                <motion.button
                                    whileHover={{ rotate: 90, scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                                </motion.button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-8 overflow-y-auto custom-scrollbar bg-white dark:bg-zinc-950 relative z-10">
                                <div className="grid grid-cols-2 gap-6 mb-8">
                                    <div className="col-span-2 md:col-span-1 space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">Nombre del Platillo</label>
                                        <input
                                            className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all dark:text-white font-bold text-lg"
                                            placeholder="Ej. Tacos al Pastor"
                                            value={editingDish?.name || ''}
                                            onChange={e => setEditingDish({ ...editingDish, name: e.target.value })}
                                            autoFocus
                                        />
                                    </div>
                                    <div className="col-span-2 md:col-span-1 space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">Precio de Venta</label>
                                        <div className="relative group">
                                            <span className="absolute left-5 top-4 text-gray-400 font-bold text-lg group-focus-within:text-green-500 transition-colors">$</span>
                                            <input
                                                type="number"
                                                className="w-full pl-10 pr-5 py-4 rounded-2xl border-2 border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all dark:text-white font-mono text-xl font-bold"
                                                placeholder="0.00"
                                                value={editingDish?.price || ''}
                                                onChange={e => setEditingDish({ ...editingDish, price: parseFloat(e.target.value) })}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">Descripción</label>
                                        <textarea
                                            className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all dark:text-white resize-none font-medium"
                                            rows={2}
                                            placeholder="Describe los ingredientes y el sabor..."
                                            value={editingDish?.description || ''}
                                            onChange={e => setEditingDish({ ...editingDish, description: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* 3D Recipe Subsection */}
                                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/10 rounded-[2rem] p-6 border border-indigo-100 dark:border-indigo-800/30 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                                    <div className="flex justify-between items-end mb-6 relative z-10">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-white dark:bg-indigo-600 rounded-2xl shadow-lg border border-indigo-100 dark:border-indigo-500 shadow-indigo-200 dark:shadow-indigo-900/50">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 dark:text-white" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>
                                            </div>
                                            <div>
                                                <h3 className="font-extrabold text-indigo-900 dark:text-white text-xl">Receta Maestra</h3>
                                                <p className="text-xs text-indigo-500 dark:text-indigo-300 font-bold uppercase tracking-wider">Ingredientes que se descontarán</p>
                                            </div>
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={addIngredientToRecipe}
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 text-sm flex items-center gap-2"
                                        >
                                            <PlusIcon className="h-4 w-4" /> Agregar Insumo
                                        </motion.button>
                                    </div>

                                    <div className="space-y-3 relative z-10 min-h-[100px]">
                                        <AnimatePresence>
                                            {editingDish?.recipe?.length === 0 && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="flex flex-col items-center justify-center py-6 text-indigo-300 border-2 border-dashed border-indigo-200 dark:border-indigo-800 rounded-xl"
                                                >
                                                    <span className="text-3xl mb-2">🥗</span>
                                                    <p className="font-medium">No has agregado ingredientes aún.</p>
                                                </motion.div>
                                            )}
                                            {editingDish?.recipe?.map((item, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ x: -20, opacity: 0 }}
                                                    animate={{ x: 0, opacity: 1 }}
                                                    exit={{ x: 20, opacity: 0 }}
                                                    className="flex gap-3 items-center p-2 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-indigo-50 dark:border-indigo-900/30 hover:shadow-md transition-shadow"
                                                >
                                                    <div className="flex-1">
                                                        <select
                                                            className="w-full px-3 py-2 rounded-lg bg-transparent outline-none text-sm dark:text-white font-bold text-gray-700 cursor-pointer"
                                                            value={item.ingredientId}
                                                            onChange={e => updateRecipeItem(idx, 'ingredientId', e.target.value)}
                                                        >
                                                            <option value="">Selecciona un insumo...</option>
                                                            {inventory.map(ing => (
                                                                <option key={ing.id} value={ing.id}>{ing.name} ({ing.unit})</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="w-24 relative border-l border-gray-100 dark:border-zinc-800 pl-3">
                                                        <input
                                                            type="number"
                                                            className="w-full bg-transparent outline-none text-sm dark:text-white font-black text-center text-indigo-600"
                                                            placeholder="Cant."
                                                            value={item.quantity}
                                                            onChange={e => updateRecipeItem(idx, 'quantity', parseFloat(e.target.value))}
                                                        />
                                                    </div>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1, color: "#ef4444" }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => removeRecipeItem(idx)}
                                                        className="p-2 text-gray-400 rounded-lg transition-colors"
                                                    >
                                                        <TrashIcon className="h-5 w-5" />
                                                    </motion.button>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-6 border-t border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 flex justify-end gap-4 z-20">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-3 text-gray-500 font-bold hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                                >
                                    CANCELAR
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(234, 88, 12, 0.5)" }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleSave}
                                    className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-black tracking-wide rounded-xl shadow-lg border-t border-white/20"
                                >
                                    GUARDAR PLATILLO
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
