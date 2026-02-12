'use client';

import { useState, useEffect } from 'react';
import { getCategories, getDishes, Category, Dish, addDoc, collection, serverTimestamp } from '@/lib/firebase/firestore';
import { db } from '@/lib/firebase/firebase';

export default function POSPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [cart, setCart] = useState<{ dish: Dish, quantity: number }[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const [cats, allDishes] = await Promise.all([getCategories(), getDishes()]);
            setCategories(cats);
            setDishes(allDishes);
            if (cats.length > 0) setSelectedCategory(cats[0].id!);
            setLoading(false);
        };
        fetchData();
    }, []);

    const addToCart = (dish: Dish) => {
        setCart(prev => {
            const existing = prev.find(i => i.dish.id === dish.id);
            if (existing) {
                return prev.map(i => i.dish.id === dish.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { dish, quantity: 1 }];
        });
    };

    const removeFromCart = (dishId: string) => {
        setCart(prev => prev.filter(i => i.dish.id !== dishId));
    };

    const updateQuantity = (dishId: string, delta: number) => {
        setCart(prev => prev.map(i => {
            if (i.dish.id === dishId) {
                return { ...i, quantity: Math.max(1, i.quantity + delta) };
            }
            return i;
        }));
    };

    const total = cart.reduce((sum, item) => sum + (item.dish.price * item.quantity), 0);

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        try {
            await addDoc(collection(db, 'orders'), {
                items: cart.map(i => ({
                    dishId: i.dish.id,
                    name: i.dish.name,
                    quantity: i.quantity,
                    price: i.dish.price
                })),
                total,
                tableNumber: 'POS-WalkIn',
                status: 'pending', // Directly to Kitchen
                paymentMethod: 'cash',
                createdAt: serverTimestamp()
            });
            alert('Orden creada exitosamente');
            setCart([]);
        } catch (error) {
            console.error('Error creating order:', error);
            alert('Error al crear la orden');
        }
    };

    if (loading) return <div>Cargando POS...</div>;

    return (
        <div className="flex h-[calc(100vh-100px)] gap-4">
            {/* Menu Section */}
            <div className="flex-1 overflow-hidden flex flex-col rounded-lg bg-white shadow dark:bg-zinc-800">
                {/* Category Tabs */}
                <div className="flex overflow-x-auto border-b bg-gray-50 p-2 dark:bg-zinc-700 dark:border-zinc-600">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id!)}
                            className={`whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ${selectedCategory === cat.id
                                    ? 'bg-[var(--primary)] text-white'
                                    : 'text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-zinc-600'
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Dishes Grid */}
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                        {dishes.filter(d => d.categoryId === selectedCategory).map(dish => (
                            <div
                                key={dish.id}
                                onClick={() => addToCart(dish)}
                                className="cursor-pointer rounded-lg border p-4 transition-shadow hover:shadow-md dark:border-zinc-700 dark:bg-zinc-700/50"
                            >
                                <h3 className="font-medium text-gray-900 dark:text-white truncate">{dish.name}</h3>
                                <p className="text-[var(--primary)] font-bold">${dish.price.toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Cart Section */}
            <div className="w-96 rounded-lg bg-white p-4 shadow dark:bg-zinc-800 flex flex-col">
                <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Orden Actual</h2>
                <div className="flex-1 overflow-y-auto space-y-4">
                    {cart.length === 0 ? (
                        <p className="text-gray-500 italic text-center mt-10">Carrito vacío</p>
                    ) : (
                        cart.map(item => (
                            <div key={item.dish.id} className="flex items-center justify-between border-b pb-2 dark:border-zinc-700">
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900 dark:text-white">{item.dish.name}</p>
                                    <p className="text-sm text-gray-500">${item.dish.price} x {item.quantity}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => updateQuantity(item.dish.id!, -1)} className="h-6 w-6 rounded bg-gray-200 text-gray-700 hover:bg-gray-300">-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.dish.id!, 1)} className="h-6 w-6 rounded bg-gray-200 text-gray-700 hover:bg-gray-300">+</button>
                                    <button onClick={() => removeFromCart(item.dish.id!)} className="ml-2 text-red-500">×</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div className="mt-4 border-t pt-4 dark:border-zinc-700">
                    <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
                        <span>Total:</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                    <button
                        onClick={handleCheckout}
                        disabled={cart.length === 0}
                        className="mt-4 w-full rounded-md bg-green-600 px-4 py-3 text-white shadow hover:bg-green-700 disabled:bg-gray-400"
                    >
                        Pagado (Efectivo)
                    </button>
                </div>
            </div>
        </div>
    );
}
