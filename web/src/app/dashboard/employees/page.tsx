'use client';

import { useState, useEffect } from 'react';
import { getUsers, updateUserRole, createUserDoc } from '@/lib/firebase/users';
import { User } from '@/types';
import { UserPlusIcon, EllipsisVerticalIcon, ShieldCheckIcon, UserIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

export const dynamic = 'force-dynamic';

export default function EmployeesPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // New User Form State
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newRole, setNewRole] = useState<'admin' | 'staff'>('staff');
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        const data = await getUsers();
        setUsers(data);
        setLoading(false);
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);
        try {
            // Llamar a la API route que usa Firebase Admin SDK
            const response = await fetch('/api/users/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: newEmail,
                    password: newPassword,
                    name: newName,
                    role: newRole
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al crear usuario');
            }

            alert('✅ Usuario creado exitosamente. Ya puede iniciar sesión.');
            setIsModalOpen(false);
            setNewName('');
            setNewEmail('');
            setNewPassword('');
            loadUsers(); // Refresh list
        } catch (error: any) {
            console.error(error);
            alert('❌ ' + error.message);
        } finally {
            setCreating(false);
        }
    };

    const handleRoleChange = async (userId: string, newRole: 'admin' | 'staff') => {
        try {
            await updateUserRole(userId, newRole);
            setUsers(prev => prev.map(u => u.uid === userId ? { ...u, role: newRole } : u));
        } catch (error) {
            console.error(error);
            alert('Error al actualizar rol');
        }
    };

    return (
        <div className="p-8 bg-gray-50 dark:bg-zinc-950 min-h-screen font-sans relative overflow-hidden">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[20%] right-[10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[10%] left-[20%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] animate-pulse delay-1000" />
            </div>

            <div className="relative z-10 flex justify-between items-center mb-10 perspective-1000">
                <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-500 drop-shadow-sm">
                        EQUIPO Y ROLES
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mt-1 text-lg">
                        Gestiona el acceso y personal de tu fondita
                    </p>
                </motion.div>

                <motion.button
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.05, translateY: -5, boxShadow: "0 20px 40px -10px rgba(99, 102, 241, 0.5)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsModalOpen(true)}
                    className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 font-bold text-lg border-t border-white/20 relative"
                >
                    <UserPlusIcon className="h-6 w-6" />
                    <span>Nuevo Empleado</span>
                </motion.button>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 50, rotateX: 5 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: 0.2 }}
                className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                <AnimatePresence>
                    {users.map((user, i) => (
                        <motion.div
                            key={user.uid || i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            whileHover={{ y: -10, scale: 1.02 }}
                            className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-zinc-800 relative group overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <EllipsisVerticalIcon className="h-6 w-6 text-gray-400" />
                            </div>

                            <div className="flex items-center gap-4 mb-4">
                                <div className={`h-16 w-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-lg ${user.role === 'admin'
                                    ? 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-purple-500/30'
                                    : 'bg-gradient-to-br from-blue-400 to-cyan-500 shadow-blue-500/30'
                                    }`}>
                                    {user.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="h-8 w-8" />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">{user.name || 'Sin Nombre'}</h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm truncate max-w-[150px]">{user.email}</p>
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Rol Asignado</label>
                                <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-zinc-800 rounded-xl">
                                    <button
                                        onClick={() => handleRoleChange(user.uid, 'admin')}
                                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${user.role === 'admin'
                                            ? 'bg-white dark:bg-zinc-700 text-purple-600 shadow-sm'
                                            : 'text-gray-400 hover:text-gray-600'
                                            }`}
                                    >
                                        Admin
                                    </button>
                                    <button
                                        onClick={() => handleRoleChange(user.uid, 'staff')}
                                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${user.role === 'staff'
                                            ? 'bg-white dark:bg-zinc-700 text-blue-500 shadow-sm'
                                            : 'text-gray-400 hover:text-gray-600'
                                            }`}
                                    >
                                        Staff
                                    </button>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-50 dark:border-zinc-800 flex justify-between items-center">
                                <span className="text-xs text-gray-400">ID: {user.uid.substring(0, 6)}...</span>
                                {user.role === 'admin' ? (
                                    <ShieldCheckIcon className="h-5 w-5 text-purple-500" title="Acceso Total" />
                                ) : (
                                    <UserIcon className="h-5 w-5 text-blue-500" title="Acceso Limitado" />
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

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
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white dark:bg-zinc-900 rounded-3xl p-8 w-full max-w-md relative z-10 shadow-2xl"
                        >
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Registrar Empleado</h2>
                            <form onSubmit={handleCreateUser} className="space-y-4">
                                <div>
                                    <label className="text-sm font-bold text-gray-500">Nombre Completo</label>
                                    <input
                                        className="w-full mt-1 px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-800 border-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                                        value={newName}
                                        onChange={e => setNewName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-gray-500">Correo Electrónico (Login)</label>
                                    <input
                                        type="email"
                                        className="w-full mt-1 px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-800 border-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                                        value={newEmail}
                                        onChange={e => setNewEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-gray-500">Contraseña (mínimo 6 caracteres)</label>
                                    <input
                                        type="password"
                                        className="w-full mt-1 px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-800 border-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                                        value={newPassword}
                                        onChange={e => setNewPassword(e.target.value)}
                                        required
                                        minLength={6}
                                        placeholder="••••••"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-gray-500">Rol Inicial</label>
                                    <div className="grid grid-cols-2 gap-3 mt-1">
                                        <button
                                            type="button"
                                            onClick={() => setNewRole('admin')}
                                            className={`py-3 rounded-xl font-bold border-2 transition-all ${newRole === 'admin' ? 'border-purple-500 bg-purple-50 text-purple-600' : 'border-gray-200 text-gray-400'}`}
                                        >
                                            Admin
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setNewRole('staff')}
                                            className={`py-3 rounded-xl font-bold border-2 transition-all ${newRole === 'staff' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200 text-gray-400'}`}
                                        >
                                            Staff
                                        </button>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={creating}
                                    className="w-full py-4 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-black font-black text-lg hover:opacity-90 transition-opacity mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {creating ? 'Creando...' : 'Guardar Empleado'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
