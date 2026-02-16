import { db } from './firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, deleteDoc, doc, where } from 'firebase/firestore';

const EXPENSES_COLLECTION = 'expenses';

export interface Expense {
    id?: string;
    restaurantId: string;
    amount: number;
    description: string;
    registeredBy: string;
    registeredByName: string;
    timestamp: any;
}

export const addExpense = async (expense: Omit<Expense, 'id' | 'timestamp'>) => {
    try {
        await addDoc(collection(db, EXPENSES_COLLECTION), {
            ...expense,
            timestamp: serverTimestamp()
        });
    } catch (error) {
        console.error('Error adding expense:', error);
        throw error;
    }
};

export const getExpenses = async (restaurantId: string = 'default_restaurant'): Promise<Expense[]> => {
    try {
        const q = query(collection(db, EXPENSES_COLLECTION), where('restaurantId', '==', restaurantId), orderBy('timestamp', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Expense));
    } catch (error) {
        console.error('Error fetching expenses:', error);
        return [];
    }
};

export const deleteExpense = async (id: string) => {
    try {
        await deleteDoc(doc(db, EXPENSES_COLLECTION, id));
    } catch (error) {
        console.error('Error deleting expense:', error);
        throw error;
    }
};
