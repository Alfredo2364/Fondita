'use client';

import { useState, useEffect, useRef } from 'react';
import { getCategories, getDishes, updateDishAvailability } from '@/lib/firebase/firestore';
import { Category, Dish } from '@/types';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getTables } from '@/lib/firebase/tables';
import { addExpense } from '@/lib/firebase/expenses';
import { processSaleInventory } from '@/lib/firebase/inventory-logic';
import { db } from '@/lib/firebase/firebase';
import { Table } from '@/types';
import { useAuthStore } from '@/store/useAuthStore';
import { useReactToPrint } from 'react-to-print';
import { ClientTicket, KitchenTicket } from '@/components/Ticket';
import {
    BanknotesIcon,
    PrinterIcon,
    TrashIcon,
    UserGroupIcon,
    NoSymbolIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

export default function POSPage() {
    const { user } = useAuthStore();
    const [categories, setCategories] = useState<Category[]>([]);
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [tables, setTables] = useState<Table[]>([]);
    const [cart, setCart] = useState<{ dish: Dish, quantity: number }[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedTable, setSelectedTable] = useState<string>(''); // '' = Para Llevar

    // Printing Refs
    const clientTicketRef = useRef<HTMLDivElement>(null);
    const kitchenTicketRef = useRef<HTMLDivElement>(null);

    // Expense Modal
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
    const [expenseAmount, setExpenseAmount] = useState('');
    const [expenseDesc, setExpenseDesc] = useState('');

    // Last Order for Printing
    const [lastOrder, setLastOrder] = useState<any>(null);

    const handlePrintClient = useReactToPrint({
        contentRef: clientTicketRef,
    });

    const handlePrintKitchen = useReactToPrint({
        contentRef: kitchenTicketRef,
    });

    useEffect(() => {
        const fetchData = async () => {
            const [cats, allDishes, allTables] = await Promise.all([getCategories(), getDishes(), getTables('default_restaurant')]);
            setCategories(cats);
            setDishes(allDishes);
            setTables(allTables);
            if (cats.length > 0) setSelectedCategory(cats[0].id!);
            setLoading(false);
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (lastOrder) {
            handlePrintClient();
            // setTimeout(() => handlePrintKitchen(), 1000); // Optional: Print kitchen ticket too
        }
    }, [lastOrder]);

    const addToCart = (dish: Dish) => {
        if (!dish.isAvailable) return;
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

    const toggleAvailability = async (e: React.MouseEvent, dish: Dish) => {
        e.stopPropagation();
        try {
            await updateDishAvailability(dish.id!, !dish.isAvailable);
            setDishes(prev => prev.map(d => d.id === dish.id ? { ...d, isAvailable: !d.isAvailable } : d));
        } catch (error) {
            console.error(error);
        }
    };

    const total = cart.reduce((sum, item) => sum + (item.dish.price * item.quantity), 0);

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        try {
            const tableNum = selectedTable ? tables.find(t => t.id === selectedTable)?.number : 'Para Llevar';

            const orderData = {
                items: cart.map(i => ({
                    dishId: i.dish.id,
                    name: i.dish.name,
                    quantity: i.quantity,
                    price: i.dish.price
                })),
                total,
                tableNumber: tableNum,
                status: 'pending',
                paymentMethod: 'cash',
                createdAt: serverTimestamp(),
                restaurantId: 'default_restaurant'
            };

            await addDoc(collection(db, 'orders'), orderData);

            // Decrement Stock Logic
            // We do this concurrently but don't block the UI if it fails (it logs error)
            // Ideally we should await it if we want to confirm, but speeds up POS to not await strictly
            // For now let's await it to be safe.
            try {
                // Dynamic import to avoid cycles or ensure fresh logic if needed, 
                // but standard import is fine. I'll need to add the import at the top.
                // Since I can't add import easily with replace_file_content in one go without replacing whole file,
                // I will add the import in a separate call or use a dynamic import here if supported.
                // Let's assume I will add the import in a separate call or just REPLACE THE WHOLE FILE if easier.
                await processSaleInventory(cart);
            } catch (invError) {
                console.error("Inventory update failed:", invError);
                // Continue with checkout even if inventory fails? 
                // Yes, better to sell and fix stock later than block money.
            }

            // Prepare for printing
            setLastOrder({ ...orderData, createdAt: new Date() });

            alert('Orden creada exitosamente');
            setCart([]);
            setSelectedTable(''); // Reset
        } catch (error) {
            console.error('Error creating order:', error);
            alert('Error al crear la orden');
        }
    };

    const handleAddExpense = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addExpense(parseFloat(expenseAmount), expenseDesc, user?.uid || 'unknown', user?.email || 'Staff');
            setIsExpenseModalOpen(false);
            setExpenseAmount('');
            setExpenseDesc('');
            alert('Gasto registrado');
        } catch (error) {
            console.error(error);
            alert('Error al registrar gasto');
        }
    };

    if (loading) return <div className="flex h-screen items-center justify-center font-bold text-gray-500">Cargando Sistema POS...</div>;

    return (
        <div className="flex h-[calc(100vh-2rem)] gap-6 p-2 bg-gray-100 dark:bg-zinc-950">
            {/* Menu Section */}
            <div className="flex-1 overflow-hidden flex flex-col rounded-3xl bg-white shadow-xl border border-gray-200 dark:bg-zinc-900 dark:border-zinc-800">
                {/* Header & Categories */}
                <div className="p-4 border-b border-gray-100 dark:border-zinc-800">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-black text-gray-800 dark:text-white">PUNTO DE VENTA</h1>
                        <button
                            onClick={() => setIsExpenseModalOpen(true)}
                            className="bg-red-50 text-red-600 px-4 py-2 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors flex items-center gap-2"
                        >
                            <BanknotesIcon className="h-5 w-5" />
                            Caja Chica
                        </button>
                    </div>

                    <div className="flex overflow-x-auto gap-2 pb-2 custom-scrollbar">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id!)}
                                className={`whitespace-nowrap px-6 py-3 rounded-xl text-sm font-bold transition-all transform ${selectedCategory === cat.id
                                    ? 'bg-gray-900 text-white shadow-lg scale-105 dark:bg-white dark:text-black'
                                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100 dark:bg-zinc-800 dark:text-gray-400'
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Dishes Grid */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 dark:bg-zinc-950/50">
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {dishes.filter(d => d.categoryId === selectedCategory).map(dish => (
                            <motion.div
                                key={dish.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => addToCart(dish)}
                                className={`relative cursor-pointer rounded-2xl p-4 transition-all border-2 shadow-sm flex flex-col justify-between aspect-square group overflow-hidden ${!dish.isAvailable
                                    ? 'opacity-60 grayscale border-gray-200 bg-gray-100 dark:bg-zinc-800 dark:border-zinc-700'
                                    : 'bg-white border-transparent hover:border-orange-400 hover:shadow-orange-100 dark:bg-zinc-800 dark:hover:border-orange-500/50'
                                    }`}
                            >
                                <div className="absolute top-2 right-2 z-10">
                                    <button
                                        onClick={(e) => toggleAvailability(e, dish)}
                                        className={`p-1.5 rounded-full ${dish.isAvailable ? 'bg-green-100 text-green-600 hover:bg-red-100 hover:text-red-600' : 'bg-red-100 text-red-600 hover:bg-green-100 hover:text-green-600'}`}
                                        title={dish.isAvailable ? "Marcar Agotado" : "Marcar Disponible"}
                                    >
                                        {dish.isAvailable ? <CheckCircleIcon className="h-5 w-5" /> : <NoSymbolIcon className="h-5 w-5" />}
                                    </button>
                                </div>

                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight mb-1">{dish.name}</h3>
                                    {!dish.isAvailable && <span className="text-xs font-black text-red-500 uppercase">Agotado</span>}
                                </div>
                                <div className="mt-auto">
                                    <p className="text-2xl font-black text-gray-900 dark:text-white">${dish.price}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Cart Section */}
            <div className="w-[400px] flex flex-col rounded-3xl bg-white shadow-2xl border border-gray-100 dark:bg-zinc-900 dark:border-zinc-800">
                <div className="p-6 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50 rounded-t-3xl">
                    <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4">ORDEN ACTUAL</h2>

                    {/* Table Selector */}
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => setSelectedTable('')}
                            className={`py-3 px-4 rounded-xl text-sm font-bold border-2 transition-all ${selectedTable === ''
                                ? 'border-orange-500 bg-orange-50 text-orange-600'
                                : 'border-gray-200 text-gray-400 bg-white hover:border-gray-300 dark:bg-zinc-800 dark:border-zinc-700'
                                }`}
                        >
                            🥡 Para Llevar
                        </button>
                        <select
                            value={selectedTable}
                            onChange={(e) => setSelectedTable(e.target.value)}
                            className={`py-3 px-4 rounded-xl text-sm font-bold border-2 outline-none appearance-none bg-white dark:bg-zinc-800 dark:text-white transition-all ${selectedTable !== ''
                                ? 'border-blue-500 text-blue-600'
                                : 'border-gray-200 text-gray-400 dark:border-zinc-700'
                                }`}
                        >
                            <option value="" disabled>Seleccionar Mesa</option>
                            {tables.map(t => (
                                <option key={t.id} value={t.id}>Mesa {t.number} ({t.capacity}p)</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                    <AnimatePresence>
                        {cart.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-50">
                                <PrinterIcon className="h-16 w-16 mb-2" />
                                <p className="font-medium">Comienza agregando productos</p>
                            </div>
                        ) : (
                            cart.map(item => (
                                <motion.div
                                    key={item.dish.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="flex items-center gap-3 bg-gray-50 dark:bg-zinc-800/50 p-3 rounded-2xl"
                                >
                                    <div className="h-10 w-10 rounded-lg bg-white dark:bg-zinc-800 flex items-center justify-center font-bold text-gray-500 shadow-sm">
                                        x{item.quantity}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-900 dark:text-white text-sm">{item.dish.name}</p>
                                        <p className="text-xs text-gray-500">${(item.dish.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button onClick={() => updateQuantity(item.dish.id!, -1)} className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-700 font-bold text-gray-500">-</button>
                                        <button onClick={() => updateQuantity(item.dish.id!, 1)} className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-700 font-bold text-gray-500">+</button>
                                        <button onClick={() => removeFromCart(item.dish.id!)} className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 ml-1">
                                            <TrashIcon className="h-4 w-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>

                <div className="p-6 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 rounded-b-3xl">
                    <div className="flex justify-between items-end mb-4">
                        <span className="text-gray-500 font-medium">Total a Pagar</span>
                        <span className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">${total.toFixed(2)}</span>
                    </div>

                    <button
                        onClick={handleCheckout}
                        disabled={cart.length === 0}
                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black text-lg shadow-lg hover:shadow-green-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:shadow-none disabled:scale-100 flex justify-center items-center gap-3"
                    >
                        <PrinterIcon className="h-6 w-6" />
                        <span>COBRAR E IMPRIMIR</span>
                    </button>
                </div>
            </div>

            {/* Hidden Tickets for Printing */}
            <div className="hidden">
                {lastOrder && (
                    <>
                        <ClientTicket
                            ref={clientTicketRef}
                            items={lastOrder.items.map((i: any) => ({ dish: { name: i.name, price: i.price } as Dish, quantity: i.quantity }))}
                            total={lastOrder.total}
                            tableNumber={lastOrder.tableNumber}
                            date={lastOrder.createdAt}
                        />
                        <KitchenTicket
                            ref={kitchenTicketRef}
                            items={lastOrder.items.map((i: any) => ({ dish: { name: i.name, price: i.price } as Dish, quantity: i.quantity }))}
                            total={lastOrder.total}
                            tableNumber={lastOrder.tableNumber}
                            date={lastOrder.createdAt}
                        />
                    </>
                )}
            </div>

            {/* Expense Modal */}
            <AnimatePresence>
                {isExpenseModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setIsExpenseModalOpen(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white dark:bg-zinc-900 rounded-3xl p-8 w-full max-w-sm relative z-10 shadow-2xl"
                        >
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Registrar Gasto</h2>
                            <form onSubmit={handleAddExpense} className="space-y-4">
                                <div>
                                    <label className="text-sm font-bold text-gray-500">Monto ($)</label>
                                    <input
                                        type="number"
                                        className="w-full mt-1 px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-800 border-none focus:ring-2 focus:ring-red-500 dark:text-white font-bold text-xl"
                                        value={expenseAmount}
                                        onChange={e => setExpenseAmount(e.target.value)}
                                        placeholder="0.00"
                                        required
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-gray-500">Descripción</label>
                                    <textarea
                                        className="w-full mt-1 px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-800 border-none focus:ring-2 focus:ring-red-500 dark:text-white resize-none h-24"
                                        value={expenseDesc}
                                        onChange={e => setExpenseDesc(e.target.value)}
                                        placeholder="Ej. Compra de Tomates"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-4 rounded-xl bg-red-500 text-white font-black text-lg hover:bg-red-600 transition-colors mt-4"
                                >
                                    Guardar Salida
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
