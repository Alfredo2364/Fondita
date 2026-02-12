'use client';

import { useState, useEffect } from 'react';
import { addCategory, getCategories, Category, Dish, getDishes, addDish } from '@/lib/firebase/firestore';

export default function MenuPage() {
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [isAddingDish, setIsAddingDish] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [newDish, setNewDish] = useState<Partial<Dish>>({ name: '', price: 0, description: '', isAvailable: true });
    const [dishImage, setDishImage] = useState<File | null>(null);

    // Load Categories and Dishes on mount
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [cats, allDishes] = await Promise.all([getCategories(), getDishes()]);
            setCategories(cats);
            setDishes(allDishes);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;

        try {
            await addCategory(newCategoryName);
            setNewCategoryName('');
            setIsAddingCategory(false);
            fetchData();
        } catch (error) {
            console.error('Error adding category:', error);
            alert('Error al agregar categoría');
        }
    };

    const handleOpenAddDish = (categoryId: string) => {
        setSelectedCategoryId(categoryId);
        setNewDish({ name: '', price: 0, description: '', isAvailable: true });
        setDishImage(null);
        setIsAddingDish(true);
    };

    const handleSaveDish = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCategoryId || !newDish.name || newDish.price === undefined) return;

        try {
            await addDish({
                name: newDish.name,
                price: Number(newDish.price),
                description: newDish.description || '',
                categoryId: selectedCategoryId,
                isAvailable: newDish.isAvailable || true,
            }, dishImage || undefined);

            setIsAddingDish(false);
            fetchData();
        } catch (error) {
            console.error('Error adding dish:', error);
            alert('Error al guardar platillo');
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión del Menú</h1>
                <button
                    onClick={() => setIsAddingCategory(true)}
                    className="rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--primary)]/90"
                >
                    Nueva Categoría
                </button>
            </div>

            {/* Add Category Modal/Form (Inline for now) */}
            {isAddingCategory && (
                <form onSubmit={handleAddCategory} className="mt-4 flex gap-4 rounded-lg bg-white p-4 shadow dark:bg-zinc-800">
                    <input
                        type="text"
                        placeholder="Nombre de la categoría (ej. Desayunos)"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)] dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                    />
                    <button type="submit" className="text-[var(--primary)] font-medium">Guardar</button>
                    <button type="button" onClick={() => setIsAddingCategory(false)} className="text-gray-500">Cancelar</button>
                </form>
            )}

            {/* Add Dish Modal (Simple Overlay) */}
            {isAddingDish && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-zinc-800">
                        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Agregar Platillo</h2>
                        <form onSubmit={handleSaveDish} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre</label>
                                <input
                                    type="text" required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)] dark:bg-zinc-700 dark:border-zinc-600"
                                    value={newDish.name}
                                    onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Precio</label>
                                <input
                                    type="number" required min="0" step="0.01"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)] dark:bg-zinc-700 dark:border-zinc-600"
                                    value={newDish.price}
                                    onChange={(e) => setNewDish({ ...newDish, price: parseFloat(e.target.value) })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Descripción</label>
                                <textarea
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)] dark:bg-zinc-700 dark:border-zinc-600"
                                    value={newDish.description}
                                    onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Foto</label>
                                <input
                                    type="file" accept="image/*"
                                    onChange={(e) => setDishImage(e.target.files?.[0] || null)}
                                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-[var(--primary)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[var(--primary)]/90"
                                />
                            </div>
                            <div className="flex justify-end space-x-3 pt-4">
                                <button type="button" onClick={() => setIsAddingDish(false)} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-700 rounded-md">Cancelar</button>
                                <button type="submit" className="rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--primary)]/90">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Categories List */}
            <div className="mt-8 space-y-8">
                {loading ? (
                    <p>Cargando menú...</p>
                ) : categories.length === 0 ? (
                    <p className="text-gray-500">No hay categorías registradas. Comienza agregando una.</p>
                ) : (
                    categories.map((category) => (
                        <div key={category.id} className="border-b pb-4 dark:border-zinc-700">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{category.name}</h2>

                            <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {dishes.filter(d => d.categoryId === category.id).map(dish => (
                                    <div key={dish.id} className="flex items-center space-x-4 rounded-lg border bg-white p-4 shadow-sm dark:bg-zinc-800 dark:border-zinc-700">
                                        {dish.imageUrl ? (
                                            <img src={dish.imageUrl} alt={dish.name} className="h-16 w-16 rounded-md object-cover" />
                                        ) : (
                                            <div className="h-16 w-16 rounded-md bg-gray-200 flex items-center justify-center text-gray-400">?</div>
                                        )}
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900 dark:text-white">{dish.name}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">${dish.price.toFixed(2)}</p>
                                        </div>
                                        {/* Status Indicator */}
                                        <div className={`h-3 w-3 rounded-full ${dish.isAvailable ? 'bg-green-500' : 'bg-red-500'}`} title={dish.isAvailable ? "Disponible" : "Agotado"}></div>
                                    </div>
                                ))}
                                {dishes.filter(d => d.categoryId === category.id).length === 0 && (
                                    <p className="col-span-full text-sm text-gray-400 italic">No hay platillos en esta categoría.</p>
                                )}
                            </div>
                            <button
                                onClick={() => handleOpenAddDish(category.id!)}
                                className="mt-4 text-sm font-medium text-[var(--primary)] hover:underline"
                            >
                                + Agregar Platillo
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
