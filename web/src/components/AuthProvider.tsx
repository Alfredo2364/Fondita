'use client';

import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase/firebase';
import { useAuthStore } from '@/store/useAuthStore';
import { doc, getDoc } from 'firebase/firestore';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const { setUser, setLoading } = useAuthStore();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            let role: 'admin' | 'staff' | 'customer' | null = null;

            if (user) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        role = userDoc.data().role as any;
                    } else {
                        // Default role for new users if not found (optional, or handle registration)
                        // For now, let's assume if no doc, they are 'staff' for safety, or 'admin' for dev?
                        // Let's default to 'staff' to be safe, or null.
                    }
                } catch (error) {
                    console.error("Error fetching user role:", error);
                }
            }

            setUser(user, role);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [setUser, setLoading]);

    return <>{children}</>;
}
