import { db } from './firebase';
import { collection, getDocs, doc, updateDoc, setDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { User } from '@/types';

const USERS_COLLECTION = 'users';

export const getUsers = async (restaurantId: string = 'default_restaurant'): Promise<User[]> => {
    try {
        // In a real multi-tenant app, filter by restaurantId. 
        // For now, we fetch all users or filter by a field if needed.
        const q = query(collection(db, USERS_COLLECTION));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            uid: doc.id,
            ...doc.data()
        } as User));
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
};

export const updateUserRole = async (userId: string, role: 'admin' | 'staff') => {
    try {
        const userRef = doc(db, USERS_COLLECTION, userId);
        await updateDoc(userRef, { role });
    } catch (error) {
        console.error('Error updating user role:', error);
        throw error;
    }
};

// This creates a Firestore document for the user. 
// Ideally, this is called after Firebase Auth sign-up triggers, or manually by admin.
export const createUserDoc = async (email: string, role: 'admin' | 'staff', name: string) => {
    try {
        // We use email as ID for simplicity in this MVP to link Auth easily if UID is not known yet,
        // BUT ideally we should use Auth UID. Since we are "pre-creating" users for them to log in later,
        // we might stick to a generated ID or try to use email as a lookup key.
        // Let's use a generated ID and store email.

        // Wait, to link with Firebase Auth later, usually we need the Auth UID.
        // Since we can't create Auth users from client SDK without logging out, 
        // we will create a "whitelist" document. When the user actually signs up/logs in, 
        // we can reconcile. OR we just use this for the "Employee List" view.
        // For this MVP, we will assume the Admin creates the doc, and we query by email.

        const newUserRef = doc(collection(db, USERS_COLLECTION));
        await setDoc(newUserRef, {
            email,
            name,
            role,
            createdAt: serverTimestamp(),
            restaurantId: 'default_restaurant'
        });
        return newUserRef.id;
    } catch (error) {
        console.error('Error creating user doc:', error);
        throw error;
    }
};
