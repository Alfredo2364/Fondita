'use client';

import { useState, useEffect } from 'react';
import { getTables, addTable, deleteTable, updateTablePosition } from '@/lib/firebase/tables';
import { Table } from '@/types';
import { TrashIcon, PlusIcon, QrCodeIcon, MapIcon, ListBulletIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';

const RESTAURANT_ID = 'default_restaurant';
const BASE_URL = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';

export const dynamic = 'force-dynamic';

export default function TablesPage() {
    const [tables, setTables] = useState<Table[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'list' | 'map'>('map');

    // Forms & Modals
    const [newTableNumber, setNewTableNumber] = useState('');
    const [newTableCapacity, setNewTableCapacity] = useState('');
    const [selectedQrTable, setSelectedQrTable] = useState<Table | null>(null);

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

    const handleDelete = async (id: string, e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (!confirm('¿Estás seguro de eliminar esta mesa?')) return;
        try {
            await deleteTable(id);
            loadTables();
        } catch (error) {
            console.error('Error deleting table:', error);
        }
    };

    const handleDragEnd = async (tableId: string, info: any) => {
        const x = info.point.x;
        const y = info.point.y;
        // In a real app, we'd calculate relative to the container, but for this demo, 
        // we'll use the transform offset or keep it simple.
        // Actually framer motion drag constraints are tricky without a ref.
        // Let's settle for simple relative updates if possible, or just updating local state then DB.

        // For simplicity in this demo, we won't persist exact pixel perfect X/Y to DB 
        // because `info.point` is global screen coordinates. 
        // We'll trust the user to arrange them and maybe add a "Save Layout" button 
        // or just update `x` and `y` relative to the parent div.

        // To do this properly:
        // 1. Get container bounds.
        // 2. Calculate x/y relative to container.
        // 3. Save.

        // Simplified: Just console log for now as "saving" exact drag coords requires a bit more math setup.
        // We will implement a basic version where we just update the visual state.
    };

    // Alternative: Click to edit position? No, Drag is better.
    // Let's implement a "Save Position" trigger or debounce.

    const updatePosition = async (id: string, x: number, y: number) => {
        try {
            await updateTablePosition(id, x, y);
            // Update local state without reload
            setTables(prev => prev.map(t => t.id === id ? { ...t, x, y } : t));
        } catch (error) {
            console.error("Failed to save position", error);
        }
    };

    return (
        <div className="p-6 h-[calc(100vh-4rem)] flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-black text-gray-800 dark:text-white">Mapa de Mesas</h1>
                    <p className="text-gray-500 text-sm">Arrastra las mesas para organizar tu salón</p>
                </div>

                <div className="flex gap-2 bg-gray-100 dark:bg-zinc-800 p-1 rounded-xl">
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-zinc-700 shadow text-orange-600' : 'text-gray-400'}`}
                    >
                        <ListBulletIcon className="h-6 w-6" />
                    </button>
                    <button
                        onClick={() => setViewMode('map')}
                        className={`p-2 rounded-lg transition-all ${viewMode === 'map' ? 'bg-white dark:bg-zinc-700 shadow text-orange-600' : 'text-gray-400'}`}
                    >
                        <MapIcon className="h-6 w-6" />
                    </button>
                </div>
            </div>

            {/* Controls Row */}
            <div className="flex flex-wrap gap-4 mb-6 items-end bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 z-10">
                <form onSubmit={handleAddTable} className="flex gap-4 items-end">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase">Número</label>
                        <input
                            type="number"
                            value={newTableNumber}
                            onChange={(e) => setNewTableNumber(e.target.value)}
                            className="mt-1 block w-20 rounded-lg border-gray-200 bg-gray-50 p-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                            placeholder="#"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase">Sillas</label>
                        <input
                            type="number"
                            value={newTableCapacity}
                            onChange={(e) => setNewTableCapacity(e.target.value)}
                            className="mt-1 block w-20 rounded-lg border-gray-200 bg-gray-50 p-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                            placeholder="Pax"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-orange-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-700 flex items-center gap-2 h-[38px]"
                    >
                        <PlusIcon className="h-5 w-5" />
                        <span className="hidden sm:inline">Agregar</span>
                    </button>
                </form>
            </div>

            {/* View Area */}
            <div className="flex-1 relative bg-gray-50 dark:bg-zinc-950/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-zinc-800 overflow-hidden">
                {viewMode === 'map' && (
                    <div className="absolute inset-0 opacity-10 pointer-events-none"
                        style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                    />
                )}

                {loading ? (
                    <div className="flex items-center justify-center h-full text-gray-400">Cargando mapa...</div>
                ) : tables.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-400">No hay mesas. Agrega una arriba.</div>
                ) : (
                    viewMode === 'list' ? (
                        <div className="p-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {tables.map(table => (
                                <TableCard
                                    key={table.id}
                                    table={table}
                                    onDelete={() => handleDelete(table.id)}
                                    onQr={() => setSelectedQrTable(table)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="relative w-full h-full p-6">
                            {tables.map(table => (
                                <DraggableTable
                                    key={table.id}
                                    table={table}
                                    onUpdatePosition={updatePosition}
                                    onDelete={() => handleDelete(table.id)}
                                    onQr={() => setSelectedQrTable(table)}
                                />
                            ))}
                        </div>
                    )
                )}
            </div>

            {/* QR Modal */}
            <AnimatePresence>
                {selectedQrTable && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => setSelectedQrTable(null)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-2xl relative z-10 max-w-sm w-full flex flex-col items-center text-center"
                        >
                            <button
                                onClick={() => setSelectedQrTable(null)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>

                            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Mesa {selectedQrTable.number}</h3>
                            <p className="text-gray-500 mb-6">Escanea para ver el menú y ordenar</p>

                            <div className="bg-white p-4 rounded-xl shadow-inner border border-gray-100">
                                <QRCodeSVG
                                    value={`${BASE_URL}/menu?table=${selectedQrTable.id}`}
                                    size={200}
                                    level={"H"}
                                    includeMargin={true}
                                />
                            </div>

                            <div className="mt-6 flex flex-col w-full gap-2">
                                <button
                                    className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-black font-bold rounded-xl"
                                    onClick={() => window.print()}
                                >
                                    Imprimir QR
                                </button>
                                <p className="text-xs text-gray-400 mt-2 truncate">
                                    URL: {`${BASE_URL}/menu?table=${selectedQrTable.id}`}
                                </p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function TableCard({ table, onDelete, onQr }: { table: Table, onDelete: () => void, onQr: () => void }) {
    const statusColor = table.status === 'available' ? 'bg-green-100 text-green-700 border-green-200' :
        table.status === 'occupied' ? 'bg-red-100 text-red-700 border-red-200' :
            'bg-yellow-100 text-yellow-700 border-yellow-200';

    return (
        <div className={`relative p-4 rounded-2xl border-2 ${statusColor} flex flex-col items-center justify-center gap-2 aspect-square`}>
            <span className="text-3xl font-black opacity-80">{table.number}</span>
            <span className="text-xs font-bold uppercase opacity-60">{table.capacity} Personas</span>

            <button onClick={onDelete} className="absolute top-2 right-2 p-1 hover:bg-black/10 rounded-full">
                <TrashIcon className="h-4 w-4" />
            </button>
            <button onClick={onQr} className="absolute bottom-2 right-2 p-1 hover:bg-black/10 rounded-full">
                <QrCodeIcon className="h-4 w-4" />
            </button>
        </div>
    );
}

function DraggableTable({ table, onUpdatePosition, onDelete, onQr }: { table: Table, onUpdatePosition: (id: string, x: number, y: number) => void, onDelete: () => void, onQr: () => void }) {
    const statusColor = table.status === 'available' ? 'bg-green-500 shadow-green-500/30' :
        table.status === 'occupied' ? 'bg-red-500 shadow-red-500/30' :
            'bg-yellow-500 shadow-yellow-500/30';

    return (
        <motion.div
            drag
            dragMomentum={false}
            initial={{ x: table.x || 0, y: table.y || 0 }}
            onDragEnd={(e, info) => {
                // We calculate the new position based on current x/y + delta
                // This is a simplified approach. Ideally we use layout refs.
                // For now, we trust framer motion's visual persistence and just act as if we saved it.
                // Note: To persist simply we would need to read the actual offset.
                // Let's assume for this MVP we just let them float.
                // To actually save:
                const element = e.target as HTMLElement;
                const rect = element.getBoundingClientRect();
                // Relative to parent would require parent ref.
                // We will implement `onUpdatePosition` if we had exact logic ready.
                // For now, let's just update the local DB with a mocked "relative" coordinate if needed 
                // or just leave it visual for the session (persisting X/Y needs container math).

                // Let's try to grab the transform style which framer sets
                // Actually, let's just save the info.offset which is the delta.
                if (table.x !== undefined && table.y !== undefined) {
                    onUpdatePosition(table.id, table.x + info.offset.x, table.y + info.offset.y);
                } else {
                    onUpdatePosition(table.id, info.offset.x, info.offset.y);
                }
            }}
            whileHover={{ scale: 1.1, zIndex: 10 }}
            whileDrag={{ scale: 1.2, zIndex: 20, cursor: 'grabbing' }}
            className={`absolute w-24 h-24 rounded-full ${statusColor} shadow-lg flex flex-col items-center justify-center text-white cursor-grab active:cursor-grabbing border-4 border-white dark:border-zinc-800`}
        >
            <span className="text-2xl font-black">{table.number}</span>
            <span className="text-[10px] font-bold uppercase opacity-80">{table.capacity} Bax</span>

            <div className="absolute -bottom-8 flex gap-2">
                <button onClick={onQr} className="p-2 bg-white dark:bg-zinc-800 rounded-full shadow-md text-gray-600 hover:text-blue-500">
                    <QrCodeIcon className="h-4 w-4" />
                </button>
                <button onClick={onDelete} className="p-2 bg-white dark:bg-zinc-800 rounded-full shadow-md text-gray-600 hover:text-red-500">
                    <TrashIcon className="h-4 w-4" />
                </button>
            </div>
        </motion.div>
    );
}
