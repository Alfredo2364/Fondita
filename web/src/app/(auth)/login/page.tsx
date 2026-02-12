'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/firebase';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Error executing login');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-950 p-4 font-sans overflow-hidden relative">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-orange-600/20 rounded-full blur-[150px] animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[150px] animate-pulse delay-1000" />
            </div>

            <motion.div
                initial={{ opacity: 0, rotateY: -20, scale: 0.9 }}
                animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                transition={{ duration: 0.8, type: "spring" }}
                className="w-full max-w-md relative z-10 perspective-1000"
            >
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10 transform-style-3d overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

                    {/* 3D Floating Header */}
                    <div className="text-center mb-10 transform-style-3d">
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-block relative"
                        >
                            <span className="text-6xl mb-2 block filter drop-shadow-2xl">🔥</span>
                            <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 drop-shadow-sm">
                                FONDITA 3D
                            </h2>
                            <p className="mt-2 text-sm font-medium text-gray-400 tracking-wider uppercase">
                                Panel Administrativo
                            </p>
                        </motion.div>
                    </div>

                    <form className="space-y-6 relative z-10" onSubmit={handleLogin}>
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="rounded-xl bg-red-500/20 border border-red-500/30 p-4 text-sm font-bold text-red-200 text-center"
                                >
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-4">
                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                <label className="sr-only">Email</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-orange-500 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
                                    </div>
                                    <input
                                        id="email-address"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="block w-full rounded-2xl border-2 border-white/5 bg-black/20 py-4 pl-12 text-white placeholder:text-gray-500 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium"
                                        placeholder="Correo Electrónico"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                <label className="sr-only">Contraseña</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-orange-500 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        className="block w-full rounded-2xl border-2 border-white/5 bg-black/20 py-4 pl-12 text-white placeholder:text-gray-500 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium"
                                        placeholder="Contraseña"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </motion.div>
                        </div>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: "0 10px 30px -10px rgba(234, 88, 12, 0.6)" }}
                                whileTap={{ scale: 0.95 }}
                                type="submit"
                                className="group relative flex w-full justify-center rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 px-4 py-4 text-md font-black text-white shadow-xl hover:to-red-500 border-t border-white/20 overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    INGRESAR AL SISTEMA <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </span>
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            </motion.button>
                        </motion.div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
