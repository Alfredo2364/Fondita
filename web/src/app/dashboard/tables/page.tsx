'use client';

import { useState, useEffect } from 'react';
import { getTables, addTable, deleteTable } from '@/lib/firebase/tables';
import { Table } from '@/types';
import { TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

const RESTAURANT_ID = 'default_restaurant'; // Placeholder until we have multi-tenant

export default function TablesPage() {
    const [tables, setTables] = useState<Table[]>([]);
    const [loading, setLoading] = useState(true);
    const [newTableNumber, setNewTableNumber] = useState('');
    const [newTableCapacity, setNewTableCapacity] = useState('');

    useEffect(() => {
        loadTables();
    }, []);

    const loadTables = async () => {
        setLoading(true);
        try {
            const data = await getTables(RESTAURANT_ID);
            setTables(data);
        } catch (error) {
            console.error('Error loading tables:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTable = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTableNumber || !newTableCapacity) return;

        try {
            await addTable(RESTAURANT_ID, parseInt(newTableNumber), parseInt(newTableCapacity));
            setNewTableNumber('');
            setNewTableCapacity('');
            loadTables();
        } catch (error) {
            console.error('Error adding table:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar esta mesa?')) return;
        try {
            await deleteTable(id);
            loadTables();
        } catch (error) {
            console.error('Error deleting table:', error);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Gestión de Mesas</h1>

            {/* Add Table Form */}
            <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-md mb-8">
                <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Agregar Nueva Mesa</h2>
                <form onSubmit={handleAddTable} className="flex gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Número</label>
                        <input
                            type="number"
                            value={newTableNumber}
                            onChange={(e) => setNewTableNumber(e.target.value)}
                            className="mt-1 block w-24 rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)] dark:bg-zinc-700 dark:border-zinc-600 p-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Capacidad</label>
                        <input
                            type="number"
                            value={newTableCapacity}
                            onChange={(e) => setNewTableCapacity(e.target.value)}
                            className="mt-1 block w-24 rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)] dark:bg-zinc-700 dark:border-zinc-600 p-2"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-[var(--primary)] text-white px-4 py-2 rounded-md hover:bg-orange-600 flex items-center"
                    >
                        <PlusIcon className="h-5 w-5 mr-1" />
                        Agregar
                    </button>
                </form>
            </div>

            {/* Tables List */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {loading ? (
                    <p>Cargando mesas...</p>
                ) : tables.length === 0 ? (
                    <p className="col-span-full text-gray-500">No hay mesas registradas.</p>
                ) : (
                    tables.map((table) => (
                        <div
                            key={table.id}
                            className={`p-4 rounded-lg shadow border relative ${table.status === 'occupied'
                                    ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
                                    : table.status === 'reserved'
                                        ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800'
                                        : 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                                }`}
                        >
                            <button
                                onClick={() => handleDelete(table.id)}
                                className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                            >
                                <TrashIcon className="h-4 w-4" />
                            </button>

                            <div className="flex flex-col items-center justify-center h-24">
                                <span className="text-3xl font-bold text-gray-800 dark:text-gray-100">{table.number}</span>
                                <span className="text-xs text-gray-500 mt-1 dark:text-gray-400">
                                    Cap: {table.capacity} p.
                                </span>
                                <span className={`text-xs font-semibold mt-2 px-2 py-0.5 rounded-full capitalize ${table.status === 'available' ? 'bg-green-200 text-green-800' :
                                        table.status === 'occupied' ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'
                                    }`}>
                                    {table.status === 'available' ? 'Libre' : table.status === 'occupied' ? 'Ocupada' : 'Reservada'}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
