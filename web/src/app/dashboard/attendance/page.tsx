'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { checkIn, checkOut, getDailyAttendance, getUserStatus, AttendanceRecord } from '@/lib/firebase/attendance';
import { ClockIcon, UserIcon, ArrowRightOnRectangleIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

export const dynamic = 'force-dynamic';

export default function AttendancePage() {
    const { user } = useAuthStore();
    const [status, setStatus] = useState<'active' | 'inactive' | 'loading'>('loading');
    const [records, setRecords] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            checkStatus();
            loadRecords();
        }
    }, [user]);

    const checkStatus = async () => {
        if (!user) return;
        const s = await getUserStatus(user.uid);
        setStatus(s === 'active' ? 'active' : 'inactive');
    };

    const loadRecords = async () => {
        setLoading(true);
        try {
            const data = await getDailyAttendance(); // Defaults to today
            setRecords(data);
        } catch (error) {
            console.error('Error loading attendance:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClockIn = async () => {
        if (!user) return;
        try {
            await checkIn(user.uid, user.displayName || 'Empleado');
            await checkStatus();
            await loadRecords();
            alert('¡Bienvenido! Has registrado tu entrada.');
        } catch (error: any) {
            alert(error.message);
        }
    };

    const handleClockOut = async () => {
        if (!user) return;
        try {
            await checkOut(user.uid);
            await checkStatus();
            await loadRecords();
            alert('¡Hasta luego! Has registrado tu salida.');
        } catch (error: any) {
            alert(error.message);
        }
    };

    const formatTime = (date?: Date) => {
        if (!date) return '-';
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const calculateDuration = (start: Date, end?: Date) => {
        if (!end) return 'En curso...';
        const diffMs = end.getTime() - start.getTime();
        const diffHrs = Math.floor(diffMs / 3600000);
        const diffMins = Math.round((diffMs % 3600000) / 60000);
        return `${diffHrs}h ${diffMins}m`;
    };

    return (
        <div className="p-8 bg-gray-50 dark:bg-zinc-950 min-h-screen font-sans relative overflow-hidden">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[20%] right-[30%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[10%] left-[20%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[100px] animate-pulse delay-700" />
            </div>

            <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative z-10 mb-8 perspective-1000"
            >
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-500 drop-shadow-sm">
                    ASISTENCIA Y RELOJ
                </h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium mt-1 text-lg">
                    Registra tus horas de entrada y salida
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
                {/* Clock In/Out Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-zinc-800 flex flex-col items-center justify-center text-center lg:col-span-1"
                >
                    <div className="mb-6 relative">
                        <div className={`w-40 h-40 rounded-full flex items-center justify-center border-8 shadow-inner transition-colors duration-500 ${status === 'active'
                            ? 'border-green-100 bg-green-50 text-green-600 dark:border-green-900/30 dark:bg-green-900/20 dark:text-green-400'
                            : 'border-gray-100 bg-gray-50 text-gray-400 dark:border-zinc-800 dark:bg-zinc-800'
                            }`}>
                            <ClockIcon className="w-20 h-20" />
                        </div>
                        {status === 'active' && (
                            <span className="absolute top-2 right-2 flex h-4 w-4">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
                            </span>
                        )}
                    </div>

                    <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
                        {status === 'loading' ? 'Cargando...' : status === 'active' ? '¡Estás Trabajando!' : 'Fuera de Turno'}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium">
                        {status === 'active' ? 'No olvides registrar tu salida.' : 'Registra tu entrada para comenzar.'}
                    </p>

                    {status !== 'loading' && (
                        status === 'inactive' ? (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleClockIn}
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
                            >
                                <ArrowRightOnRectangleIcon className="w-6 h-6" />
                                Registrar Entrada
                            </motion.button>
                        ) : (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleClockOut}
                                className="w-full py-4 bg-white dark:bg-zinc-800 text-red-500 border-2 border-red-100 dark:border-red-900/30 rounded-2xl font-bold text-lg shadow-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors flex items-center justify-center gap-2"
                            >
                                <ArrowLeftOnRectangleIcon className="w-6 h-6" />
                                Registrar Salida
                            </motion.button>
                        )
                    )}
                </motion.div>

                {/* Log Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-gray-100 dark:border-zinc-800 overflow-hidden lg:col-span-2"
                >
                    <div className="px-8 py-6 border-b border-gray-100 dark:border-zinc-800">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <UserIcon className="w-6 h-6 text-blue-500" />
                            Registro de Hoy
                        </h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100 dark:divide-zinc-800">
                            <thead className="bg-gray-50 dark:bg-zinc-800/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Empleado</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Entrada</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Salida</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Duración</th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-100 dark:divide-zinc-800">
                                {loading ? (
                                    <tr><td colSpan={5} className="text-center py-10 text-gray-400">Cargando registros...</td></tr>
                                ) : records.length === 0 ? (
                                    <tr><td colSpan={5} className="text-center py-10 text-gray-400">No hay registros de asistencia hoy.</td></tr>
                                ) : (
                                    records.map((record) => (
                                        <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-bold text-xs mr-3">
                                                        {record.userName.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{record.userName}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {formatTime(record.startTime)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {formatTime(record.endTime)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600 dark:text-gray-300">
                                                {calculateDuration(record.startTime, record.endTime)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${record.endTime
                                                    ? 'bg-gray-100 text-gray-800 dark:bg-zinc-800 dark:text-gray-400'
                                                    : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                    }`}>
                                                    {record.endTime ? 'Completado' : 'En Turno'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
