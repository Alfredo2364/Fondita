'use client';

import { useState, useEffect } from 'react';
import { subscribeToOrders, updateOrderStatus, Order } from '@/lib/firebase/firestore';

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = subscribeToOrders((newOrders) => {
            setOrders(newOrders);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
        try {
            if (orderId) {
                await updateOrderStatus(orderId, newStatus);
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'cooking': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            case 'ready': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'delivered': return 'bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-400';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'pending': return 'Pendiente';
            case 'cooking': return 'Cocinando';
            case 'ready': return 'Listo';
            case 'delivered': return 'Entregado';
            default: return status;
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pedidos en Cocina</h1>

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {loading ? (
                    <p className="col-span-full text-center">Cargando pedidos...</p>
                ) : orders.filter(o => o.status !== 'delivered').length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 dark:border-zinc-700">
                        <p className="text-lg text-gray-500 dark:text-gray-400">No hay pedidos pendientes</p>
                    </div>
                ) : (
                    orders.filter(o => o.status !== 'delivered').map((order) => (
                        <div key={order.id} className="flex flex-col rounded-lg bg-white shadow-md dark:bg-zinc-800">
                            <div className="border-b p-4 dark:border-zinc-700">
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-gray-900 dark:text-white">Mesa {order.tableNumber}</span>
                                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(order.status)}`}>
                                        {getStatusLabel(order.status)}
                                    </span>
                                </div>
                                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    {/* Timestamp helper logic would go here */}
                                    Total: ${order.total.toFixed(2)}
                                </div>
                            </div>
                            <div className="flex-1 p-4">
                                <ul className="space-y-2">
                                    {order.items.map((item, idx) => (
                                        <li key={idx} className="flex justify-between text-sm">
                                            <span className="text-gray-700 dark:text-gray-300">{item.quantity}x {item.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-gray-50 p-3 dark:bg-zinc-700/50">
                                <div className="flex justify-between gap-2">
                                    {order.status === 'pending' && (
                                        <button onClick={() => handleStatusChange(order.id!, 'cooking')} className="flex-1 rounded bg-blue-500 py-1 text-sm text-white hover:bg-blue-600">Cocinar</button>
                                    )}
                                    {order.status === 'cooking' && (
                                        <button onClick={() => handleStatusChange(order.id!, 'ready')} className="flex-1 rounded bg-green-500 py-1 text-sm text-white hover:bg-green-600">Listo</button>
                                    )}
                                    {order.status === 'ready' && (
                                        <button onClick={() => handleStatusChange(order.id!, 'delivered')} className="flex-1 rounded bg-gray-500 py-1 text-sm text-white hover:bg-gray-600">Entregar</button>
                                    )}
                                    <button className="text-red-500 hover:text-red-700">⛔</button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Completed Orders Section (Optional) */}
            <div className="mt-12">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Últimos Entregados</h2>
                <div className="mt-4 overflow-hidden rounded-lg border dark:border-zinc-700">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700">
                        <thead className="bg-gray-50 dark:bg-zinc-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Mesa</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Items</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white dark:divide-zinc-700 dark:bg-zinc-900">
                            {orders.filter(o => o.status === 'delivered').slice(0, 5).map(order => (
                                <tr key={order.id}>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">{order.tableNumber}</td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">${order.total.toFixed(2)}</td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{order.items.length} items</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
